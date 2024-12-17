import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useDispatchNotebook } from '../../../hooks';
import { NotebookReq } from '../../../api/notebook';
// import { v4 as uuidv4 } from 'uuid';

interface AddNotebookModalProps {
    visible: boolean;
    onCancel: () => void;
}

const AddNotebookModal: React.FC<AddNotebookModalProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { addNewNotebook } = useDispatchNotebook();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const newNotebook: NotebookReq = {
                title: values.title,
                // uuid: uuidv4(),
                // user_uuid: 'default-user', // 这里需要根据实际的用户系统修改
                active: true
            };

            await addNewNotebook(newNotebook);
            message.success('笔记本创建成功');
            form.resetFields();
            onCancel();
        } catch (error) {
            message.error('创建失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="新建笔记本"
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="创建"
            cancelText="取消"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="title"
                    label="笔记本标题"
                    rules={[{ required: true, message: '请输入笔记本标题' }]}
                >
                    <Input placeholder="请输入笔记本标题" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddNotebookModal; 