#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from fastapi import APIRouter

from backend.app.notebook.api.v1.notebook import router as notebook_router

v1 = APIRouter()

v1.include_router(notebook_router, prefix='/notebook', tags=['笔记'])
