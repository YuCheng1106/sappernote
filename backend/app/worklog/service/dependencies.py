from fastapi import Header, HTTPException, status, Depends
from ..service.user_service import validate_token
from backend.database.db_mysql import async_db_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(async_db_session)) -> str:
    # 尝试使用提供的 token 验证并获取用户 UUID
    uuid = await validate_token(db, token)

    # 打印调试信息

    # 如果未能获取到 UUID，抛出认证异常
    if not uuid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please log in again."
        )

    # 返回用户的 UUID
    return uuid
