import React, {useEffect, useState} from 'react';
import { Layout, Avatar, Dropdown, Space, Button, Input, message } from 'antd';
import { SettingOutlined, ShareAltOutlined, EditOutlined, CheckOutlined, CloseOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useDispatchNotebook, useNotebookSelector } from "../../hooks";
import {useNavigate} from "react-router-dom";

const { Header } = Layout;

const CustomHeader: React.FC = () => {
    const { updateNotebookInfo } = useDispatchNotebook();
    const notebook = useNotebookSelector((state) => state.notebook.notebookDetails);
    const navigate = useNavigate();

    // States for title editing
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(notebook?.title || '');

    useEffect(() => {
        setTitle(notebook?.title || '');
    }, [notebook]);

    // Dropdown menu actions
    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (key === '1') {
            // Implement logout logic here
            message.info("You have logged out");
        }
    };

    const items: MenuProps['items'] = [
        { label: '退出登录', key: '1' },
    ];

    // Handle title update
    const handleTitleEdit = async () => {
        if (!notebook) return;
        try {
            await updateNotebookInfo(notebook.id, { title });
            message.success("Title updated successfully");
            setIsEditing(false);
        } catch (error) {
            message.error("Failed to update title");
        }
    };

    return (
        <Header style={{
            background: '#fff',
            padding: '2px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0'
        }}>
            {/* Left Side: Logo and Notebook Title */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button type={"text"} size={"large"} icon={<ArrowLeftOutlined />} onClick={() => navigate('/playground')}/>
                {!isEditing ? (
                    <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setIsEditing(true)}>
                        {title} <EditOutlined style={{ fontSize: '16px', marginLeft: '8px' }} />
                    </h2>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '200px', marginRight: '8px' }}
                        />
                        <Button.Group>
                            <Button icon={<CheckOutlined />} type="primary" onClick={handleTitleEdit} />
                            <Button icon={<CloseOutlined />} onClick={() => setIsEditing(false)} />
                        </Button.Group>
                    </div>
                )}
            </div>

            {/* Right Side: Settings, Share, and User Avatar */}
            <Space size="middle">
                <Button icon={<SettingOutlined />}>设置</Button>
                <Button icon={<ShareAltOutlined />}>分享</Button>

                <Dropdown menu={{ items, onClick }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Avatar
                                src="https://sapper3701-1316534880.cos.ap-nanjing.myqcloud.com/44330c73-c348-4cb8-b740-f5d1d32af983/f4944bc0-1008-4ad7-8fe8-6a96ca57a12a.png"
                                alt="用户头像"
                                size="default"
                                style={{ cursor: 'pointer' }}
                            />
                        </Space>
                    </a>
                </Dropdown>
            </Space>
        </Header>
    );
};

export default CustomHeader;
