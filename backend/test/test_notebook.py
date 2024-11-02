# test_main.py
from fastapi.testclient import TestClient
from backend.main import app
import requests
# 创建测试客户端
client = TestClient(app)


# 测试获取所有笔记本
def test_get_all_notebooks():
    response = requests.get('http://127.0.0.1:8000/api/v1/notebook/all')
    assert response.status_code == 200
    data = response.json()
    assert data['code'] == 200
    print("All Notebooks:", data)


# 测试获取用户所有笔记本
def test_get_user_all_notebooks():
    user_uuid = "sample_user_uuid"  # 替换为实际用户UUID
    response = client.get(f'/api/v1/notebook/user/{user_uuid}/all')
    assert response.status_code == 200
    data = response.json()
    assert data['code'] == 200
    print("User's Notebooks:", data)


# 测试获取笔记本详情
def test_get_notebook():
    notebook_id = 1  # 替换为实际的笔记本ID
    response = client.get(f'/api/v1/notebook/{notebook_id}')
    assert response.status_code == 200
    data = response.json()
    assert data['code'] == 200
    print("Notebook Details:", data)


# 测试分页获取所有笔记本
def test_get_pagination_notebooks():
    params = {'tittle': 'sample', 'active': True}
    response = client.get('/api/v1/notebook', params=params)
    assert response.status_code == 200
    data = response.json()
    assert data['code'] == 200
    print("Paginated Notebooks:", data)


# 测试创建笔记本
def test_create_notebook():
    notebook_data = {
        'tittle': 'Sample Notebook',
    }
    response = client.post('/api/v1/notebook', json=notebook_data)
    assert response.status_code == 200
    data = response.json()
    assert data['code'] == 200
    print("Created Notebook:", data)


# 测试更新笔记本
def test_update_notebook():
    notebook_id = 1  # 替换为实际的笔记本ID
    update_data = {
        'uuid': 'updated_uuid',
        'user_uuid': 'updated_user_uuid',
        'tittle': 'Updated Notebook',
        'content': 'Updated content',
        'active': False
    }
    response = client.put(f'/api/v1/notebook/{notebook_id}', json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data['code'] == 200
    print("Updated Notebook:", data)


# 测试更新笔记本来源
def test_update_notebook_sources():
    notebook_id = 2  # 替换为实际的笔记本ID
    source_ids = [1, 11]  # 替换为实际的来源ID列表
    # 使用 `params` 传递 `source_ids` 查询参数
    response = client.put(f'/api/v1/notebook/{notebook_id}/sources', params={"source_ids": source_ids})
    print(response)
    assert response.status_code == 200
    data = response.json()
    assert data['code'] == 200
    print("Updated Notebook Sources:", data)


# 测试删除笔记本
def test_delete_notebooks():
    notebook_ids = [1]  # 替换为实际的笔记本ID列表
    # 将 pk 作为查询参数传递
    response = client.delete('/api/v1/notebook', params=[("pk", id) for id in notebook_ids])
    assert response.status_code == 200
    data = response.json()
    assert data['code'] == 200
    print("Deleted Notebooks:", data)


# 执行所有测试
if __name__ == "__main__":
    test_get_all_notebooks()
    # test_get_user_all_notebooks()
    # test_get_notebook()
    # test_get_pagination_notebooks()
    # test_create_notebook()
    # test_update_notebook()
    # test_update_notebook_sources()
    # test_delete_notebooks()
