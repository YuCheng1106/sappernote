from datetime import datetime
from pydantic import Field, BaseModel, ConfigDict
from typing import Optional, List

from backend.common.schema import SchemaBase


class NoteSchemaBase(SchemaBase):
    uuid: str = Field(..., description="Note的唯一标识")
    title: str = Field(..., description="Note的标题")
    content: Optional[str] = Field(None, description="Note的内容")
    type: str = Field(..., description="Note的类型，例如 'remark', 'dialogue' 等")
    active: Optional[bool] = Field(True, description="Note是否活跃")


class CreateNoteParam(SchemaBase):
    uuid: str = Field(..., description="Note的唯一标识")
    title: Optional[str] = Field(..., description="Note的标题")
    content: Optional[str] = Field(None, description="Note的内容")
    type: Optional[str] = Field(..., description="Note的类型，例如 'remark', 'dialogue' 等")
    active: Optional[bool] = Field(True, description="Note是否活跃")


class UpdateNoteParam(SchemaBase):
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[str] = None
    active: Optional[bool] = None


class GetNoteListDetails(BaseModel):
    # 定义 GetNoteListDetails 字段
    model_config = ConfigDict(from_attributes=True)
    id: int
    uuid: str
    title: str
    content: Optional[str]
    type: str
    created_time: datetime
    updated_time: Optional[datetime] = None
    active: bool
