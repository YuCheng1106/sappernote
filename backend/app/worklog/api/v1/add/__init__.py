from fastapi import APIRouter

from backend.app.worklog.api.v1.add.addlogs import router as addlogs_router

router = APIRouter()

router.include_router(addlogs_router, tags=['添加日志'])

