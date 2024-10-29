# test_main.py

from fastapi.testclient import TestClient
from backend.main import app

# 创建测试客户端
client = TestClient(app)


def test_get_all_tasks():
    # 发送 GET 请求到指定路由
    response = client.get('http://127.0.0.1:8000/api/v1/notebook')

    # 断言 HTTP 状态码为 200 (成功)
    assert response.status_code == 200

    # 断言返回的 JSON 数据是否正确
    data = response.json()
    print(data)
    assert data['data'] == "hello"
    assert data['code'] == 200  # 根据你的 response_base 结构进行断言


test_get_all_tasks()
