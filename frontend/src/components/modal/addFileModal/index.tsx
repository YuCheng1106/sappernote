import React, { useState } from 'react';
import { Modal, Form, Input, Select, Upload, Progress } from 'antd';
import { UploadOutlined, GoogleOutlined, LinkOutlined, FileTextOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { RcFile } from 'rc-upload/lib/interface';

const { Option } = Select;

interface AddFileModalProps {
    visible: boolean;
    onCancel: () => void;
}

const AddFileModal: React.FC<AddFileModalProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [sourceCount, setSourceCount] = useState<number>(5);
    const maxSources = 50;

    // 提交表单数据
    const handleSubmit = () => {
        form.validateFields().then(values => {
            console.log('提交的表单数据: ', values);
            onCancel(); // 关闭模态框
        });
    };

    // 文件上传的属性设置
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: true,
        beforeUpload: (file: RcFile) => {
            console.log('选择的文件:', file);
            setSourceCount(sourceCount + 1)
            return false; // 阻止自动上传，需要手动上传
        },
        onChange(info) {
            console.log('文件上传状态:', info);
        }
    };

    return (
        <Modal
            title="添加来源"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText="提交"
            cancelText="取消"
        >
            <Form layout="vertical" form={form}>
                {/* 上传文件区域 */}
                <Form.Item label="上传来源">
                    <Upload.Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">拖放或选择文件，即可上传</p>
                        <p className="ant-upload-hint">支持的文件类型：PDF, .txt, Markdown, 音频 (例如 mp3)</p>
                    </Upload.Dragger>
                </Form.Item>

                {/* 其他来源选项 */}
                <Form.Item label="选择来源类型" name="sourceType" rules={[{ required: true, message: '请选择一个来源类型' }]}>
                    <Select placeholder="选择来源类型" style={{ width: '100%' }}>
                        <Option value="google_docs">
                            <GoogleOutlined /> Google 文档
                        </Option>
                        <Option value="google_slides">
                            <GoogleOutlined /> Google 幻灯片
                        </Option>
                        <Option value="link">
                            <LinkOutlined /> 链接 (网站, YouTube)
                        </Option>
                        <Option value="text">
                            <FileTextOutlined /> 复制的文字
                        </Option>
                    </Select>
                </Form.Item>

                {/* 手动粘贴文字 */}
                <Form.Item label="粘贴文字" name="pastedText">
                    <Input.TextArea rows={4} placeholder="粘贴文字内容" />
                </Form.Item>
            </Form>

            {/* 来源数量进度条 */}
            <div style={{ marginTop: '20px' }}>
                <p>来源限制</p>
                <Progress percent={(sourceCount / maxSources) * 100} status="active" showInfo format={() => `${sourceCount}/${maxSources}`} />
            </div>
        </Modal>
    );
};

export default AddFileModal;
