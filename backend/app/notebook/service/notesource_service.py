#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import uuid
from tempfile import TemporaryDirectory
from typing import Sequence, List
from fastapi import UploadFile
from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.notebook.crud.crud_notesource import note_source_dao
from backend.app.notebook.model import NoteSource, Embedding
from backend.app.notebook.schema.embedding import CreateEmbeddingParam
from backend.app.notebook.schema.notesource import CreateNoteSourceParam, UpdateNoteSourceParam
from backend.app.notebook.service.embedding_service import embedding_service
from backend.common.exception import errors
from backend.core.conf import settings
from backend.database.db_mysql import async_db_session
from sapperrag import DocumentReader, TextFileChunker, ChunkEmbedder
from sapperrag.embedding import OpenAIEmbedding


class NoteSourceService:
    @staticmethod
    async def get(*, pk: int) -> NoteSource:
        """
        获取指定的来源
        """
        async with async_db_session() as db:
            source = await note_source_dao.get_with_notebooks(db, pk)
            if not source:
                raise errors.NotFoundError(msg='来源不存在')
            return source

    @staticmethod
    async def get_by_uuid(*, uuid: str) -> NoteSource:
        """
        获取指定的来源
        """
        async with async_db_session() as db:
            source = await note_source_dao.get_with_notebooks_by_uuid(db, uuid)
            if not source:
                raise errors.NotFoundError(msg='来源不存在')
            return source

    @staticmethod
    async def get_all() -> Sequence[NoteSource]:
        """
        获取所有来源
        """
        async with async_db_session() as db:
            sources = await note_source_dao.get_all(db)
            return sources

    @staticmethod
    async def get_select(*, tittle: str = None, active: bool = None) -> Select:
        """
        获取符合条件的来源列表
        """
        return await note_source_dao.get_list(tittle=tittle, active=active)

    @staticmethod
    # 在循环中创建并提交单独的事务
    async def insert_embeddings(db: AsyncSession, notesource_id: int, embed_result: list) -> None:
        for embed in embed_result:
            try:
                # 使用独立的事务来插入每个嵌入记录，减少锁持有的时间
                async with db.begin():
                    obj = CreateEmbeddingParam(
                        uuid=str(uuid.uuid4()),
                        content=embed.text,
                        embedding=await embedding_service.encode_embedding(embed.text_embedding),
                        notesource_id=notesource_id
                    )
                    await embedding_service.create(obj=obj)
            except Exception as e:
                print(f"Failed to insert embedding: {e}")

    @staticmethod
    async def create(*, file: UploadFile, obj: CreateNoteSourceParam) -> NoteSource:
        with TemporaryDirectory() as temp_dir:
            temp_file_path = os.path.join(temp_dir, file.filename)

            content = await file.read()
            with open(temp_file_path, 'wb') as tmp_file:
                tmp_file.write(content)

            local_file_reader = DocumentReader()
            read_result = local_file_reader.read(temp_dir)
            obj.content = read_result[0].raw_content

            text_file_chunker = TextFileChunker()
            chunk_result = text_file_chunker.chunk(read_result)

            embeder = OpenAIEmbedding(settings.OPENAI_KEY, settings.OPENAI_BASE_URL, "text-embedding-3-small")
            chunk_embedder = ChunkEmbedder(embeder)
            embed_result = chunk_embedder.embed(chunk_result)

            async with async_db_session.begin() as db:
                source = await note_source_dao.get_by_uuid(db, obj.uuid)
                if source:
                    raise errors.ForbiddenError(msg='来源已存在')
                note_source = await note_source_dao.create(db, obj)

            # 插入 embeddings，使用单独事务减少锁等待超时问题
            await NoteSourceService.insert_embeddings(db, note_source.id, embed_result)

            return note_source

    @staticmethod
    async def update(*, pk: int, obj: UpdateNoteSourceParam) -> int:
        """
        更新指定来源
        """
        async with async_db_session.begin() as db:
            source = await note_source_dao.get(db, pk)
            if not source:
                raise errors.NotFoundError(msg='来源不存在')
            if source.uuid != obj.uuid:
                existing_source = await note_source_dao.get_by_uuid(db, obj.uuid)
                if existing_source:
                    raise errors.ForbiddenError(msg='具有相同 UUID 的来源已存在')
            count = await note_source_dao.update(db, pk, obj)
            return count

    @staticmethod
    async def update_source_notebooks(*, pk: int, notebook_ids: list[int]) -> int:
        """
        更新来源的关联笔记本
        """
        async with async_db_session.begin() as db:
            source = await note_source_dao.get(db, pk)
            if not source:
                raise errors.NotFoundError(msg='来源不存在')
            count = await note_source_dao.update_notebooks(db, pk, notebook_ids)
            return count

    @staticmethod
    async def delete(*, pk: list[int]) -> int:
        """
        删除指定的来源
        """
        async with async_db_session.begin() as db:
            count = await note_source_dao.delete(db, pk)
            return count


note_source_service = NoteSourceService()
