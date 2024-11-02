import React from 'react';
import { Button, List, Space, Spin } from 'antd';
import { CopyOutlined, PushpinOutlined } from '@ant-design/icons';
import { useDispatchNote, useNotebookSelector } from "../../hooks";
import { NoteReq } from "../../api/note.ts";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant' | 'progress' | 'error';
    content: string;
}

interface ConservationProps {
    messages: Message[];
}

const Conservation: React.FC<ConservationProps> = ({ messages }) => {
    const { addNewNote } = useDispatchNote();
    const notebook = useNotebookSelector((state) => state.notebook.notebookDetails);

    const handleNoteAdd = async (text: string) => {
        if (!notebook) return;
        const newNote: NoteReq = {
            type: 'dialogue',
            content: text
        };
        await addNewNote(notebook.id, newNote);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f6f7', height: '100%', overflow: 'auto' }}>
            <List
                itemLayout="vertical"
                dataSource={messages}
                renderItem={(item) => (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: item.role === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: '15px'
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '80%',
                                backgroundColor: item.role === 'user' ? '#ffffff' : '#e6f7ff',
                                borderRadius: item.role === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                textAlign: "left",
                                padding: '10px 10px',
                            }}
                        >
                            {item.role === 'progress' ? (
                                <Spin tip="加载中..." />
                            ) : (
                                <>
                                    <ReactMarkdown
                                        children={item.content}
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({children }) => <p style={{ marginBottom: '10px' }}>{children}</p>,
                                        }}
                                    />
                                    {item.role === 'assistant' && (
                                        <Space size="small">
                                            <Button type="text" icon={<CopyOutlined />} />
                                            <Button type="text" icon={<PushpinOutlined />} onClick={() => handleNoteAdd(item.content)}>保存到笔记</Button>
                                        </Space>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default Conservation;
