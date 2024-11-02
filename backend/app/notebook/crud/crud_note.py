from typing import Sequence
from sqlalchemy import Select, desc, select
from sqlalchemy.orm import selectinload
from sqlalchemy_crud_plus import CRUDPlus
from backend.app.notebook.model import Notebook, Note
from backend.app.notebook.schema.note import CreateNoteParam, UpdateNoteParam  # 假设存在这些 schema


class CRUDNote(CRUDPlus[Note]):
    async def get(self, db, note_id: int) -> Note | None:
        """
        获取指定笔记

        :param db:
        :param note_id:
        :return:
        """
        return await self.select_model(db, note_id)

    async def get_with_notebooks(self, db, note_id: int) -> Note | None:
        """
        获取笔记及其关联的笔记本

        :param db:
        :param note_id:
        :return:
        """
        stmt = select(self.model).options(selectinload(self.model.notebooks)).where(self.model.id == note_id)
        note = await db.execute(stmt)
        return note.scalars().first()

    async def get_all(self, db) -> Sequence[Note]:
        """
        获取所有笔记

        :param db:
        :return:
        """
        stmt = select(self.model).options(selectinload(self.model.notebooks)).order_by(desc(self.model.created_time))
        notes = await db.execute(stmt)
        return notes.scalars().all()

    async def get_list(self, tittle: str = None, active: bool = None) -> Select:
        """
        获取笔记列表

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

    async def get_by_uuid(self, db, uuid: str) -> Note | None:
        """
        通过 uuid 获取笔记

        :param db:
        :param uuid:
        :return:
        """
        return await self.select_model_by_column(db, uuid=uuid)

    async def create(self, db, obj_in: CreateNoteParam) -> Note:
        """
        创建新笔记

        :param db:
        :param obj_in:
        :return:
        """
        note = await self.create_model(db, obj_in)
        return note

    async def update(self, db, note_id: int, obj_in: UpdateNoteParam) -> int:
        """
        更新指定笔记

        :param db:
        :param note_id:
        :param obj_in:
        :return:
        """
        return await self.update_model(db, note_id, obj_in)

    async def update_notebooks(self, db, note_id: int, notebook_ids: list[int]) -> int:
        """
        更新笔记的关联笔记本

        :param db:
        :param note_id:
        :param notebook_ids:
        :return:
        """
        current_note = await self.get_with_notebooks(db, note_id)
        stmt = select(Notebook).where(Notebook.id.in_(notebook_ids))
        notebooks = await db.execute(stmt)
        current_note.notebooks = notebooks.scalars().all()
        return len(current_note.notebooks)

    async def delete(self, db, note_ids: list[int]) -> int:
        """
        删除指定的笔记

        :param db:
        :param note_ids:
        :return:
        """
        return await self.delete_model_by_column(db, allow_multiple=True, id__in=note_ids)


note_dao: CRUDNote = CRUDNote(Note)
