#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from datetime import datetime
from pydantic import Field, BaseModel, ConfigDict, model_validator
from typing import List, Optional
from backend.app.notebook.schema.notesource import GetNoteSourceListDetails
from backend.common.schema import SchemaBase
from backend.app.notebook.schema.note import GetNoteListDetails


class NotebookSchemaBase(SchemaBase):
    uuid: str = Field(..., description="Notebook的唯一标识")
    user_uuid: str = Field(..., description="用户的UUID")
    title: Optional[str] = Field(None, description="Notebook的标题")
    content: Optional[str] = Field(None, description="Notebook的内容")
    active: Optional[bool] = Field(True, description="Notebook是否活跃")


class CreateNotebookParam(NotebookSchemaBase):
    """
    创建Notebook的参数
    """
    pass


class UpdateNotebookParam(SchemaBase):
    title: Optional[str] = None
    content: Optional[str] = None
    active: Optional[bool] = None


class GetNotebookListDetails(BaseModel):
    # 定义 GetNotebookListDetails 字段
    model_config = ConfigDict(from_attributes=True)
    id: int
    uuid: str
    user_uuid: str
    title: str
    content: Optional[str] = Field(None, description="Notebook的内容")
    created_time: datetime
    updated_time: Optional[datetime] = Field(None, description="Notebook的更新时间")
    active: bool
    source: List[GetNoteSourceListDetails]
    notes: List[GetNoteListDetails]
