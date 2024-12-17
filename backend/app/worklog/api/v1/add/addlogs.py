import asyncio
import httpx
from fastapi import APIRouter,Depends, status, Request
from fastapi.responses import JSONResponse

from backend.common.response.response_schema import response_base, ResponseModel
from backend.common.security.jwt import DependsJwtAuth
from backend.common.security.permission import RequestPermission
from backend.common.security.rbac import DependsRBAC
from ....service import worklog_service
from ....schema.worklog_schemas import WorkLogSubmit, WorkLogResponse, WorkLogCreate
from backend.app.worklog.service.formatter import process_and_store_log
from ....service.utils import get_shared_state
from ....service.embedding import get_sentence_embedding

router = APIRouter()

# 清理段落
def clean_part(part):
    """清理段落，删除姓名和时间，只保留有用的标签，并删除 '解决问题：' 之前的内容"""
    # 找到第一次出现 '解决问题：' 的位置
    start_index = part.find("解决问题：")

    # 如果找到了 '解决问题：'
    if start_index != -1:
        # 从 '解决问题：' 开始保留内容
        part = part[start_index:]

        # 按行分割，继续删除无用信息
        lines = part.splitlines()
        cleaned_lines = []

        for line in lines:
            if line.startswith("解决问题：") or line.startswith("解决方法：") or line.startswith("解决效果："):
                cleaned_lines.append(line)

        # 只有当 cleaned_lines 中有有效标签时，才返回内容
        return '\n'.join(cleaned_lines) if cleaned_lines else None

    # 如果没有找到 '解决问题：'，返回 None
    return None


# 按双换行符分割文本
def split_text_by_double_newlines(text):
    parts = []
    current_part = []

    for line in text.splitlines():
        if line.strip() == '' and current_part:
            # 当遇到双换行符时，清理当前部分并添加到 parts
            cleaned_part = clean_part('\n'.join(current_part))
            if cleaned_part:
                parts.append(cleaned_part)
            current_part = []
        else:
            current_part.append(line)

    # 处理最后一个部分
    if current_part:
        cleaned_part = clean_part('\n'.join(current_part))
        if cleaned_part:
            parts.append(cleaned_part)

    return parts



# 解析工作日志部分
async def parse_worklog_part(part: str, user_uuid: str,group_uuid:int) -> dict:
    worklog_data = {
        "user_uuid": user_uuid,
        "group_uuid": group_uuid,
        "content": part,
        "embedding": None
    }
    model = get_shared_state()
    embed = await get_sentence_embedding(part, model['embedding_model'])
    worklog_data["embedding"] = embed.tobytes()
    return worklog_data


@router.put('/worklogs/submit', dependencies=[
    Depends(RequestPermission('sys:worklog:add')),
    DependsRBAC,])
async def submit_log(worklog: WorkLogSubmit)-> ResponseModel:
    # print(worklog)
    processed_result = await process_and_store_log(worklog.text)
    parts = split_text_by_double_newlines(processed_result)
    # print(parts)

    for i, part in enumerate(parts, start=1):
        retries = 0
        max_retries = 2
        worklog_data = await parse_worklog_part(part, worklog.user_uuid,worklog.group_uuid)

        while retries <= max_retries:
            try:
                await worklog_service.create_worklog(worklog_data)
                break
            except Exception as e:
                retries += 1
                if retries > max_retries:
                    print(f"插入部分{i}数据失败: {e}")
                else:
                    await asyncio.sleep(1)
    return response_base.success(data="success")



# 创建工作日志
@router.post("/worklogs/", response_model=WorkLogResponse, status_code=status.HTTP_201_CREATED, dependencies=[DependsJwtAuth])
async def create_worklog(request: Request, worklog: WorkLogCreate):
    return await worklog_service.create_worklog(request, worklog.model_dump())




async def check(text: str):
    url = 'https://api.coze.cn/open_api/v2/chat'
    headers = {
        'Authorization': 'Bearer pat_J0kTR3d58Z8bWcFpUisvOMvrOToUDg6aVIk76yoraRCKapOt8jlHa6ghBbXO5a0h',
        'Content-Type': 'application/json',
    }

    data = {
        "conversation_id": "12345",
        "bot_id": "7410333069560905743",
        "user": "29032201862555",
        "query": text,
        "stream": False
    }

    async with httpx.AsyncClient() as client:
        for _ in range(3):
            try:
                response = await client.post(url, headers=headers, json=data)
                response.raise_for_status()  # 抛出异常以处理错误响应
                response_data = response.json()
                messages = response_data.get("messages", [])
                for message in messages:
                    if message.get("role") == "assistant" and message.get("type") == "answer":
                        return message.get("content")
                return None
            except httpx.HTTPStatusError as e:
                print(f"请求失败: {e.response.status_code} - {e.response.text}")
            except Exception as e:
                print(f"其他错误: {e}")

            await asyncio.sleep(5)  # 等待后再重试

    raise ConnectionError("API请求失败: 超过最大重试次数")


@router.post('/worklogs/check_text',dependencies=[
    Depends(RequestPermission('sys:worklog:check')),
    DependsRBAC,])
async def check_text(request: Request):
    try:
        data = await request.json()
        text = data.get('text')
        checked_text = await check(text)
        return JSONResponse({'checkedText': checked_text})
    except Exception as e:
        return JSONResponse({'error': str(e)}, status_code=500)
