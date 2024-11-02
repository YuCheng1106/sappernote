#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from fastapi import APIRouter

from backend.app.notebook.api.v1.notebook import router as notebook_router
from backend.app.notebook.api.v1.notesource import router as notesource_router
from backend.app.notebook.api.v1.note import router as note_router
from backend.app.notebook.api.v1.embedding import router as embedding_router

v1 = APIRouter()

v1.include_router(notebook_router, prefix='/notebook', tags=['笔记本'])
v1.include_router(notesource_router, prefix='/notesource', tags=['来源'])
v1.include_router(note_router, prefix='/note', tags=['来源'])
v1.include_router(embedding_router, prefix='/embedding', tags=['向量'])
