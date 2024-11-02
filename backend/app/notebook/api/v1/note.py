#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, Body, UploadFile, File
from pydantic import Field

from backend.app.notebook.schema.note import CreateNoteParam, GetNoteListDetails, UpdateNoteParam
from backend.app.notebook.service.note_service import note_service
from backend.common.pagination import DependsPagination, paging_data
from backend.common.response.response_schema import ResponseModel, response_base
from backend.common.security.jwt import DependsJwtAuth
from backend.database.db_mysql import CurrentSession
from backend.utils.serializers import select_as_dict, select_list_serialize

router = APIRouter()


@router.get('/all', summary='获取所有笔记')
async def get_all_notes() -> ResponseModel:
    notes = await note_service.get_all()
    data = [GetNoteListDetails.from_orm(note) for note in notes]
    return response_base.success(data=data)


@router.get('/{pk}', summary='获取笔记详情')
async def get_note(pk: Annotated[int, Path(...)]) -> ResponseModel:
    note = await note_service.get(pk=pk)
    data = GetNoteListDetails(**select_as_dict(note))
    return response_base.success(data=data)


@router.get(
    '',
    summary='（模糊条件）分页获取所有笔记',
    dependencies=[
        DependsJwtAuth,
        DependsPagination,
    ],
)
async def get_pagination_notes(
    db: CurrentSession,
    title: Annotated[str | None, Query()] = None,
    active: Annotated[bool | None, Query()] = None,
) -> ResponseModel:
    note_select = await note_service.get_select(title=title, active=active)
    page_data = await paging_data(db, note_select, GetNoteListDetails)
    return response_base.success(data=page_data)


@router.post(
    '/{pk}/notebooks',
    summary='创建笔记'
)
async def create_note(
    pk: Annotated[int, Path(...)],
    type: str = Body(..., embed=True, description="文件类型，例如 'pdf', 'word', 'url'"),
    content: str = Body('', embed=True, description="笔记内容"),
) -> ResponseModel:
    """
    上传文件并创建笔记。

    :param file: 上传的文件
    :param file_type: 文件类型
    :param active: 笔记是否活跃，默认为 True
    :return: 成功或失败的响应
    """

    obj = CreateNoteParam(
        title="",
        uuid=str(uuid.uuid4()),
        content=content,
        type=type,
        active=True
    )

    note = await note_service.create(obj=obj)
    await note_service.update_note_notebooks(pk=note.id, notebook_ids=[pk])
    data = GetNoteListDetails(**select_as_dict(note))
    return response_base.success(data=data)


@router.put(
    '/{pk}',
    summary='更新笔记',
    # dependencies=[DependsJwtAuth],
)
async def update_note(pk: Annotated[int, Path(...)], obj: UpdateNoteParam) -> ResponseModel:
    count = await note_service.update(pk=pk, obj=obj)
    if count > 0:
        return response_base.success()
    return response_base.fail()


@router.put(
    '/{pk}/notebooks',
    summary='更新笔记关联的笔记本',
    dependencies=[DependsJwtAuth],
)
async def update_note_notebooks(
    pk: Annotated[int, Path(...)], notebook_ids: Annotated[list[int], Query(...)]) -> ResponseModel:
    count = await note_service.update_note_notebooks(pk=pk, notebook_ids=notebook_ids)
    if count > 0:
        return response_base.success()
    return response_base.fail()


@router.delete(
    '',
    summary='（批量）删除笔记',
    dependencies=[DependsJwtAuth],
)
async def delete_notes(pk: Annotated[list[int], Query(...)]) -> ResponseModel:
    count = await note_service.delete(pk=pk)
    if count > 0:
        return response_base.success(data=pk)
    return response_base.fail()
