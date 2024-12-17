import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Tag, Divider, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AddDeptModal from "../../../components/modals/addDeptModal";
import { useDispatchDept } from '../../../hooks';
import {SysDeptRes} from "../../../api/dept";
import type { ColumnsType } from 'antd/es/table';
import EditDeptModal from "../../../components/modals/editDeptModal";  // 假设你已经有 useDispatchDept

const { Option } = Select;

const AdminDeptPage = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
    const [loading, setLoading] = useState(false);
    const [depts, setDepts] = useState([]); // 存储部门数据
    const [searchParams, setSearchParams] = useState({
        name: '',
        leader: '',
        phone: '',
        status: undefined,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {fetchAllDepartments, addDepartment, removeDepartment, updateDepartment} = useDispatchDept();
    const [editDeptModalVisible, setEditDeptModalVisible] = useState(false); // 编辑模态框的可见性
    const [currentDept, setCurrentDept] = useState<SysDeptRes | null>(null);


    useEffect(() => {
        loadDepts(); // 初次加载部门数据
    }, [pagination.current, pagination.pageSize]);

    const loadDepts = async () => {
        setLoading(true);
        try {
            const result = await fetchAllDepartments();
            if (result.payload) {
                setDepts(result.payload as []); // 设置部门数据
                // setPagination((prev) => ({ ...prev, total: result.payload.total }));
            }
        } catch (error) {
            console.error('Failed to load departments:', error);
        } finally {
            setLoading(false);
        }
    };

    // 处理搜索
    const onSearch = () => {
        setPagination({ ...pagination, current: 1 }); // 搜索时回到第一页
        loadDepts(); // 根据过滤条件重新加载数据
    };

    // 处理重置
    const handleReset = () => {
        setSearchParams({
            name: '',
            leader: '',
            phone: '',
            status: undefined,
        });
        setPagination({ ...pagination, current: 1 });
        loadDepts(); // 重置搜索条件并重新加载数据
    };

    // 打开模态框
    const showModal = () => {
        setIsModalVisible(true);
    };

    // 关闭模态框
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteDept = async (pk: number) => {
        try {
            await removeDepartment(pk);
            loadDepts();
        } catch (error) {
            console.error(error);
        }
    };

    // 提交新部门数据
    const handleAddDept = async (values: never) => {
        try {
            await addDepartment(values);
            message.success('部门创建成功');
            setIsModalVisible(false); // 关闭模态框
            fetchAllDepartments();
        } catch {
            message.error('部门创建失败');
        }
    };

    const handleEditCancel = () => {
        setEditDeptModalVisible(false);
    };

    const showDeptEditModal = (record: SysDeptRes) => {
        setCurrentDept(record); // 设置当前编辑的角色
        setEditDeptModalVisible(true); // 打开编辑模态框
    };

    const handleEditDept = async (values: never) => {
        if (currentDept?.id) {
            try {
                await updateDepartment(currentDept.id, values);
                setEditDeptModalVisible(false);
                loadDepts();
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("Department is not selected");
        }
    };


    const columns: ColumnsType<SysDeptRes> = [
        {
            title: '部门名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '负责人',
            dataIndex: 'leader',
            key: 'leader',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => (
                <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '正常' : '禁用'}</Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (record: SysDeptRes) => (
                <Space size="middle">
                    <a href="#" onClick={() => showDeptEditModal(record)}>编辑</a>
                    <a href="#" onClick={() => handleDeleteDept(record.id)}>删除</a>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>部门管理</h2>

            {/* 搜索栏 */}
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="请输入部门名称"
                    style={{ width: 200 }}
                    value={searchParams.name}
                    onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                />
                <Input
                    placeholder="请输入负责人"
                    style={{ width: 200 }}
                    value={searchParams.leader}
                    onChange={(e) => setSearchParams({ ...searchParams, leader: e.target.value })}
                />
                <Select
                    placeholder="状态"
                    style={{ width: 120 }}
                    value={searchParams.status}
                    onChange={(value) => setSearchParams({ ...searchParams, status: value })}
                >
                    <Option value={undefined}>全部</Option>
                    <Option value={1}>正常</Option>
                    <Option value={0}>禁用</Option>
                </Select>
                <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
                    搜索
                </Button>
                <Button onClick={handleReset}>重置</Button>
            </Space>
            <Divider />

            {/* 添加部门按钮 */}
            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={showModal}>
                新增
            </Button>

            {/* 部门表格 */}
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                columns={columns}
                dataSource={depts}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                // onChange={(pagination) => setPagination(pagination)}
            />

            {/* 新增部门的模态框 */}
            <AddDeptModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onCreate={handleAddDept}
            />

            <EditDeptModal
                visible={editDeptModalVisible}
                onCancel={handleEditCancel}
                onEdit={handleEditDept}
                dept={currentDept}
            />
        </div>
    );
};

export default AdminDeptPage;
