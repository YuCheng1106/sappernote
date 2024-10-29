#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Annotated
from fastapi import APIRouter, Body, Depends, Path

from backend.common.response.response_schema import ResponseModel, response_base
from backend.common.security.jwt import DependsJwtAuth
from backend.common.security.permission import RequestPermission
from backend.common.security.rbac import DependsRBAC

router = APIRouter()


@router.get('', summary='获取所有可执行笔记模块')
async def get_all_tasks() -> ResponseModel:
    return response_base.success(data="hello")

