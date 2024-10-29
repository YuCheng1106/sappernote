# UMS 项目后端修改最佳实践

## 概述

本指南旨在帮助开发者基于现有的 **用户管理系统（UMS）** 项目，添加新的后端功能，并遵循现有的架构和开发规范。本文档将重点介绍如何在后端模块中扩展功能，包括 API 接口、业务逻辑、数据库模型、服务层、以及测试用例的编写。

## 项目目录结构

在开始扩展功能之前，理解项目的目录结构非常重要。UMS 项目后端主要分为以下几个模块：

```
├─📁 backend--------------- # 后端主目录
│ ├─📁 app----------------- # 应用程序
│ │ ├─📁 api------------- # 接口层，处理 HTTP 请求
│ │ ├─📁 crud------------ # 增删改查逻辑
│ │ ├─📁 model----------- # 数据库模型（SQLAlchemy）
│ │ ├─📁 schema---------- # 数据传输对象 (DTO)
│ │ ├─📁 service--------- # 服务层，处理业务逻辑
│ │ └─📁 tests----------- # 测试用例
│ ├─📁 database------------ # 数据库连接管理
│ └─📁 utils--------------- # 通用工具函数
```

## 后端功能扩展步骤

### 1. 设计新功能

在开始编码之前，建议先规划清楚要添加的功能模块。需要确定以下几点：
- 新的功能涉及哪些数据库表？
- API 接口需要什么样的输入输出？
- 业务逻辑的主要流程是什么？

### 2. 添加数据库模型

首先，在 `model` 目录下创建新的数据库模型。

- **步骤**：
  1. 打开 `backend/app/model` 文件夹，根据需求添加新的 SQLAlchemy 模型文件。例如，创建 `new_model.py` 文件。
  2. 根据现有的 SQLAlchemy 模型编写你的模型类，继承 `Base`，并定义相关字段、关系等。
  3. 不要忘记更新 Alembic 迁移脚本，执行以下命令生成新的迁移：
     ```bash
     alembic revision --autogenerate -m "add new_model table"
     alembic upgrade head
     ```

### 3. 编写数据传输对象 (DTO)

在 `schema` 目录下定义与模型对应的数据传输对象 (DTO)。这主要用于数据验证和类型检查。

- **步骤**：
  1. 打开 `backend/app/schema` 文件夹，创建与模型对应的 `new_schema.py` 文件。
  2. 使用 `Pydantic` 来定义请求和响应的结构。

### 4. 实现 CRUD 操作

在 `crud` 目录下实现增删改查逻辑。

- **步骤**：
  1. 创建 `new_crud.py` 文件，定义新的 CRUD 操作方法，例如 `create`, `read`, `update`, `delete`。
  2. 使用 SQLAlchemy 的 `Session` 来执行数据库操作。

### 5. 添加业务逻辑 (Service 层)

在 `service` 目录下处理具体的业务逻辑，将 CRUD 操作和 API 接口关联起来。

- **步骤**：
  1. 创建 `new_service.py` 文件，编写具体的业务逻辑。
  2. 通过调用 `crud` 中的相关方法，并处理业务逻辑中的异常、事务等操作。

### 6. 编写 API 接口

在 `api` 目录下添加新的 API 路由和视图函数，接收客户端请求，调用服务层，并返回相应的结果。

- **步骤**：
  1. 在 `backend/app/api` 中，创建 `new_api.py`，并在其中定义新的路由和视图函数。
  2. 使用 `FastAPI` 的 `@router.get`, `@router.post` 等装饰器定义 API 路径。
  3. 处理请求中的数据，调用 `service` 层中的逻辑，并返回结果。

## 代码示例

### 新增模型示例

```python
from sqlalchemy import Column, Integer, String
from backend.database import Base

class NewModel(Base):
    __tablename__ = "new_model"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
```

### 新增 CRUD 操作示例

```python
from sqlalchemy.orm import Session
from backend.app.model.new_model import NewModel

def create_new_model(db: Session, name: str):
    new_record = NewModel(name=name)
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record
```

### 新增 API 路由示例

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.service.new_service import create_new_model
from backend.app.database import get_db

router = APIRouter()

@router.post("/new-model/")
def create_new(name: str, db: Session = Depends(get_db)):
    return create_new_model(db, name)
```

## 注意事项

1. **遵循现有代码风格**：项目可能有特定的代码风格（如变量命名、注释规范等），确保你遵循这些风格。
2. **测试覆盖率**：每添加一个新功能，应该相应添加测试用例，确保代码质量。
3. **异常处理**：在处理业务逻辑时，确保捕获并处理所有可能的异常，并返回合适的 HTTP 状态码。

## 结论

通过遵循上述步骤，你可以在现有的 UMS 项目基础上，轻松扩展自己的后端功能。在保持代码整洁、模块化和测试覆盖率的前提下，项目的可维护性和扩展性都将得到显著提升。
