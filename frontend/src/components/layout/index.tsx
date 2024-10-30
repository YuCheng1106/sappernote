import React, { ReactNode, useState } from 'react';
import { Layout, Menu, Image, Button, Drawer } from 'antd';
import CustomHeader from "../customHeader";
import { Outlet } from 'react-router-dom';
import { FileSearchOutlined, PlusSquareOutlined, BorderOutlined, FilePdfOutlined, FileWordOutlined, LinkOutlined } from '@ant-design/icons';
import logoImage from '../../assets/images/favicon.ico';

const { Content, Sider } = Layout;

interface LayoutContainerProps {
    children?: ReactNode;
}

interface FileData {
    id: string;
    title: string;
    type: 'pdf' | 'word' | 'url';
    content: string;
}

const mockData: FileData[] = [
    {
        id: '121212121',
        title: 'cc自我剪辑',
        type: 'pdf',
        content: "我是永远的神"
    },
    {
        id: '121234121',
        title: 'cc自我终结',
        type: 'word',
        content: "我是永远的神"
    },
    {
        id: '121232121',
        title: 'cc自我提',
        type: 'url',
        content: "我是永远的神"
    },
];

// 根据 type 返回对应的图标
const getIconByType = (type: string) => {
    switch (type) {
        case 'pdf':
            return <FilePdfOutlined style={{ color: 'red' }} />;
        case 'word':
            return <FileWordOutlined style={{ color: 'skyblue' }} />;
        case 'url':
            return <LinkOutlined />;
        default:
            return <FileSearchOutlined />;
    }
};

const LayoutContainer: React.FC<LayoutContainerProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isFileContentVisible, setIsFileContentVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

    const onCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
    };

    const toggleFileView = (file: FileData) => {
        if (file) {
            setSelectedFile(file);
        }
        setIsFileContentVisible(!isFileContentVisible);
    };

    const handleFileViewClose = (): void => {
        setIsFileContentVisible(false);
    }
    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: 'white' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} theme="light">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px' }}>
                    <Image src={logoImage} preview={false} width="50px" />
                    {!collapsed && <span style={{ marginLeft: 10 }}>NotebookSapper</span>}
                </div>
                <div style={{
                    display: !collapsed ? 'flex' : 'none',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '64px',
                    padding: "0px 20px"
                }}>
                    <span>来源</span>
                    <Button type={"text"} icon={<PlusSquareOutlined />} />
                </div>
                <div style={{
                    display: !collapsed ? 'flex' : 'none',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '64px',
                    padding: "0px 20px"
                }}>
                    <span>选择所有来源</span>
                    <Button type={"text"} icon={<BorderOutlined />} />
                </div>
                <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
                    {/* 动态渲染 Menu.Item */}
                    {mockData.map(item => (
                        <Menu.Item key={item.id} icon={getIconByType(item.type)} onClick={() => toggleFileView(item)}>
                            {item.title}
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Drawer
                title={selectedFile?.title || "文件内容"}
                onClose={() => handleFileViewClose()}
                open={isFileContentVisible}
                width='500px'
            >
                <p>{selectedFile?.content}</p>
            </Drawer>
            <Layout>
                <CustomHeader />
                <Content style={{ margin: '16px 10px 0 5px' }}>
                    {children || <Outlet />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutContainer;
