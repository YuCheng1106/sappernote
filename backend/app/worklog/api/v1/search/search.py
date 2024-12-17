import os
import requests
import asyncio
import json
import httpx
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request

from backend.app.admin.service.user_service import UserService
from backend.common.security.jwt import DependsJwtAuth
from backend.common.response.response_schema import response_base, ResponseModel
from ....service import worklog_service
from ....schema.worklog_schemas import WorkLogCreate, WorkLogUpdate, WorkLogResponse, WorkLogSubmit
from fastapi.templating import Jinja2Templates
from ....service.search import query_embedding
from ....service.search import Embeds
from fastapi.responses import JSONResponse


router = APIRouter()


@router.get('/worklogs/search', dependencies=[DependsJwtAuth])
async def search_query(request: Request) -> ResponseModel:
    results = await worklog_service.get_all_user_worklogs(request.user.uuid)
    if not results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No worklogs found")

    embeds = []
    for result in results:
        log_data = WorkLogResponse.from_orm(result).dict()
        user_uuid = log_data['user_uuid']
        user_data = await UserService.get_userinfo_by_uuid(user_uuid=user_uuid)
        log_data['user_name'] = user_data.nickname  # 假设返回的数据结构


        if isinstance(log_data.get('create_datetime'), datetime):
            log_data['create_datetime'] = log_data['create_datetime'].isoformat()
        if isinstance(log_data.get('update_datetime'), datetime):
            log_data['update_datetime'] = log_data['update_datetime'].isoformat()

        embeds.append(Embeds(log_data, result.embedding, 0))

    query = request.query_params.get('q')
    if not query:
        raise HTTPException(status_code=400, detail="搜索内容不能为空")
    else:
        results = await query_embedding(query, embeds)
        select_logs = [results[i].data for i in range(min(10, len(results)))]
    print(select_logs)
    return response_base.success(data=select_logs)


@router.post('/worklogs/ask')
async def api_ask(request: Request):
    """处理API请求并返回响应。"""
    data = await request.json()
    text = data.get('question')
    if not text:
        return JSONResponse({"error": "No query provided"}, status_code=400)

    top_logs = data.get('top_logs', [])
    background_text = "请以" + "、".join(
        [f"文本{i + 1}：" + log['content'] for i, log in enumerate(top_logs)]) + "为背景，回答“" + text + "”"

    url = 'https://api.coze.cn/open_api/v2/chat'
    headers = {
        'Authorization': 'Bearer pat_J0kTR3d58Z8bWcFpUisvOMvrOToUDg6aVIk76yoraRCKapOt8jlHa6ghBbXO5a0h',
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Host': 'api.coze.cn',
        'Connection': 'keep-alive'
    }

    payload = {
        "conversation_id": "123",
        "bot_id": "7398757473089716261",
        "user": "29032201862555",
        "query": background_text,
        "stream": False
    }

    for _ in range(3):
        try:
            response = await asyncio.to_thread(requests.post, url, headers=headers, data=json.dumps(payload))
            response.raise_for_status()
            response_data = response.json()
            messages = response_data.get("messages", [])
            for message in messages:
                if message.get("role") == "assistant" and message.get("type") == "answer":
                    return JSONResponse({"answer": message.get("content")})
            return JSONResponse({"error": "No valid response received"}, status_code=500)
        except requests.exceptions.RequestException as e:
            print(f"请求失败: {e}")
            await asyncio.sleep(5)

    return JSONResponse({"error": "API请求失败: 超过最大重试次数"}, status_code=500)

