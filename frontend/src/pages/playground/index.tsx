import React, { useState } from 'react';
import { Button, Card, Divider, Dropdown, Space, Table, Typography } from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import { PlusOutlined, AppstoreOutlined, BarsOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const notesData = [
    {
        id: '1',
        title: '人物画像',
        date: '2024年10月29日',
        sources: 5,
        role: '管理员',
    },
    {
        id: '2',
        title: '历史记录',
        date: '2024年10月28日',
        sources: 3,
        role: '编辑',
    },
];

interface DataType {
    id: string;
    title: string;
    sources: number;
    date: string;
    role: string;
}

// Dropdown 的菜单项
const viewMenuItems: MenuProps['items'] = [
    {
        key: '1',
        label: '最近',
    },
    {
        key: '2',
        label: '标题',
    },
    {
        key: '3',
        label: '与我分享',
    },
];

// 定义表格的列
const columns: TableColumnsType<DataType> = [
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '来源',
        dataIndex: 'sources',
        key: 'sources',
        render: (sources: number) => `${sources} 个来源`,
    },
    {
        title: '创建日期',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
    },
];

const PlaygroundPage: React.FC = () => {
    // 俩种 view 一个是卡片视图 一个是文件表格列表
    const [isCardView, setIsCardView] = useState(true);

    // 切换视图的函数
    const toggleView = () => {
        setIsCardView(!isCardView);
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* 标题部分 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2}>欢迎使用 NotebookSapper</Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <SettingOutlined style={{ fontSize: '24px' }} />
                    <UserOutlined style={{ fontSize: '24px' }} />
                </div>
            </div>

            {/* 副标题和操作按钮 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <Title level={4}>我的笔记本</Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button type="primary" icon={<PlusOutlined />}>新建</Button>
                    <Space>
                        {/* 根据当前视图切换按钮图标 */}
                        <Button icon={isCardView ? <BarsOutlined /> : <AppstoreOutlined />} onClick={toggleView} />
                        <Dropdown menu={{ items: viewMenuItems }}>
                            <Button>最近</Button>
                        </Dropdown>
                    </Space>
                </div>
            </div>

            <Divider />

            {/* 根据 isCardView 的状态显示不同的视图 */}
            {isCardView ? (
                <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {notesData.map(note => (
                        <Card
                            key={note.id}
                            style={{ borderRadius: '10px' }}
                            cover={
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                                    <AppstoreOutlined style={{ fontSize: '48px' }} />
                                </div>
                            }
                            actions={[
                                <span key="edit">编辑</span>,
                                <span key="delete">删除</span>,
                            ]}
                        >
                            <Card.Meta
                                title={note.title}
                                description={`${note.date} · ${note.sources} 个来源`}
                            />
                        </Card>
                    ))}
                </div>
            ) : (
                <Table columns={columns} dataSource={notesData} rowKey="id" style={{ marginTop: '24px' }} />
            )}
        </div>
    );
};

export default PlaygroundPage;
