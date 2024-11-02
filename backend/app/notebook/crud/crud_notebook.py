from typing import Sequence
from sqlalchemy import Select, desc, select
from sqlalchemy.orm import selectinload
from sqlalchemy_crud_plus import CRUDPlus
from backend.app.notebook.model import Notebook, NoteSource, Note
from backend.app.notebook.schema.notebook import CreateNotebookParam, UpdateNotebookParam


class CRUDNotebook(CRUDPlus[Notebook]):
    async def get(self, db, notebook_id: int) -> Notebook | None:
        """
        获取指定笔记本

        :param db:
        :param notebook_id:
        :return:
        """
        return await self.select_model(db, notebook_id)

    async def get_with_sources(self, db, notebook_id: int) -> Notebook | None:
        """
        获取笔记本及其关联的来源

        :param db:
        :param notebook_id:
        :return:
        """
        stmt = select(self.model).\
            options(selectinload(self.model.source)).\
            options(selectinload(self.model.notes)).where(self.model.id == notebook_id)
        notebook = await db.execute(stmt)
        return notebook.scalars().first()

    async def get_with_notes(self, db, notebook_id: int) -> Notebook | None:
        """
        获取笔记本及其关联的来源

        :param db:
        :param notebook_id:
        :return:
        """
        stmt = select(self.model).\
            options(selectinload(self.model.source)).\
            options(selectinload(self.model.notes)).where(self.model.id == notebook_id)
        notebook = await db.execute(stmt)
        return notebook.scalars().first()

    async def get_with_sources_by_uuid(self, db, notebook_uuid: str) -> Notebook | None:
        """
        获取笔记本及其关联的来源

        :param db:
        :param notebook_id:
        :return:
        """
        stmt = select(self.model).\
            options(selectinload(self.model.source)).\
            options(selectinload(self.model.notes)).where(self.model.uuid == notebook_uuid)
        notebook = await db.execute(stmt)
        return notebook.scalars().first()

    async def get_all(self, db) -> Sequence[Notebook]:
        """
        获取所有笔记本

        :param db:
        :return:
        """
        stmt = select(self.model)\
            .options(selectinload(self.model.source)).order_by(desc(self.model.created_time))\
            .options(selectinload(self.model.notes)).order_by(desc(self.model.created_time))
        where_list = []
        if where_list:
            stmt = stmt.where(*where_list)
        notebooks = await db.execute(stmt)
        return notebooks.scalars().all()

    async def get_user_notebooks(self, db, user_uuid: str) -> Sequence[Notebook]:
        """
        获取指定用户的所有笔记本

        :param db:
        :param user_uuid:
        :return:
        """
        stmt = select(self.model).where(self.model.user_uuid == user_uuid)
        notebooks = await db.execute(stmt)
        return notebooks.scalars().all()

    async def get_list(self, tittle: str = None, active: bool = None) -> Select:
        """
        获取笔记本列表

        :param tittle:
        :param active:
        :return:
        """
        stmt = select(self.model).options(selectinload(self.model.source)).order_by(desc(self.model.created_time))
        where_list = []
        if tittle:
            where_list.append(self.model.tittle.like(f'%{tittle}%'))
        if active is not None:
            where_list.append(self.model.active == active)
        if where_list:
            stmt = stmt.where(*where_list)
        return stmt

    async def get_by_uuid(self, db, uuid: str) -> Notebook | None:
        """
        通过 uuid 获取笔记本

        :param db:
        :param uuid:
        :return:
        """
        return await self.select_model_by_column(db, uuid=uuid)

    async def create(self, db, obj_in: CreateNotebookParam) -> None:
        """
        创建新笔记本

        :param db:
        :param obj_in:
        :return:
        """
        await self.create_model(db, obj_in)

    async def update(self, db, notebook_id: int, obj_in: UpdateNotebookParam) -> int:
        """
        更新指定笔记本

        :param db:
        :param notebook_id:
        :param obj_in:
        :return:
        """
        return await self.update_model(db, notebook_id, obj_in)

    async def update_sources(self, db, notebook_id: int, source_ids: list[int]) -> int:
        """
        更新笔记本的来源

        :param db:
        :param notebook_id:
        :param source_ids:
        :return:
        """
        current_notebook = await self.get_with_sources(db, notebook_id)
        # 更新来源
        stmt = select(NoteSource).where(NoteSource.id.in_(source_ids))
        sources = await db.execute(stmt)
        current_notebook.source = sources.scalars().all()
        return len(current_notebook.source)

    async def update_notes(self, db, notebook_id: int, note_ids: list[int]) -> int:
        """
        更新笔记本的来源

        :param db:
        :param notebook_id:
        :param source_ids:
        :return:
        """
        current_notebook = await self.get_with_notes(db, notebook_id)
        # 更新来源
        stmt = select(Note).where(Note.id.in_(note_ids))
        notes = await db.execute(stmt)
        current_notebook.notes = notes.scalars().all()
        return len(current_notebook.notes)

    async def delete(self, db, notebook_ids: list[int]) -> int:
        """
        删除指定的笔记本

        :param db:
        :param notebook_ids:
        :return:
        """
        return await self.delete_model_by_column(db, allow_multiple=True, id__in=notebook_ids)


notebook_dao: CRUDNotebook = CRUDNotebook(Notebook)
