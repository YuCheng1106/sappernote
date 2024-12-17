from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.worklog.model import WorkLog
from backend.common import id_generation
from backend.database.db_mysql import async_db_session
from fastapi import Request
import pytz
from datetime import datetime

#中国时间
def get_china_time() -> datetime:
    """获取当前的北京时间"""
    utc_time = datetime.utcnow()
    china_tz = pytz.timezone('Asia/Shanghai')
    return utc_time.replace(tzinfo=pytz.utc).astimezone(china_tz)

# 创建工作日志
async def create_worklog( worklog_data: dict) -> WorkLog:
    async with async_db_session() as db:
        uuid = f'workLog_{id_generation.generate_id()}'
        # while await get_worklog_by_uuid(request.user.id):
        #     uuid = f'workLog_{id_generation.generate_id()}'

        db_worklog = WorkLog(**worklog_data, uuid=uuid, create_datetime=get_china_time(), active=True)
        db.add(db_worklog)
        await db.commit()
        await db.refresh(db_worklog)
        return db_worklog


# 按 ID 编辑工作日志
async def edit_worklog_by_id(worklog_id: int, update_data: dict) -> WorkLog:
    async with async_db_session() as db:
        query = select(WorkLog).where(WorkLog.id == worklog_id)
        result = await db.execute(query)
        db_worklog = result.scalar_one_or_none()
        update_data = {k: v for k, v in update_data.items() if v is not None}  # 过滤掉 None 值
        if db_worklog is not None:
            for key, value in update_data.items():
                setattr(db_worklog, key, value)
            db_worklog.update_datetime = get_china_time()
            await db.commit()
            await db.refresh(db_worklog)
            return db_worklog
        return None


# 按 UUID 编辑工作日志
async def edit_worklog_by_uuid(worklog_uuid: str, update_data: dict) -> WorkLog:
    async with async_db_session() as db:
        query = select(WorkLog).where(WorkLog.uuid == worklog_uuid)
        result = await db.execute(query)
        db_worklog = result.scalar_one_or_none()
        update_data = {k: v for k, v in update_data.items() if v is not None}  # 过滤掉 None 值
        if db_worklog is not None:
            for key, value in update_data.items():
                setattr(db_worklog, key, value)
            db_worklog.update_datetime = get_china_time()
            await db.commit()
            await db.refresh(db_worklog)
            return db_worklog
        return None


# 按 ID 获取工作日志
async def get_worklog_by_id(worklog_id: int) -> WorkLog:
    async with async_db_session() as db:
        result = await db.execute(select(WorkLog).where(WorkLog.id == worklog_id))
        return result.scalar_one_or_none()


# 按 UUID 获取工作日志
async def get_worklog_by_uuid(worklog_uuid: str) -> WorkLog:
    async with async_db_session() as db:
        result = await db.execute(select(WorkLog).where(WorkLog.uuid == worklog_uuid))
        return result.scalar_one_or_none()


async def get_all_user_worklogs(user_uuid: str) -> list[WorkLog]:
    async with async_db_session() as db:
        result = await db.execute(
            select(WorkLog).where(WorkLog.user_uuid == user_uuid)  # 确保这里是用户标识符字段
        )
        return result.scalars().all()


# 获取所有工作日志
async def get_all_worklogs() -> list[WorkLog]:
    async with async_db_session() as db:
        result = await db.execute(select(WorkLog))
        return result.scalars().all()
