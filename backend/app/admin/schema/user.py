#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from datetime import datetime

from pydantic import ConfigDict, EmailStr, Field, HttpUrl, model_validator
from typing_extensions import Self

from backend.app.admin.schema.dept import GetDeptListDetails
from backend.app.admin.schema.role import GetRoleListDetails
from backend.common.enums import StatusType
from backend.common.schema import CustomPhoneNumber, SchemaBase


class AuthSchemaBase(SchemaBase):
    username: str
    password: str | None


class AuthLoginParam(AuthSchemaBase):
    captcha: str

class RegisterUserParam(AuthSchemaBase):
    nickname: str | None = None
    email: EmailStr = Field(..., examples=['user@example.com'])


class AuthRegisterParam(RegisterUserParam):
    captcha: str


class AddUserParam(AuthSchemaBase):
    depts: list[int]
    roles: list[int]
    nickname: str | None = None
    email: EmailStr = Field(..., examples=['user@example.com'])

class UserInfoSchemaBase(SchemaBase):
    # dept_id: int | None = None
    username: str
    nickname: str
    email: EmailStr = Field(..., examples=['user@example.com'])
    phone: CustomPhoneNumber | None = None

class UpdateUserParam(UserInfoSchemaBase):
    pass

class UpdateUserRoleParam(SchemaBase):
    roles: list[int]

class UpdateUserDeptParam(SchemaBase):
    depts: list[int]

class AvatarParam(SchemaBase):
    url: HttpUrl = Field(..., description='头像 http 地址')


class GetUserInfoNoRelationDetail(UserInfoSchemaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    uuid: str
    avatar: str | None = None
    status: StatusType = Field(default=StatusType.enable)
    is_superuser: bool
    is_staff: bool
    is_multi_login: bool
    join_time: datetime = None
    last_login_time: datetime | None = None


class GetUserInfoListDetails(GetUserInfoNoRelationDetail):
    model_config = ConfigDict(from_attributes=True)

    depts: list[GetDeptListDetails]
    roles: list[GetRoleListDetails]



class GetCurrentUserInfoDetail(GetUserInfoListDetails):
    model_config = ConfigDict(from_attributes=True)

    depts: list[GetDeptListDetails] | list[str] | None = None
    roles: list[GetRoleListDetails] | list[str] | None = None

    @model_validator(mode='after')
    def handel(self) -> Self:
        """处理部门和角色"""
        depts = self.depts

        # if depts:
        #     self.depts = [dept.name for dept in depts]  # type: ignore
        roles = self.roles

        if roles:
            self.roles = [role.name for role in roles]  # type: ignore
        return self


class CurrentUserIns(GetUserInfoListDetails):
    model_config = ConfigDict(from_attributes=True)


class ResetPasswordParam(SchemaBase):
    old_password: str
    new_password: str
    confirm_password: str
