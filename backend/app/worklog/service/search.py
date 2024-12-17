import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from backend.app.worklog.service.embedding import get_sentence_embedding
from backend.app.worklog.service.utils import get_shared_state
from dataclasses import dataclass, field
from typing import List, Optional, Any


@dataclass
class Embeds:
    data: Any
    embedding: np.ndarray
    similarity: Optional[float] = None


async def query_embedding(query: str, embeds: List[Embeds]):
    """执行数据库日志的相似性搜索。"""
    model_state = get_shared_state()  # 确保在调用时获取模型状态

    # 获取查询文本的嵌入
    query_emb = await get_sentence_embedding(query, model_state['embedding_model'])
    query_emb = query_emb.reshape(1, -1)  # 确保形状为 (1, n)

    # 计算相似度并更新每个 Embeds 对象的 similarity 属性
    for emb in embeds:
        stored_emb = np.frombuffer(emb.embedding, dtype=np.float32).reshape(1, -1)  # 转换为 (1, n)
        emb.similarity = cosine_similarity(query_emb, stored_emb)[0][0]  # 计算余弦相似度

    # 按相似度降序排序
    sorted_embeddings = sorted(embeds, key=lambda x: x.similarity, reverse=True)

    return sorted_embeddings
