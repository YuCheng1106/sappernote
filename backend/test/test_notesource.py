# test_main.py
from fastapi.testclient import TestClient
from backend.main import app

# 创建测试客户端
client = TestClient(app)


def test_notesource_create():
    # 文件路径
    file_path = "D:/workplace/notebookllm/teachers/丁明军/丁明军简历.pdf"

    # 打开文件并发送 POST 请求到指定路由
    with open(file_path, "rb") as file:
        response = client.post(
            "http://127.0.0.1:8000/api/v1/notesource",
            files={"file": ("丁明军简历.pdf", file, "application/pdf")},
            data={
                "file_type": "pdf",  # 文件类型字段
                "active": "true",  # 是否活跃字段
            },
        )

    # 断言 HTTP 状态码为 200 (成功)
    assert response.status_code == 200

    # 断言返回的 JSON 数据是否正确
    data = response.json()
    print(data)
    assert data['code'] == 200


def test_notesource_delete():
    # 文件路径
    file_path = "D:/workplace/notebookllm/teachers/丁明军/丁明军简历.pdf"

    # 打开文件并发送 POST 请求到指定路由
    with open(file_path, "rb") as file:
        response = client.post(
            "http://127.0.0.1:8000/api/v1/notesource",
            files={"file": ("丁明军简历.pdf", file, "application/pdf")},
            data={
                "file_type": "pdf",  # 文件类型字段
                "active": "true",  # 是否活跃字段
            },
        )

    # 断言 HTTP 状态码为 200 (成功)
    assert response.status_code == 200

    # 断言返回的 JSON 数据是否正确
    data = response.json()
    print(data)
    assert data['code'] == 200


test_notesource_create()
