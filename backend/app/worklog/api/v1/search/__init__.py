from fastapi import APIRouter

from backend.app.worklog.api.v1.search.search import router as addlogs_router

router = APIRouter()

router.include_router(addlogs_router, tags=['搜索日志'])

