#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Sequence

from sqlalchemy import Select
from backend.app.notebook.crud.crud_notesource import note_source_dao
from backend.app.notebook.model import NoteSource
from backend.app.notebook.schema.notesource import CreateNoteSourceParam, UpdateNoteSourceParam
from backend.common.exception import errors
from backend.database.db_mysql import async_db_session


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
    async def create(*, obj: CreateNoteSourceParam) -> NoteSource:
        """
        创建新的来源
        """
        async with async_db_session.begin() as db:
            source = await note_source_dao.get_by_uuid(db, obj.uuid)
            if source:
                raise errors.ForbiddenError(msg='来源已存在')
            return await note_source_dao.create(db, obj)

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
