#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import asyncio
import base64
from typing import Sequence, List

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import Select

from backend.app.notebook.crud.crud_embedding import embedding_dao
from backend.app.notebook.model import Embedding
from backend.app.notebook.schema.embedding import CreateEmbeddingParam, UpdateEmbeddingParam, GetEmbeddingDetails
from backend.common.exception import errors
from backend.core.conf import settings
from backend.database.db_mysql import async_db_session
from sapperrag.embedding import OpenAIEmbedding


class EmbeddingService:
    @staticmethod
    async def encode_embedding(embedding: np.ndarray) -> str:
        return base64.b64encode(embedding.tobytes()).decode('utf-8')

    @staticmethod
    async def decode_embedding(encoded_embedding: str) -> np.ndarray:
        return np.frombuffer(base64.b64decode(encoded_embedding), dtype=np.float32)

    @staticmethod
    async def get(*, pk: int) -> Embedding:
        """
        获取指定的 Embedding
        """
        async with async_db_session() as db:
            embedding = await embedding_dao.get_with_source(db, pk)
            if not embedding:
                raise errors.NotFoundError(msg='Embedding 不存在')
            return embedding

    @staticmethod
    async def get_all() -> Sequence[Embedding]:
        """
        获取所有 Embeddings
        """
        async with async_db_session() as db:
            embeddings = await embedding_dao.get_all(db)
            return embeddings

    @staticmethod
    async def get_select(*, source_id: int = None, content: str = None) -> Select:
        """
        获取符合条件的 Embedding 列表
        """
        return await embedding_dao.get_list(source_id=source_id, content=content)

    @staticmethod
    async def decode_embedding_async(embedding: Embedding) -> Embedding:
        if embedding.embedding:
            embedding.embedding = await EmbeddingService.decode_embedding(embedding.embedding)
        return embedding

    @staticmethod
    async def get_embeddings_by_query(note_source_ids: List[int], query: str, topK: int) -> List[GetEmbeddingDetails]:
        """
        根据查询获取最相似的嵌入结果。

        :param note_source_ids: 待查询的 note source IDs 列表。
        :param query: 查询的文本。
        :param topK: 返回的嵌入数量。
        :return: 与查询最相似的嵌入列表。
        """
        async with async_db_session() as db:
            tasks = []
            all_embeddings = []
            for source_id in note_source_ids:
                # 获取嵌入列表
                embeddings_stmt = await embedding_service.get_select(source_id=source_id)
                embeddings_db = await db.execute(embeddings_stmt)

                # 对嵌入结果解码
                embeddings = [GetEmbeddingDetails.from_orm(embedding) for embedding in embeddings_db.scalars().all()]


                # for embedding in embeddings:
                #     tasks.append(EmbeddingService.decode_embedding_async(embedding))
                all_embeddings.extend(embeddings)
            # 并发处理所有解码任务
            # all_embeddings = await asyncio.gather(*tasks)

            # 获取查询的嵌入表示
            embedder = OpenAIEmbedding(settings.OPENAI_KEY, settings.OPENAI_BASE_URL, "text-embedding-ada-002")
            query_embedding = np.array(embedder.embed(query), dtype=np.float32)
            # 计算每个嵌入与查询的相似度
            for emb in all_embeddings:
                stored_embedding = np.frombuffer(base64.b64decode(emb.embedding), dtype=np.float32)
                emb.similarity = cosine_similarity(query_embedding.reshape(1, -1), stored_embedding.reshape(1, -1))[0][
                    0]

            # 按相似度排序并返回 topK 的嵌入
            sorted_embeddings = sorted(all_embeddings, key=lambda x: x.similarity, reverse=True)
            top_k_embeddings = sorted_embeddings[:topK]

            return top_k_embeddings

    @staticmethod
    async def create(*, obj: CreateEmbeddingParam) -> Embedding:
        """
        创建新的 Embedding
        """
        async with async_db_session.begin() as db:
            embedding = await embedding_dao.get_by_uuid(db, obj.uuid)
            if embedding:
                raise errors.ForbiddenError(msg='Embedding 已存在')
            return await embedding_dao.create(db, obj)

    @staticmethod
    async def update(*, pk: int, obj: UpdateEmbeddingParam) -> int:
        """
        更新指定 Embedding
        """
        async with async_db_session.begin() as db:
            embedding = await embedding_dao.get(db, pk)
            if not embedding:
                raise errors.NotFoundError(msg='Embedding 不存在')
            count = await embedding_dao.update(db, pk, obj)
            return count

    @staticmethod
    async def update_embedding_source(*, pk: int, source_id: int) -> int:
        """
        更新 Embedding 的关联 NoteSource
        """
        async with async_db_session.begin() as db:
            embedding = await embedding_dao.get(db, pk)
            if not embedding:
                raise errors.NotFoundError(msg='Embedding 不存在')
            count = await embedding_dao.update_source(db, pk, source_id)
            return count

    @staticmethod
    async def delete(*, pk: list[int]) -> int:
        """
        删除指定的 Embedding
        """
        async with async_db_session.begin() as db:
            count = await embedding_dao.delete(db, pk)
            return count


embedding_service = EmbeddingService()
