import React, {useEffect, useState} from 'react';
import {Alert, Button, Divider, Input, Pagination, Select, Space, Table, Tag} from 'antd';
import {DeleteOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {useDispatchMenu, useDispatchRole} from '../../../hooks'; // 使用自定义 hook
import CreateRoleModal from "../../../components/modals/createRoleModal";
import EditRoleModal from "../../../components/modals/editRoleModal";
import PermissionDrawer from "../../../components/modals/permissionDrawer"; // 引入权限设置抽屉
import type {ColumnsType} from 'antd/es/table';
import {SysRoleListRes, SysRoleParams, SysRoleRes} from "../../../api/role.ts";
import {SysMenuTreeParams} from "../../../api/menu.ts"; // 从 antd 导入 ColumnsType

const { Option } = Select;

const AdminRolePage = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
    const [roleName, setRoleName] = useState('');
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false); // 编辑模态框的可见性
    const [drawerVisible, setDrawerVisible] = useState(false); // 控制权限设置的 drawer
    const [currentRole, setCurrentRole] = useState<SysRoleRes | null>(null);
    const [permissions, setPermissions] = useState([]); // 存储所有权限


    const { getRoleList, createNewRole, updateRoleInfo, removeRole, updateRoleMenus} = useDispatchRole(); // 从 hook 获取函数
    const { getMenuTree } = useDispatchMenu();  // 从menuHook获取权限菜单
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<SysRoleRes[]>([]);


    // 获取角色列表及所有权限数据
    const fetchRoles = async (page = 1, pageSize = 20) => {
        setLoading(true);
        const params:SysRoleParams  = {
            name: roleName,
            status: undefined,
            page,
            size: pageSize,
        };
        const menuParams:SysMenuTreeParams  = {
            title: '',
            status: undefined
        };
        try {
            const [roleResponse, menuResponse] = await Promise.all([
                getRoleList(params),     // 获取角色列表
                getMenuTree(menuParams),           // 获取所有权限菜单
            ]);

            const {items} = roleResponse.payload as SysRoleListRes;
            setRoles(items);
            // setPagination({ current: page, pageSize, total: roleResponse.payload.total });
            setPermissions(menuResponse.payload as []);  // 存储所有权限菜单
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();  // 初次加载时获取角色列表及权限数据
    }, []);

    // 表格的列定义
    const columns: ColumnsType<SysRoleRes> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '数据权限',
            dataIndex: 'data_scope',
            key: 'data_scope',
            render: (text: number) => (
                <Tag color={'blue'}>{text === 1 ? '全部数据权限' : '自定义数据权限'}</Tag>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: number) => (
                <Tag color={text === 1 ? 'green' : 'red'}>{text === 1 ? '正常' : '禁用'}</Tag>
            ),
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '操作',
            key: 'action',
            render: (record: SysRoleRes) => (
                <Space size="middle">
                    <a href="#" onClick={() => showEditModal(record)}>编辑</a> {/* 编辑角色 */}
                    <a href="#" onClick={() => showPermissionDrawer(record)}>权限设置</a> {/* 权限设置 */}
                </Space>
            ),
        },
    ];

    // 处理复选框选择
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // 处理新建角色
    const handleCreateRole = async (values: SysRoleRes) => {
        try {
            await createNewRole(values);
            setModalVisible(false);
            await fetchRoles(); // 刷新角色列表
        } catch (error) {
            console.error(error);
        }
    };

    // 显示新建模态框
    const showModal = () => {
        setModalVisible(true);
    };

    // 关闭新建模态框
    const handleCancel = () => {
        setModalVisible(false);
    };

    // 显示编辑模态框
    const showEditModal = (record: SysRoleRes) => {
        setCurrentRole(record); // 设置当前编辑的角色
        setEditModalVisible(true); // 打开编辑模态框
    };

    // 关闭编辑模态框
    const handleEditCancel = () => {
        setEditModalVisible(false);
    };

    // 处理编辑角色的更新
    const handleEditRole = async (values: never) => {
        try {
            if(currentRole){
                await updateRoleInfo(currentRole.id, values);
                setEditModalVisible(false);
                await fetchRoles(); // 刷新角色列表
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditPermission = async (values: number[]) => {
        try {
            if (currentRole){
                await updateRoleMenus(currentRole.id, {menus: values});
                setEditModalVisible(false);
                await fetchRoles(); // 刷新角色列表
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 显示权限设置 Drawer
    const showPermissionDrawer = (record: SysRoleRes) => {
        setCurrentRole(record);
        // setSelectedPermissions(record.menus.map(menu => menu.id.toString())); // 设置当前角色的选中权限
        setDrawerVisible(true); // 打开 Drawer
    };

    // 关闭权限设置 Drawer
    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    // 处理删除角色
    const handleDelete = async () => {
        try {
            await removeRole({ pk: selectedRowKeys as number[] });
            setSelectedRowKeys([]);
            fetchRoles();
        } catch (error) {
            console.error(error);
        }
    };

    // 分页变化时调用
    const handlePaginationChange = (page: number, pageSize: number) => {
        setPagination({ ...pagination, current: page, pageSize });
        fetchRoles(page, pageSize);
    };

    return (
        <div>
            <h2>角色管理</h2>

            {/* 搜索栏 */}
            <Space style={{marginBottom: 16}}>
                <Input
                    placeholder="请输入角色名称"
                    style={{width: 200}}
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                />
                <Select
                    placeholder="状态"
                    style={{width: 120}}
                    value={status}
                    onChange={(value) => setStatus(value)}
                >
                    <Option value="正常">正常</Option>
                    <Option value="禁用">禁用</Option>
                </Select>
                <Button type="primary" icon={<SearchOutlined/>} onClick={() => fetchRoles()}>
                    搜索
                </Button>
                <Button icon={<DeleteOutlined/>} danger onClick={() => {
                    setRoleName('');
                    setStatus(undefined);
                    fetchRoles();
                }}>
                    重置
                </Button>
            </Space>
            <Divider/>

            {/* 新建和删除按钮 */}
            <Space style={{marginBottom: 16}}>
                <Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>
                    新建
                </Button>
                <Button icon={<DeleteOutlined/>} danger disabled={!selectedRowKeys.length} onClick={handleDelete}>
                    删除
                </Button>
            </Space>

            {/* 警告信息 */}
            <Alert
                message="设置数据权限为全部时，将忽略菜单授权或API授权，直接拥有所有权限，请谨慎操作！"
                type="warning"
                showIcon
                style={{marginBottom: 16}}
            />

            {/* 表格 */}
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={roles}
                rowKey="id"
                pagination={false}
                loading={loading}
            />

            {/* 分页 */}
            <div style={{marginTop: 16, textAlign: 'right'}}>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePaginationChange}
                />
            </div>

            {/* 新建角色模态框 */}
            <CreateRoleModal visible={modalVisible} onCancel={handleCancel} onCreate={handleCreateRole}/>

            {/* 编辑角色模态框 */}
            <EditRoleModal
                visible={editModalVisible}
                onCancel={handleEditCancel}
                onEdit={handleEditRole}
                role={currentRole}
            />

            {/* 权限设置 Drawer */}
            <PermissionDrawer
                visible={drawerVisible}
                onCancel={closeDrawer}
                onEdit={handleEditPermission}
                permission={currentRole}
                allPermission={permissions}
            />
        </div>
    );
};

export default AdminRolePage;
