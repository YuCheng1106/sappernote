import React, {useEffect} from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Option } = Select;

const EditUserModal = ({ visible, onCancel, onCreate, user}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue(user); // 预填充表单数据
        }
    }, [user, form]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onCreate(values); // 调用父组件的创建方法
                form.resetFields(); // 提交后重置表单
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="更新用户"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    确定
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                name="add_user_form"
                initialValues={{
                    department: [],
                    role: [],
                }}
            >
                <Form.Item
                    name="nickname"
                    label="用户名"
                    // rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input placeholder="请输入昵称" />
                </Form.Item>

                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                >
                    <Input placeholder="请输入邮箱" />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default EditUserModal;
