#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Sequence
from sqlalchemy import Select

from backend.app.notebook.crud.crud_note import note_dao
from backend.app.notebook.model import Note
from backend.app.notebook.schema.note import CreateNoteParam, UpdateNoteParam  # 假设存在这些 schema
from backend.common.exception import errors
from backend.database.db_mysql import async_db_session


class NoteService:
    @staticmethod
    async def get(*, pk: int) -> Note:
        """
        获取指定的笔记
        """
        async with async_db_session() as db:
            note = await note_dao.get_with_notebooks(db, pk)
            if not note:
                raise errors.NotFoundError(msg='笔记不存在')
            return note

    @staticmethod
    async def get_all() -> Sequence[Note]:
        """
        获取所有笔记
        """
        async with async_db_session() as db:
            notes = await note_dao.get_all(db)
            return notes

    @staticmethod
    async def get_select(*, tittle: str = None, active: bool = None) -> Select:
        """
        获取符合条件的笔记列表
        """
        return await note_dao.get_list(tittle=tittle, active=active)

    @staticmethod
    async def create(*, obj: CreateNoteParam) -> Note:
        """
        创建新的笔记
        """
        async with async_db_session.begin() as db:
            note = await note_dao.get_by_uuid(db, obj.uuid)
            if note:
                raise errors.ForbiddenError(msg='笔记已存在')
            return await note_dao.create(db, obj)

    @staticmethod
    async def update(*, pk: int, obj: UpdateNoteParam) -> int:
        """
        更新指定笔记
        """
        async with async_db_session.begin() as db:
            note = await note_dao.get(db, pk)
            if not note:
                raise errors.NotFoundError(msg='笔记不存在')
            # if note.uuid != obj.uuid:
            #     existing_note = await note_dao.get_by_uuid(db, obj.uuid)
            #     if existing_note:
            #         raise errors.ForbiddenError(msg='具有相同 UUID 的笔记已存在')
            count = await note_dao.update(db, pk, obj)
            return count

    @staticmethod
    async def update_note_notebooks(*, pk: int, notebook_ids: list[int]) -> int:
        """
        更新笔记的关联笔记本
        """
        async with async_db_session.begin() as db:
            note = await note_dao.get(db, pk)
            if not note:
                raise errors.NotFoundError(msg='笔记不存在')
            count = await note_dao.update_notebooks(db, pk, notebook_ids)
            return count

    @staticmethod
    async def delete(*, pk: list[int]) -> int:
        """
        删除指定的笔记
        """
        async with async_db_session.begin() as db:
            count = await note_dao.delete(db, pk)
            return count


note_service = NoteService()
