from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from backend.common.schema import SchemaBase

# Embedding schema
class EmbeddingBase(SchemaBase):
    uuid: str = Field(..., description="Embedding 的唯一标识符")
    content: str = Field(..., description="Embedding 的内容")
    embedding: str = Field(..., description="Embedding 的向量表示")


class CreateEmbeddingParam(EmbeddingBase):
    notesource_id: int = Field(..., description="关联 NoteSource 的 ID")


class UpdateEmbeddingParam(SchemaBase):
    content: Optional[str] = Field(None, description="更新的内容")
    embedding: Optional[str] = Field(None, description="更新的向量表示")


class GetEmbeddingDetails(EmbeddingBase):
    model_config = ConfigDict(from_attributes=True)
    id: int = Field(..., description="数据库中的唯一 ID")
    similarity: Optional[float] = Field(None, description="相似度")
    created_time: Optional[datetime] = Field(None, description="创建时间")
    updated_time: Optional[datetime] = Field(None, description="更新时间")

