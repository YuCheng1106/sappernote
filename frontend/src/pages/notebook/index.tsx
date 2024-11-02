import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LayoutContainer from '../../components/layout';
import {Button, Card, Input, List, Checkbox, Modal} from 'antd';
import { FileOutlined, CheckOutlined, CloseOutlined, BookOutlined, CompassOutlined, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import Conservation from '../../components/conservation';
import NoteAssistant from '../../components/noteAssistant';
import { useDispatchNotebook, useNotebookSelector, useDispatchNote } from '../../hooks';
import { NoteReq } from '../../api/note';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NotebookPage: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const [isNoteAssistantVisible, setIsNoteAssistantVisible] = useState<boolean>(false);
    const [isConservationVisible, setIsConservationVisible] = useState<boolean>(false);
    const [selectedNotes, setSelectedNotes] = useState<Set<number>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNoteContent, setCurrentNoteContent] = useState('');
    const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);

    const { getNotebookDetailByUuid } = useDispatchNotebook();
    const { addNewNote, removeNote, updateNote } = useDispatchNote();
    const notebook = useNotebookSelector((state) => state.notebook.notebookDetails);
    const selectSource = useNotebookSelector((state) => state.notebook.selectSource);

    useEffect(() => {
        if (uuid) {
            getNotebookDetailByUuid(uuid);
        }
    }, [getNotebookDetailByUuid, uuid]);

    const toggleModal = (type: string) => {
        if (type === 'notebook') {
            setIsNoteAssistantVisible(!isNoteAssistantVisible);
            setIsConservationVisible(false);
        }
        if (type === 'conservation') {
            setIsConservationVisible(!isConservationVisible);
            setIsNoteAssistantVisible(false);
        }
    };

    const handleNoteAdd = async () => {
        if (!notebook) return;
        const newNote: NoteReq = {
            type: 'remark'
        };
        await addNewNote(notebook.id, newNote);
    };

    const handleSelectNote = (noteId: number) => {
        setSelectedNotes(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(noteId)) {
                newSelected.delete(noteId);
            } else {
                newSelected.add(noteId);
            }
            return newSelected;
        });
    };

    const handleSelectNoteCancel = () => {
        setSelectedNotes(new Set());
    };

    const handleSelectAllNote = () => {
        if (!notebook) return;
        const allNoteIds = new Set(notebook.notes?.map(note => note.id));
        setSelectedNotes(allNoteIds);
    };

    const handleDeleteNotes = async () => {
        const selectedNoteIds = Array.from(selectedNotes);
        await removeNote({ pk: selectedNoteIds });
        setSelectedNotes(new Set());
    };

    const handleCardClick = (noteId: number, noteContent: string) => {
        setCurrentNoteId(noteId);
        setCurrentNoteContent(noteContent);
        setIsModalOpen(true);
    };

    const handleUpdateNote = async () => {
        if (currentNoteId !== null) {
            await updateNote(currentNoteId, { content: currentNoteContent });
            setIsModalOpen(false);
        }
    };

    return (
        <LayoutContainer>
            <div style={{ position: 'relative', height: '100%', padding: '16px 10px 0 5px'}}>
                <div style={{ marginBottom: '16px' }}>
                    <Button type="text" icon={<FileOutlined />} onClick={handleNoteAdd}>添加笔记</Button>
                    {selectedNotes.size !== 0 && <Button type="text" icon={<DeleteOutlined />} onClick={handleDeleteNotes}>删除笔记</Button>}
                    <Button type="text" icon={<CheckOutlined />} onClick={handleSelectAllNote}>全选</Button>
                    {selectedNotes.size !== 0 && <Button type="text" icon={<CloseOutlined />} onClick={handleSelectNoteCancel}>全部取消选择</Button>}
                </div>
                <div style={{ padding: '10px', height: 'calc(100% - 50px)', overflow: 'auto', paddingBottom: '90px'}}>
                    {notebook && (
                        <List
                            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4 }}
                            dataSource={notebook.notes}
                            renderItem={item => (
                                <List.Item>
                                    <div style={{ width: '100%', position: 'relative' }}>
                                        <Card
                                            size="small"
                                            style={{ height: '300px', backgroundColor: 'floralwhite'}}
                                            hoverable={true}
                                            title={<div><FileOutlined style={{ paddingRight: '10px' }} />{item.type === 'remark' ? '书面备注' : '已保存的回答'}</div>}
                                            extra={<Checkbox
                                                checked={selectedNotes.has(item.id)}
                                                onChange={() => handleSelectNote(item.id)}
                                            />}
                                        >
                                            <div style={{ height: '300px', overflowY: 'hidden'}} onClick={() => handleCardClick(item.id, item.content || '')}>
                                                <div dangerouslySetInnerHTML={{ __html: item.content }}/>
                                            </div>
                                        </Card>
                                    </div>
                                </List.Item>
                            )}
                        />
                    )}
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    height: isConservationVisible ? '100%' : '',
                    left: 0,
                    right: 0,
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: isConservationVisible ? 'whitesmoke' : ''
                }}>
                    <div style={{ width: '100%', textAlign: 'center', maxWidth: '900px', display: isNoteAssistantVisible ? 'block' : 'none' , height: "calc( 100% - 100px )"}}>
                        <NoteAssistant />
                    </div>
                    <div style={{ width: '100%', textAlign: 'center', maxWidth: '900px', display: isConservationVisible ? 'block' : 'none', flexGrow: 1, overflowY: 'hidden'}}>
                        <Conservation />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 0,
                            backgroundColor: '#fff',
                            borderRadius: '10px 10px 0 0',
                            maxWidth: '900px',
                            width: '100%',
                            padding: '20px',
                        }}
                    >
                        {selectedNotes.size !== 0 && <div style={{paddingBottom: '10px'}}>
                            <Button style={{marginRight: "10px"}}>帮我理解</Button>
                            <Button style={{marginRight: "10px"}}>评论</Button>
                            <Button style={{marginRight: "10px"}}>推荐相关想法</Button>
                            <Button style={{marginRight: "10px"}}>创建大纲</Button>
                            {selectedNotes.size >= 2 && <Button style={{marginRight: "10px"}}>合并到笔记</Button>}
                        </div>}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Button type="text" icon={<BookOutlined />} onClick={() => toggleModal('conservation')}>查看聊天</Button>
                            <div
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    margin: '0 10px',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    borderRadius: '10px 10px 0 0',
                                    backgroundColor: '#E3E8EE'
                                }}
                            >
                                <div style={{ width: '100px' }}>{selectSource.length} 个来源</div>
                                <Input.TextArea
                                    placeholder="输入笔记..."
                                    autoSize={{ minRows: 1, maxRows: 8 }}
                                    style={{ width: '100%', height: '80px' }}
                                    variant={"borderless"}
                                />
                                <Button type="text" size="large" icon={<SendOutlined />} />
                            </div>
                            <Button type="text" icon={<CompassOutlined />} onClick={() => toggleModal('notebook')}>笔记本助手</Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Rich Text Editor Modal */}
            <Modal
                title="编辑笔记内容"
                open={isModalOpen}
                onOk={handleUpdateNote}
                onCancel={() => setIsModalOpen(false)}
                okText="更新"
                cancelText="取消"
            >
                <ReactQuill theme="snow" value={currentNoteContent} onChange={setCurrentNoteContent} />
            </Modal>

        </LayoutContainer>
    );
};

export default NotebookPage;
