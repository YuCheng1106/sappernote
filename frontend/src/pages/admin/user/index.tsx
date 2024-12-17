import React, {useState, useEffect} from 'react';
import {Table, Button, Input, Select, Space, Tag, Switch, Divider, message} from 'antd';
import {SearchOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatchRole, useDispatchUser, useDispatchDept} from '../../../hooks';
import AddUserModal from "../../../components/modals/addUserModal";
import EditRolesModal from "../../../components/modals/editUserRolesModal";
import EditDeptsModal from "../../../components/modals/editUserDeptsModal";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import EditUserModal from "../../../components/modals/editUserModal";
import {UserInfo} from "../../../types";
import {SysUserAddReq, SysUserInfoReq} from "../../../api/user.ts";
import type {ColumnsType} from "antd/es/table";
import {SysDeptListRes, SysDeptRes} from "../../../api/dept.ts";
import {SysRoleListRes, SysRoleRes} from "../../../api/role.ts";

const {Option} = Select;

const AdminUserPage = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState({current: 1, pageSize: 20, total: 0});
    const [loading, setLoading] = useState(false);
    const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
    const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
    const [isEditRolesModalVisible, setIsEditRolesModalVisible] = useState(false);
    const [isEditDeptsModalVisible, setIsEditDeptsModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

    const [roles, setRoles] = useState<SysRoleRes[]>([]);
    const [depts, setDepts] = useState<SysDeptRes[]>([]);
    const users = useSelector((state: RootState) => state.user.userList) || [];

    const {
        fetchUsers,
        changeStatus,
        toggleSuperuser,
        addUser,
        updateUser,
        deleteUser,
        updateUserRole,
        updateUserDept
    } = useDispatchUser();

    const {getRoleList} = useDispatchRole();
    const {fetchAllDepartments} = useDispatchDept();

    const showAddUserModal = () => {
        setIsAddUserModalVisible(true);
    };

    const showEditUserModal = (user: UserInfo) => {
        setCurrentUser(user)
        setIsEditUserModalVisible(true);
    };

    const handleCancelEditUser = () => {
        setIsEditUserModalVisible(false);
    };

    const handleCancelAddUser = () => {
        setIsAddUserModalVisible(false);
    };

    const handleCancelEditRoles = () => {
        setIsEditRolesModalVisible(false);
    };

    const handleCancelEditDepts = () => {
        setIsEditDeptsModalVisible(false);
    };

    const handleEditDepts = (depts: SysDeptRes[]) => {
        if(! currentUser){
            return;
        }
        updateUserDept(currentUser.username, {depts: depts}).then(() => {
            message.success('成功更新用户角色！！！');
        })
        setIsEditDeptsModalVisible(false);
    };

    const handleAddUser = async (userData: SysUserAddReq) => {
        await addUser(userData);
        setIsAddUserModalVisible(false);
    };

    const handleEditUser = async (userData: SysUserInfoReq) => {
        if(!currentUser){
            return;
        }
        await updateUser(currentUser.username, userData);
        // Add your user creation logic here (e.g., API call)
        setIsEditUserModalVisible(false);
    };

    const handleEditRoles = async (roles: SysRoleRes[]) => {
        if(! currentUser){
            return;
        }
        updateUserRole(currentUser.username, {roles: roles}).then(() => {
            message.success('成功更新用户角色！！！');
        })
        setIsEditRolesModalVisible(false);
    };

    const [searchParams, setSearchParams] = useState({
        username: '',
        mobile: '',
        status: undefined,
    });

    useEffect(() => {
        loadUsers();
    }, [pagination.current, pagination.pageSize]);

    const loadUsers = async () => {
        setLoading(true);
        const params = {
            ...searchParams,
            page: pagination.current,
            size: pagination.pageSize,
        };
        try {
            const [userResponse, roleResponse, deptResponse] = await Promise.all([
                fetchUsers(params),
                getRoleList(params),
                fetchAllDepartments()
            ]);
            if (userResponse.payload) {
                setPagination((prev) => ({...prev}));
            }
            const roleRes = roleResponse.payload as SysRoleListRes;
            setRoles(roleRes.items);
            const res = deptResponse.payload as SysDeptListRes;
            setDepts(res.items);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSearch = () => {
        setPagination({...pagination, current: 1});
        loadUsers();
    };

    const handleReset = () => {
        setSearchParams({
            username: '',
            mobile: '',
            status: undefined,
        });
        setPagination({...pagination, current: 1});
        loadUsers();
    };

    const handleStatusChange = async (userId: number) => {
        try {
            await changeStatus(userId);
        } catch (error) {
            console.error('Failed to change user status:', error);
        }
    };

    const handleSuperChange = async (pk: number) => {
        try {
            await toggleSuperuser(pk)
        } catch (error) {
            console.error('Failed to change user super admin:', error);
        }
    };

    const openEditRolesModal = (user: UserInfo) => {
        setCurrentUser(user);
        setIsEditRolesModalVisible(true); // Show the modal
    };

    const openEditDeptsModal = (user: UserInfo) => {
        setCurrentUser(user)
        setIsEditDeptsModalVisible(true); // Show the modal
    };

    const handleDelete = async (username: string) => {
        try {
            await deleteUser(username);
        } catch (error) {
            console.error(error);
        }
    };

    const columns: ColumnsType<UserInfo> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text: string) => <div className="avatar">{text}</div>,
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '部门',
            dataIndex: 'depts',
            key: 'depts',
            render: (depts: { id: number; name: string }[], record) => (
                <div
                    style={{
                        display: 'flex',
                        gap: '4px',
                        cursor: 'pointer',
                        backgroundColor: '#f0f0f0', // 更改背景色
                        borderRadius: '4px',
                        padding: '4px',
                        minHeight: '32px', // 设置固定高度
                        transition: 'background-color 0.3s' // 添加渐变效果
                    }}
                    onClick={() => openEditDeptsModal(record)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d3d3d3')} // hover背景色
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')} // 恢复背景色
                >
                    {depts.map((dept) => (
                        <Tag key={dept.id} color="blue">
                            {dept.name}
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: { id: number; name: string }[], record) => (
                <div
                    style={{
                        display: 'flex',
                        gap: '4px',
                        cursor: 'pointer',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        padding: '4px',
                        minHeight: '32px', // 设置固定高度
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => openEditRolesModal(record)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d3d3d3')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                >
                    {roles.map((role) => (
                        <Tag key={role.id} color="blue">
                            {role.name}
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: number, record: UserInfo) => (
                <Switch
                    checkedChildren="正常"
                    unCheckedChildren="禁用"
                    checked={status === 1}
                    onChange={() => handleStatusChange(record ? record.id : 0)}
                />
            ),
        },
        {
            title: '超级管理员',
            dataIndex: 'is_superuser',
            key: 'is_superuser',
            render: (is_superuser: boolean, record: UserInfo) => (
                <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={is_superuser}
                        onChange={() => handleSuperChange(record ? record.id : 0)} />
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <a href="#" onClick={() => showEditUserModal(record)}>编辑</a>
                    <a href="#" onClick={() => handleDelete(record.username)}>删除</a>
                </Space>
            ),
        },
    ];

    return (
        <div style={{height: "100%", overflowY: 'auto'}}>
            <h2>用户管理</h2>

            {/* 搜索栏 */}
            <Space style={{marginBottom: 16}}>
                <Input
                    placeholder="请输入用户名"
                    style={{width: 200}}
                    value={searchParams.username}
                    onChange={(e) => setSearchParams({...searchParams, username: e.target.value})}
                />
                <Input
                    placeholder="请输入手机号"
                    style={{width: 200}}
                    value={searchParams.mobile}
                    onChange={(e) => setSearchParams({...searchParams, mobile: e.target.value})}
                />
                <Select
                    placeholder="状态"
                    style={{width: 120}}
                    value={searchParams.status}
                    onChange={(value) => setSearchParams({...searchParams, status: value})}
                >
                    <Option value={undefined}>全部</Option>
                    <Option value={1}>正常</Option>
                    <Option value={0}>禁用</Option>
                </Select>
                <Button type="primary" icon={<SearchOutlined/>} onClick={onSearch}>
                    搜索
                </Button>
                <Button onClick={handleReset}>重置</Button>
            </Space>
            <Divider/>

            {/* 添加用户按钮 */}
            <Button type="primary" icon={<PlusOutlined/>} onClick={showAddUserModal} style={{marginBottom: 16}}>
                添加用户
            </Button>

            {/* 用户表格 */}
            <div>
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                    }}
                    columns={columns}
                    dataSource={users}
                    rowKey="uuid"
                    pagination={pagination}
                    loading={loading}
                    // onChange={(pagination) => setPagination(pagination)}
                />
            </div>


            <AddUserModal
                visible={isAddUserModalVisible}
                allRoles={roles}
                allDepts={depts}
                onCancel={handleCancelAddUser}
                onCreate={handleAddUser}
            />

            <EditUserModal
                visible={isEditUserModalVisible}
                onCancel={handleCancelEditUser}
                onCreate={handleEditUser}
                user={currentUser}
            />

            {/* 编辑角色模态框 */}
            <EditRolesModal
                visible={isEditRolesModalVisible}
                roles={currentUser?.roles}
                allRoles={roles}
                onCancel={handleCancelEditRoles}
                onEdit={handleEditRoles}
            />

            <EditDeptsModal
                visible={isEditDeptsModalVisible}
                depts={currentUser?.depts}
                allDepts={depts}
                onCancel={handleCancelEditDepts}
                onEdit={handleEditDepts}
            />

        </div>
    );
};

export default AdminUserPage;
