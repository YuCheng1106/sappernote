from typing import Sequence
from sqlalchemy import Select, desc, select
from sqlalchemy.orm import selectinload
from sqlalchemy_crud_plus import CRUDPlus
from backend.app.notebook.model import Notebook, NoteSource
from backend.app.notebook.schema.notesource import CreateNoteSourceParam, UpdateNoteSourceParam


class CRUDNoteSource(CRUDPlus[NoteSource]):
    async def get(self, db, source_id: int) -> NoteSource | None:
        """
        获取指定来源

        :param db:
        :param source_id:
        :return:
        """
        return await self.select_model(db, source_id)

    async def get_with_notebooks(self, db, source_id: int) -> NoteSource | None:
        """
        获取来源及其关联的笔记本

        :param db:
        :param source_id:
        :return:
        """
        stmt = select(self.model).options(selectinload(self.model.notebooks)).where(self.model.id == source_id)
        source = await db.execute(stmt)
        return source.scalars().first()

    async def get_with_notebooks_by_uuid(self, db, uuid: str) -> NoteSource | None:
        """
        获取来源及其关联的笔记本

        :param db:
        :param source_id:
        :return:
        """
        stmt = select(self.model).options(selectinload(self.model.notebooks)).where(self.model.uuid == uuid)
        source = await db.execute(stmt)
        return source.scalars().first()

    async def get_all(self, db) -> Sequence[NoteSource]:
        """
        获取所有来源

        :param db:
        :return:
        """
        stmt = select(self.model).options(selectinload(self.model.notebooks)).order_by(desc(self.model.created_time))
        sources = await db.execute(stmt)
        return sources.scalars().all()

    async def get_list(self, tittle: str = None, active: bool = None) -> Select:
        """
        获取来源列表

        :param tittle:
        :param active:
        :return:
        """
        stmt = select(self.model).options(selectinload(self.model.notebooks)).order_by(desc(self.model.created_time))
        where_list = []
        if tittle:
            where_list.append(self.model.tittle.like(f'%{tittle}%'))
        if active is not None:
            where_list.append(self.model.active == active)
        if where_list:
            stmt = stmt.where(*where_list)
        return stmt

    async def get_by_uuid(self, db, uuid: str) -> NoteSource | None:
        """
        通过 uuid 获取来源

        :param db:
        :param uuid:
        :return:
        """
        return await self.select_model_by_column(db, uuid=uuid)

    async def create(self, db, obj_in: CreateNoteSourceParam) -> NoteSource:
        """
        创建新来源

        :param db:
        :param obj_in:
        :return:
        """
        return await self.create_model(db, obj_in)

    async def update(self, db, source_id: int, obj_in: UpdateNoteSourceParam) -> int:
        """
        更新指定来源

        :param db:
        :param source_id:
        :param obj_in:
        :return:
        """
        return await self.update_model(db, source_id, obj_in)

    async def update_notebooks(self, db, source_id: int, notebook_ids: list[int]) -> int:
        """
        更新来源的笔记本

        :param db:
        :param source_id:
        :param notebook_ids:
        :return:
        """
        current_source = await self.get_with_notebooks(db, source_id)
        # 更新关联的笔记本
        stmt = select(Notebook).where(Notebook.id.in_(notebook_ids))
        notebooks = await db.execute(stmt)
        current_source.notebooks = notebooks.scalars().all()
        return len(current_source.notebooks)

    async def delete(self, db, source_ids: list[int]) -> int:
        """
        删除指定的来源

        :param db:
        :param source_ids:
        :return:
        """
        return await self.delete_model_by_column(db, allow_multiple=True, id__in=source_ids)


note_source_dao: CRUDNoteSource = CRUDNoteSource(NoteSource)
