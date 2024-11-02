#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from datetime import datetime
from pydantic import Field, BaseModel, ConfigDict
from typing import List, Optional

from backend.common.schema import SchemaBase


class NoteSourceSchemaBase(SchemaBase):
    uuid: str = Field(..., description="NoteSource的唯一标识")
    title: str = Field(..., description="NoteSource的标题")
    content: Optional[str] = Field(None, description="NoteSource的内容")
    type: str = Field(..., description="NoteSource的类型，例如 'pdf', 'word', 'url' 等")
    url: Optional[str] = Field(None, description="NoteSource的URL地址")
    active: Optional[bool] = Field(True, description="NoteSource是否活跃")


class CreateNoteSourceParam(NoteSourceSchemaBase):
    """
    创建NoteSource的参数
    """
    pass


class UpdateNoteSourceParam(NoteSourceSchemaBase):
    """
    更新NoteSource的参数
    """
    pass


class GetNoteSourceListDetails(BaseModel):
    # 定义 GetNoteSourceListDetails 字段
    model_config = ConfigDict(from_attributes=True)
    id: int
    uuid: str
    title: str
    content: Optional[str] = ''
    type: str
    url: Optional[str] = None
    created_time: datetime
    updated_time: Optional[datetime] = None
    active: bool
