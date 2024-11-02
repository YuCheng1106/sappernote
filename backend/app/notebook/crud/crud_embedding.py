from typing import Sequence
from sqlalchemy import Select, desc, select
from sqlalchemy.orm import selectinload
from sqlalchemy_crud_plus import CRUDPlus
from backend.app.notebook.model import Embedding, NoteSource
from backend.app.notebook.schema.embedding import CreateEmbeddingParam, UpdateEmbeddingParam


class CRUDEmbedding(CRUDPlus[Embedding]):
    async def get(self, db, embedding_id: int) -> Embedding | None:
        """
        获取指定 Embedding

        :param db:
        :param embedding_id:
        :return:
        """
        return await self.select_model(db, embedding_id)

    async def get_with_source(self, db, embedding_id: int) -> Embedding | None:
        """
        获取 Embedding 及其关联的 NoteSource

        :param db:
        :param embedding_id:
        :return:
        """
        stmt = select(self.model).options(selectinload(self.model.note_source)).where(self.model.id == embedding_id)
        embedding = await db.execute(stmt)
        return embedding.scalars().first()

    async def get_all(self, db) -> Sequence[Embedding]:
        """
        获取所有 Embeddings

        :param db:
        :return:
        """
        stmt = select(self.model).options(selectinload(self.model.note_source)).order_by(desc(self.model.created_time))
        embeddings = await db.execute(stmt)
        return embeddings.scalars().all()

    async def get_list(self, source_id: int = None, content: str = None) -> Select:
        """
        获取 Embedding 列表

        :param source_uuid: 通过 NoteSource 的 UUID 筛选
        :param content: 通过 Embedding 内容筛选
        :return:
        """
        stmt = select(self.model).options(selectinload(self.model.note_source)).order_by(desc(self.model.created_time))
        where_list = []
        if source_id:
            where_list.append(self.model.notesource_id == source_id)
        if content:
            where_list.append(self.model.content.like(f'%{content}%'))
        if where_list:
            stmt = stmt.where(*where_list)
        return stmt

    async def get_by_uuid(self, db, uuid: str) -> Embedding | None:
        """
        通过 uuid 获取 Embedding

        :param db:
        :param uuid:
        :return:
        """
        return await self.select_model_by_column(db, uuid=uuid)

    async def create(self, db, obj_in: CreateEmbeddingParam) -> Embedding:
        """
        创建新 Embedding

        :param db:
        :param obj_in:
        :return:
        """
        embedding = await self.create_model(db, obj_in)
        return embedding

    async def update(self, db, embedding_id: int, obj_in: UpdateEmbeddingParam) -> int:
        """
        更新指定 Embedding

        :param db:
        :param embedding_id:
        :param obj_in:
        :return:
        """
        return await self.update_model(db, embedding_id, obj_in)

    async def update_source(self, db, embedding_id: int, source_id: int) -> int:
        """
        更新 Embedding 的关联 NoteSource

        :param db:
        :param embedding_id:
        :param source_id:
        :return:
        """
        current_embedding = await self.get_with_source(db, embedding_id)
        stmt = select(NoteSource).where(NoteSource.id == source_id)
        source = await db.execute(stmt)
        current_embedding.note_source = source.scalars().first()
        return current_embedding.note_source.id

    async def delete(self, db, embedding_ids: list[int]) -> int:
        """
        删除指定的 Embedding

        :param db:
        :param embedding_ids:
        :return:
        """
        return await self.delete_model_by_column(db, allow_multiple=True, id__in=embedding_ids)


embedding_dao: CRUDEmbedding = CRUDEmbedding(Embedding)
