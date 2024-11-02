#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Sequence

from fastapi import Request
from sqlalchemy import Select

from backend.app.notebook.crud.crud_notebook import notebook_dao
from backend.app.notebook.model import Notebook
from backend.app.notebook.schema.notebook import CreateNotebookParam, UpdateNotebookParam
from backend.common.exception import errors
from backend.database.db_mysql import async_db_session


class NotebookService:
    @staticmethod
    async def get(*, pk: int) -> Notebook:
        """
        获取指定的笔记本
        """
        async with async_db_session() as db:
            notebook = await notebook_dao.get_with_sources(db, pk)
            if not notebook:
                raise errors.NotFoundError(msg='笔记本不存在')
            return notebook

    @staticmethod
    async def get_by_uuid(*, uuid: str) -> Notebook:
        """
        获取指定的来源
        """
        async with async_db_session() as db:
            notebook = await notebook_dao.get_with_sources_by_uuid(db, uuid)
            if not notebook:
                raise errors.NotFoundError(msg='笔记本不存在')
            return notebook

    @staticmethod
    async def get_all() -> Sequence[Notebook]:
        """
        获取所有笔记本
        """
        async with async_db_session() as db:
            notebooks = await notebook_dao.get_all(db)
            return notebooks

    @staticmethod
    async def get_user_notebooks(*, user_uuid: str) -> Sequence[Notebook]:
        """
        获取指定用户的所有笔记本
        """
        async with async_db_session() as db:
            notebooks = await notebook_dao.get_user_notebooks(db, user_uuid=user_uuid)
            return notebooks

    @staticmethod
    async def get_select(*, tittle: str = None, active: bool = None) -> Select:
        """
        获取符合条件的笔记本列表
        """
        return await notebook_dao.get_list(tittle=tittle, active=active)

    @staticmethod
    async def create(*, obj: CreateNotebookParam) -> None:
        """
        创建新的笔记本
        """
        async with async_db_session.begin() as db:
            notebook = await notebook_dao.get_by_uuid(db, obj.uuid)
            if notebook:
                raise errors.ForbiddenError(msg='笔记本已存在')
            await notebook_dao.create(db, obj)

    @staticmethod
    async def update(*, pk: int, obj: UpdateNotebookParam) -> int:
        """
        更新指定笔记本
        """
        async with async_db_session.begin() as db:
            notebook = await notebook_dao.get(db, pk)
            if not notebook:
                raise errors.NotFoundError(msg='笔记本不存在')
            # if notebook.uuid != obj.uuid:
            #     existing_notebook = await notebook_dao.get_by_uuid(db, obj.uuid)
            #     if existing_notebook:
            #         raise errors.ForbiddenError(msg='具有相同 UUID 的笔记本已存在')
            count = await notebook_dao.update(db, pk, obj)
            return count

    @staticmethod
    async def update_notebook_sources(*, pk: int, source_ids: list[int]) -> int:
        """
        更新笔记本的来源
        """
        async with async_db_session.begin() as db:
            notebook = await notebook_dao.get(db, pk)
            if not notebook:
                raise errors.NotFoundError(msg='笔记本不存在')
            count = await notebook_dao.update_sources(db, pk, source_ids)
            return count

    @staticmethod
    async def delete(*, pk: list[int]) -> int:
        """
        删除指定的笔记本
        """
        async with async_db_session.begin() as db:
            count = await notebook_dao.delete(db, pk)
            return count


notebook_service = NotebookService()
