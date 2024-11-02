import React, {useEffect, useState} from 'react';
import {Button, Card, Divider, Dropdown, Space, Table, Typography} from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import {
    PlusOutlined,
    AppstoreOutlined,
    BarsOutlined,
    SettingOutlined,
    UserOutlined,
    MoreOutlined,
    DeleteOutlined,
    EditOutlined,
    FileOutlined
} from '@ant-design/icons';
import { useDispatchNotebook, useNotebookSelector } from '../../hooks';
import {NotebookRes, NotebookSourceRes} from "../../api/notebook";
import {useNavigate} from "react-router-dom";
const { Title } = Typography;


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
const columns: TableColumnsType<NotebookRes> = [
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render: (title: string) => title,
    },
    {
        title: '来源',
        dataIndex: 'source',
        key: 'source',
        render: (source: NotebookSourceRes[]) => `${source?.length} 个来源`,
    },
    {
        title: '创建日期',
        dataIndex: 'created_time',
        key: 'created_time',
    }
];

const PlaygroundPage: React.FC = () => {
    // 俩种 view 一个是卡片视图 一个是文件表格列表
    const [isCardView, setIsCardView] = useState(true);
    const { getAllNotebooks } = useDispatchNotebook();
    const notebooks = useNotebookSelector((state) => state.notebook.notebooks);
    const navigate = useNavigate();
    useEffect(() => {
        getAllNotebooks();
    }, [getAllNotebooks]);

    // 切换视图的函数
    const toggleView = () => {
        setIsCardView(!isCardView);
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Button icon={<DeleteOutlined />} type={"text"}>
                    删除
                </Button>
            ),
        },
        {
            key: '2',
            label: (
                <Button icon={<EditOutlined />} type={"text"}>
                    修改标题
                </Button>
            ),
        }
    ];

    const handleNotebookClick = (uuid: string) => {
        navigate('/notebook/' + uuid);
    }

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
                <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                    {notebooks.map(note => (
                        <Card
                            key={note.id}
                            style={{ borderRadius: '10px' }}
                            title={<FileOutlined/>}
                            hoverable={true}
                            onClick={() => {handleNotebookClick(note.uuid)}}
                            extra={
                                <Dropdown menu={{items}} trigger={['hover']}>
                                    <Button type="text" icon={<MoreOutlined />} />
                                </Dropdown>
                            }
                        >
                            <Card.Meta
                                title={<h3>{note.title}</h3>}
                                description={`${note.created_time} · ${note.source?.length} 个来源`}
                            />
                        </Card>
                    ))}
                </div>
            ) : (
                <Table columns={columns} dataSource={notebooks} rowKey="id" style={{ marginTop: '24px' }} />
            )}
        </div>
    );
};

export default PlaygroundPage;
