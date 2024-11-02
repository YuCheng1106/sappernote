import React, { useState } from 'react';
import { Modal, Form, Input, Select, Upload, Progress, message } from 'antd';
import { UploadOutlined, LinkOutlined, FileTextOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { RcFile } from 'rc-upload/lib/interface';
import {useDispatchNoteSource, useNotebookSelector} from '../../../hooks';

const { Option } = Select;

interface AddFileModalProps {
    visible: boolean;
    onCancel: () => void;
}

const AddFileModal: React.FC<AddFileModalProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();

    const [sourceType, setSourceType] = useState<string>('docs');
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const maxSources = 50;
    const { addNewNoteSource } = useDispatchNoteSource();
    const notebook = useNotebookSelector((state) => state.notebook.notebookDetails);
    // Handle form submission
    const handleSubmit = async () => {
        try {
            if (!notebook) return;
            const values = await form.validateFields();

            if (sourceType === 'docs' && fileList.length > 0) {
                // Dispatch the FormData with the file and metadata
                await addNewNoteSource( notebook.id, {file: fileList[0], file_type: values});
                message.success('文件上传成功');
            } else {
                message.error('请上传文件');
            }

            onCancel(); // Close the modal
            form.resetFields(); // Reset form fields
            setSourceType('docs'); // Reset source type
            setFileList([]); // Reset file list
        } catch (error) {
            message.error('请填写完整的表单');
        }
    };

    // Upload properties and restrictions
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        fileList,
        beforeUpload: (file: RcFile) => {
            if (fileList.length >= maxSources) {
                message.warning(`最多只能上传 ${maxSources} 个文件`);
                return Upload.LIST_IGNORE;
            }
            setFileList([file]);
            return false;
        },
        onRemove: () => setFileList([]),
    };

    return (
        <Modal
            title={<h2>添加来源</h2>}
            open={visible}
            onCancel={() => {
                onCancel();
                form.resetFields();
                setSourceType('docs');
                setFileList([]);
            }}
            onOk={handleSubmit}
            okText="提交"
            cancelText="取消"
            width="80%"
        >
            <Form layout="vertical" form={form}>
                <Form.Item
                    label="选择来源类型"
                    name="sourceType"
                >
                    <Select
                        placeholder="选择来源类型"
                        style={{ width: '100%' }}
                        defaultValue={'docs'}
                        onChange={(value) => setSourceType(value)}
                    >
                        <Option value="docs">
                            <FileTextOutlined /> 文档
                        </Option>
                        <Option value="link">
                            <LinkOutlined /> 网站链接
                        </Option>
                        <Option value="text">
                            <FileTextOutlined /> 复制文本
                        </Option>
                    </Select>
                </Form.Item>

                {/* Conditional form fields based on selected source type */}
                {sourceType === 'docs' && (
                    <Form.Item
                        label="上传文件"
                        name="fileUpload"
                        rules={[{ required: true, message: '请上传文件' }]}
                    >
                        <Upload.Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">拖放或选择文件进行上传</p>
                            <p className="ant-upload-hint">支持的文件类型: PDF, .txt, Markdown, 音频 (例如 mp3)</p>
                        </Upload.Dragger>
                    </Form.Item>
                )}

                {sourceType === 'link' && (
                    <Form.Item
                        label="网站链接"
                        name="websiteLinks"
                        rules={[{ required: true, message: '请输入网站链接' }]}
                    >
                        <Input.TextArea rows={4} placeholder="输入网站链接，以分号 ';' 分隔多个链接" />
                    </Form.Item>
                )}

                {sourceType === 'text' && (
                    <Form.Item
                        label="粘贴文本"
                        name="pastedText"
                        rules={[{ required: true, message: '请粘贴文本内容' }]}
                    >
                        <Input.TextArea rows={4} placeholder="粘贴文本内容" />
                    </Form.Item>
                )}

                {/* Progress Indicator for file count */}
                {sourceType === 'docs' && (
                    <Progress
                        percent={(fileList.length / maxSources) * 100}
                        showInfo={fileList.length < maxSources}
                        status={fileList.length >= maxSources ? 'exception' : 'normal'}
                    />
                )}
            </Form>
        </Modal>
    );
};

export default AddFileModal;
