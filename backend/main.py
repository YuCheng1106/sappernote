#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path

import uvicorn

from backend.core.registrar import register_app

# from backend.app.worklog.service.utils import initialize_model
app = register_app()

# @app.on_event("startup")
# async def startup():
#     """在应用程序启动时加载模型"""
#     await initialize_model()

if __name__ == '__main__':
    # 如果你喜欢在 IDE 中进行 DEBUG，main 启动方法会很有帮助
    # 如果你喜欢通过 print 方式进行调试，建议使用 fastapi cli 方式启动服务
    try:
        config = uvicorn.Config(app=f'{Path(__file__).stem}:app', reload=True)
        server = uvicorn.Server(config)
        server.run()
    except Exception as e:
        raise e
