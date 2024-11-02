#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import uuid
from typing import Annotated
from tempfile import NamedTemporaryFile, TemporaryDirectory
import os
from fastapi import APIRouter, Depends, Path, Query, Request, Body
from fastapi import APIRouter, Depends, UploadFile, File
from pydantic import Field

from backend.app.notebook.schema.notesource import CreateNoteSourceParam, GetNoteSourceListDetails, UpdateNoteSourceParam
from backend.app.notebook.service.notesource_service import note_source_service
from backend.common.pagination import DependsPagination, paging_data
from backend.common.response.response_schema import ResponseModel, response_base
from backend.common.security.jwt import DependsJwtAuth
from backend.database.db_mysql import CurrentSession
from backend.utils.serializers import select_as_dict, select_list_serialize
from sapperrag import DocumentReader

router = APIRouter()


@router.get('/all', summary='获取所有来源')
async def get_all_sources() -> ResponseModel:
    sources = await note_source_service.get_all()
    data = [GetNoteSourceListDetails.from_orm(source) for source in sources]
    return response_base.success(data=data)


@router.get('/{pk}', summary='获取来源详情')
async def get_source(pk: Annotated[int, Path(...)]) -> ResponseModel:
    source = await note_source_service.get(pk=pk)
    data = GetNoteSourceListDetails(**select_as_dict(source))
    return response_base.success(data=data)


@router.get('/uuid/{pk}', summary='获取来源详情')
async def get_source_by_uuid(uuid: Annotated[str, Path(...)]) -> ResponseModel:
    source = await note_source_service.get_by_uuid(uuid=uuid)
    data = GetNoteSourceListDetails(**select_as_dict(source))
    return response_base.success(data=data)


@router.get(
    '',
    summary='（模糊条件）分页获取所有来源',
    dependencies=[
        DependsJwtAuth,
        DependsPagination,
    ],
)
async def get_pagination_sources(
    db: CurrentSession,
    title: Annotated[str | None, Query()] = None,
    active: Annotated[bool | None, Query()] = None,
) -> ResponseModel:
    source_select = await note_source_service.get_select(title=title, active=active)
    page_data = await paging_data(db, source_select, GetNoteSourceListDetails)
    return response_base.success(data=page_data)


@router.post(
    '/{pk}/notebooks',
    summary='创建来源'
)
async def create_source(
        pk: Annotated[int, Path(...)],
        file: UploadFile = File(...),
        file_type: str = Body(..., embed=True, description="文件类型，例如 'pdf', 'word', 'url'"),
        active: bool = Body(True, embed=True, description="来源是否活跃，默认为 True")
) -> ResponseModel:
    """
    上传文件并创建来源。
    """
    # Step 1: Create a temporary directory
    with TemporaryDirectory() as temp_dir:
        temp_file_path = os.path.join(temp_dir, file.filename)

        # Save the uploaded file to the temporary directory
        content = await file.read()
        with open(temp_file_path, 'wb') as tmp_file:
            tmp_file.write(content)

        # Step 2: Use local_file_reader to read the file content from the directory
        local_file_reader = DocumentReader()

        read_result = local_file_reader.read(temp_dir)

        # Prepare data for creating a new source
        obj = CreateNoteSourceParam(
            uuid=str(uuid.uuid4()),
            title=file.filename,
            content=read_result[0].raw_content,  # Assuming read_result is the file content you need
            type=file_type,
            url=None,
            active=active
        )

    # Step 3: Create note source
    note_source = await note_source_service.create(obj=obj)
    await note_source_service.update_source_notebooks(pk=note_source.id, notebook_ids=[pk])
    data = GetNoteSourceListDetails(**select_as_dict(note_source))
    return response_base.success(data=data)


@router.put(
    '/{pk}',
    summary='更新来源',
    dependencies=[
        DependsJwtAuth,
    ],
)
async def update_source(pk: Annotated[int, Path(...)], obj: UpdateNoteSourceParam) -> ResponseModel:
    count = await note_source_service.update(pk=pk, obj=obj)
    if count > 0:
        return response_base.success()
    return response_base.fail()


@router.put(
    '/{pk}/notebooks',
    summary='更新来源关联的笔记本',
    dependencies=[
        DependsJwtAuth,
    ],
)
async def update_source_notebooks(
    pk: Annotated[int, Path(...)], notebook_ids: Annotated[list[int], Query(...)]) -> ResponseModel:
    count = await note_source_service.update_source_notebooks(pk=pk, notebook_ids=notebook_ids)
    if count > 0:
        return response_base.success()
    return response_base.fail()


@router.delete(
    '',
    summary='（批量）删除来源',
    dependencies=[
        DependsJwtAuth,
    ],
)
async def delete_sources(pk: Annotated[list[int], Query(...)]) -> ResponseModel:
    count = await note_source_service.delete(pk=pk)
    if count > 0:
        return response_base.success()
    return response_base.fail()
