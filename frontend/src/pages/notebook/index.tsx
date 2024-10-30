import React, { useState } from 'react';
import LayoutContainer from '../../components/layout';
import { Button, Card, Input, List } from "antd";
import { FileOutlined, CheckOutlined, BorderOutlined, BookOutlined, CompassOutlined, SendOutlined } from "@ant-design/icons";
import Conservation from "../../components/conservation";
import NoteAssistant from "../../components/noteAssistant";
const mockNotebook = [
    {
        id: "sa211",
        type: 'remark',
        content: "sasasasasasas",
    },
    {
        id: "sa251",
        type: 'dialogue',
        content: "sasassasaassasasas",
    },
    {
        id: "sa21sa1",
        type: 'remark',
        content: "sasasasasasas",
    },
    {
        id: "sa251ss",
        type: 'dialogue',
        content: "sasassasaassasasas",
    }
];

const NotebookPage: React.FC = () => {
    const [isNoteAssistantVisible, setIsNoteAssistantVisible] = useState<boolean>(false);
    const [isConservationVisible, setIsConservationVisible] = useState<boolean>(false);

    const toggleModal = (type: string) => {
        if(type === 'notebook'){
            setIsNoteAssistantVisible(!isNoteAssistantVisible);
            setIsConservationVisible(false);
        }
        if(type === 'conservation'){
            setIsConservationVisible(!isConservationVisible);
            setIsNoteAssistantVisible(false);
        }
    };


    return (
        <LayoutContainer>
            <div style={{ position: "relative", paddingBottom: '120px', height: "100%" }}>
                <div style={{ marginBottom: '16px' }}>
                    <Button type={"text"} icon={<FileOutlined />}>添加笔记</Button>
                    <Button type={"text"} icon={<CheckOutlined />}>全选</Button>
                </div>
                <List
                    grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4 }}
                    dataSource={mockNotebook}
                    renderItem={item => (
                        <List.Item>
                            <div style={{ width: '100%' }}>
                                <div style={{ position: 'relative' }}>
                                    <Button type={"text"} icon={<BorderOutlined />} style={{ position: 'absolute', top: 0, right: 0 }} />
                                    <Card
                                        size={"small"}
                                        style={{ height: '300px' }}
                                        hoverable={true}
                                        title={<div><FileOutlined style={{ paddingRight: "10px" }} />{item.type === 'remark' ? "书面备注" : "已保存的回答"}</div>}
                                    >
                                        {item.content}
                                    </Card>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    {/* 上面 */}
                    <div style={{ width: '100%', textAlign: 'center', display: isNoteAssistantVisible ? "block" : "none" }}>
                        <NoteAssistant/>
                    </div>
                    <div style={{ width: '100%', textAlign: 'center', display: isConservationVisible ? "block" : 'none'}}>
                        <Conservation/>
                    </div>
                    {/* 下面 */}
                    <div
                        style={{
                            backgroundColor: '#fff',
                            boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
                            borderRadius: '10px 10px 0 0',
                            maxWidth: '900px',
                            width: '100%',
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button type="text" icon={<BookOutlined />} onClick={() => toggleModal("conservation")}>查看聊天</Button>
                        <div
                            style={{
                                width: '100%',
                                padding: "10px",
                                margin: "0 10px",
                                alignItems: "center",
                                display: 'flex',
                                justifyContent: 'center',
                                borderRadius: '10px 10px 0 0',
                                backgroundColor: '#E3E8EE'
                            }}
                        >
                            <div style={{ width: "100px" }}>四个来源</div>
                            <Input.TextArea
                                placeholder="输入笔记..."
                                autoSize={{ minRows: 1, maxRows: 8 }}
                                style={{ width: '100%', height: "80px" }}
                                variant={"borderless"}
                            />
                            <Button type={"text"} size={"large"} icon={<SendOutlined />} />
                        </div>
                        <Button type="text" icon={<CompassOutlined />} onClick={() => toggleModal("notebook")}>笔记本助手</Button>
                    </div>
                </div>
            </div>
        </LayoutContainer>
    );
};

export default NotebookPage;
