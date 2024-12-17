from fastapi import APIRouter, Depends, HTTPException, status, Request

from backend.common.response.response_schema import response_base, ResponseModel
from backend.common.security.jwt import DependsJwtAuth
from backend.utils.serializers import select_as_dict
from ....service import worklog_service
from ....schema.worklog_schemas import WorkLogCreate, WorkLogUpdate, WorkLogResponse
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database.db_mysql import async_db_session

router = APIRouter()

# Get WorkLog by ID
@router.get("/worklogs/by-id/{worklog_id}", response_model=WorkLogResponse)
async def get_worklog_by_id(worklog_id: int, ):
    db_worklog = await worklog_service.get_worklog_by_id(worklog_id)
    if db_worklog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WorkLog not found")
    return db_worklog

# Get WorkLog by UUID
@router.get("/worklogs/by-uuid/{worklog_uuid}", response_model=WorkLogResponse)
async def get_worklog_by_uuid(worklog_uuid: str):
    db_worklog = await worklog_service.get_worklog_by_uuid( worklog_uuid)
    if db_worklog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WorkLog not found")
    return db_worklog

# Edit WorkLog by UUID
@router.put("/worklogs/by-uuid/{worklog_uuid}", response_model=WorkLogResponse)
async def edit_worklog_by_uuid(worklog_uuid: str, update_data: WorkLogUpdate, db: AsyncSession = Depends(async_db_session)):
    worklog = await worklog_service.edit_worklog_by_uuid(db, worklog_uuid, update_data.model_dump())
    if worklog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WorkLog not found")
    return worklog


@router.get("/worklogs/user", dependencies=[DependsJwtAuth])
async def get_worklog_by_user(request: Request) -> ResponseModel:
    db_worklog = await worklog_service.get_all_user_worklogs(request.user.uuid)
    if db_worklog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WorkLog not found")
    data = [WorkLogResponse(**select_as_dict(work_log)) for work_log in db_worklog]
    return response_base.success(data=data)


# Get All WorkLogs
@router.get("/worklogs/all", dependencies=[DependsJwtAuth])
async def get_all_worklogs():
    db_worklog = await worklog_service.get_all_worklogs()
    if db_worklog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="WorkLog not found")
    data = [WorkLogResponse(**select_as_dict(work_log)) for work_log in db_worklog]
    return response_base.success(data=data)
