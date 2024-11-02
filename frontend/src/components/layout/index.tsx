import React, {ReactNode, useEffect, useState} from 'react';
import {Layout, Menu, Image, Button, Drawer, Checkbox, Modal, message} from 'antd';
import { DeleteOutlined, FileSearchOutlined, PlusSquareOutlined, FilePdfOutlined, FileWordOutlined, LinkOutlined } from '@ant-design/icons';
import CustomHeader from "../customHeader";
import {Outlet, useNavigate} from 'react-router-dom';
import logoImage from '../../assets/images/favicon.ico';
import AddFileModal from "../modal/addFileModal";
import {useDispatchNoteSource, useNotebookSelector, useDispatchNotebook} from "../../hooks";
import { NotebookSourceRes } from "../../api/notebook";

import './index.css'
const { Content, Sider } = Layout;

// Get icon based on file type
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

const LayoutContainer: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isFileContentVisible, setIsFileContentVisible] = useState(false);
    const [isAddFileModalVisible, setIsAddFileModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState<NotebookSourceRes | null>(null);
    const [selectedSources, setSelectedSources] = useState<Set<number>>(new Set());
    const notebook = useNotebookSelector((state) => state.notebook.notebookDetails);
    const navigate = useNavigate();
    const { removeNoteSources } = useDispatchNoteSource();
    const {modifyNotebookSourcesSelect} = useDispatchNotebook();


    const onCollapse = (collapsed: boolean) => setCollapsed(collapsed);

    const toggleFileView = (file: NotebookSourceRes) => {
        setSelectedFile(file);
        setIsFileContentVisible(!isFileContentVisible);
    };

    const handleFileViewClose = () => setIsFileContentVisible(false);

    const handleSelectSource = (sourceId: number) => {
        setSelectedSources((prev) => {
            const newSet = new Set(prev);
            newSet.has(sourceId) ? newSet.delete(sourceId) : newSet.add(sourceId);
            return newSet;
        });
    };

    const handleSelectAllSources = () => {
        if (notebook && notebook.source) {
            const allSourceIds = notebook.source.map((item) => item.id);
            setSelectedSources(
                selectedSources.size === allSourceIds.length ? new Set() : new Set(allSourceIds)
            );
        }
    };

    useEffect(() => {
        if (notebook && notebook.source) {
            const allSourceIds = notebook.source.map((item) => item.id);
            setSelectedSources(new Set(allSourceIds));
            modifyNotebookSourcesSelect(allSourceIds);
        }
    }, [notebook, modifyNotebookSourcesSelect]);

    useEffect(() => {
        const selectedSourcesIds = Array.from(selectedSources);
        modifyNotebookSourcesSelect(selectedSourcesIds)
    }, [selectedSources, modifyNotebookSourcesSelect]);

    const handleDeleteSource = async (sourceId: number) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除此来源吗？此操作无法撤销。',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await removeNoteSources({ pk: [sourceId] });
                    handleSelectSource(sourceId);
                    message.success('来源已成功删除');
                } catch (error) {
                    message.error('删除失败，请稍后重试');
                }
            },
        });
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: 'white' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} theme="light">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px'}} onClick={() => navigate("/playground")}>
                    <Image src={logoImage} preview={false} width="50px" />
                    {!collapsed && <span style={{ marginLeft: 10 }}>NotebookSapper</span>}
                </div>
                <div style={{ display: !collapsed ? 'flex' : 'none', justifyContent: 'space-between', alignItems: 'center', padding: "0px 20px" }}>
                    <span>来源</span>
                    <Button type="text" icon={<PlusSquareOutlined />} onClick={() => setIsAddFileModalVisible(true)} />
                </div>
                <div style={{ display: !collapsed ? 'flex' : 'none', justifyContent: 'space-between', alignItems: 'center', padding: "0px 20px" }}>
                    <span>选择所有来源</span>
                    <Checkbox
                        style={{ paddingRight: '5px' }}
                        onChange={handleSelectAllSources}
                        checked={notebook && notebook.source ? selectedSources.size === notebook.source.length : false}
                    />
                </div>
                <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
                    {notebook && notebook.source?.map((item) => (
                        <Menu.Item key={item.id} icon={getIconByType(item.type)} className="menu-item-with-delete">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Checkbox
                                    style={{ paddingRight: '5px' }}
                                    checked={selectedSources.has(item.id)}
                                    onChange={() => handleSelectSource(item.id)}
                                />
                                <Button className="delete-icon" icon={<DeleteOutlined/>} type={'text'}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent click from triggering item selection
                                        handleDeleteSource(item.id);
                                    }}
                                />
                                <div onClick={() => toggleFileView(item)} style={{ flexGrow: 1, cursor: 'pointer' }}>
                                    {item.title}
                                </div>

                            </div>
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Drawer
                title={selectedFile?.title || "文件内容"}
                onClose={handleFileViewClose}
                open={isFileContentVisible}
                width='500px'
            >
                <p dangerouslySetInnerHTML={{ __html: selectedFile?.content || "" }} />
            </Drawer>
            <AddFileModal
                onCancel={() => setIsAddFileModalVisible(false)}
                visible={isAddFileModalVisible}
            />
            <Layout>
                <CustomHeader />
                <Content style={{ height: 'calc(100vh - 80px)' }}>
                    {children || <Outlet />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutContainer;
