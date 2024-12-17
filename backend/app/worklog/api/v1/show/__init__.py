from fastapi import APIRouter

from backend.app.worklog.api.v1.show.showlogs import router as showlogs_router

router = APIRouter(prefix='/show')

router.include_router(showlogs_router, tags=['查看日志'])
