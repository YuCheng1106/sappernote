from fastapi import APIRouter


from backend.app.worklog.api.v1.add import router as add_router
from backend.app.worklog.api.v1.show import router as show_router
from backend.app.worklog.api.v1.search import router as search_router

v1 = APIRouter()

v1.include_router(add_router)
v1.include_router(search_router)
v1.include_router(show_router)

