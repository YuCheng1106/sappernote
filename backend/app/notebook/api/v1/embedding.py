#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import uuid
from typing import Annotated, List

from fastapi import APIRouter, Depends, Path, Query, Body
from pydantic import Field

from backend.app.notebook.schema.embedding import CreateEmbeddingParam, GetEmbeddingDetails, UpdateEmbeddingParam
from backend.app.notebook.service.embedding_service import embedding_service
from backend.common.pagination import DependsPagination, paging_data
from backend.common.response.response_schema import ResponseModel, response_base
from backend.common.security.jwt import DependsJwtAuth
from backend.database.db_mysql import CurrentSession
from backend.utils.serializers import select_as_dict, select_list_serialize

router = APIRouter()

@router.get('/all', summary='获取所有 Embeddings')
async def get_all_embeddings() -> ResponseModel:
    embeddings = await embedding_service.get_all()
    data = [GetEmbeddingDetails.from_orm(embedding) for embedding in embeddings]
    return response_base.success(data=data)

@router.get('/{pk}', summary='获取 Embedding 详情')
async def get_embedding(pk: Annotated[int, Path(...)]) -> ResponseModel:
    embedding = await embedding_service.get(pk=pk)
    data = GetEmbeddingDetails(**select_as_dict(embedding))
    return response_base.success(data=data)

@router.get(
    '',
    summary='（模糊条件）分页获取所有 Embeddings',
    dependencies=[DependsJwtAuth, DependsPagination],
)
async def get_pagination_embeddings(
    db: CurrentSession,
    source_uuid: Annotated[str | None, Query()] = None,
    content: Annotated[str | None, Query()] = None,
) -> ResponseModel:
    embedding_select = await embedding_service.get_select(source_uuid=source_uuid, content=content)
    page_data = await paging_data(db, embedding_select, GetEmbeddingDetails)
    return response_base.success(data=page_data)

@router.post(
    '',
    summary='创建 Embedding'
)
async def create_embedding(
    source_id: Annotated[int, Body(..., embed=True, description="来源 ID")],
    content: str = Body('', embed=True, description="Embedding 内容"),
    embedding_vector: str = Body('', embed=True, description="嵌入向量"),
) -> ResponseModel:
    obj = CreateEmbeddingParam(
        uuid=str(uuid.uuid4()),
        source_uuid=str(uuid.uuid4()),  # 自动生成 source_uuid
        index="",
        content=content,
        embedding=embedding_vector
    )
    embedding = await embedding_service.create(obj=obj)
    await embedding_service.update_embedding_source(pk=embedding.id, source_id=source_id)
    data = GetEmbeddingDetails(**select_as_dict(embedding))
    return response_base.success(data=data)

@router.put(
    '/{pk}',
    summary='更新 Embedding',
)
async def update_embedding(pk: Annotated[int, Path(...)], obj: UpdateEmbeddingParam) -> ResponseModel:
    count = await embedding_service.update(pk=pk, obj=obj)
    if count > 0:
        return response_base.success()
    return response_base.fail()

@router.put(
    '/{pk}/source',
    summary='更新 Embedding 关联的来源',
    dependencies=[DependsJwtAuth],
)
async def update_embedding_source(
    pk: Annotated[int, Path(...)], source_id: Annotated[int, Query(...)]) -> ResponseModel:
    count = await embedding_service.update_embedding_source(pk=pk, source_id=source_id)
    if count > 0:
        return response_base.success()
    return response_base.fail()

@router.delete(
    '',
    summary='（批量）删除 Embeddings',
    dependencies=[DependsJwtAuth],
)
async def delete_embeddings(pk: Annotated[List[int], Query(...)]) -> ResponseModel:
    count = await embedding_service.delete(pk=pk)
    if count > 0:
        return response_base.success(data=pk)
    return response_base.fail()
