import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const AddDeptModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();

    // 提交表单数据
    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                onCreate(values);
                form.resetFields(); // 重置表单
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="新增部门"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}  // 点击确认时调用
            okText="提交"
            cancelText="取消"
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label="部门名称"
                    name="name"
                    rules={[{ required: true, message: '请输入部门名称' }]}
                >
                    <Input placeholder="请输入部门名称" />
                </Form.Item>
                <Form.Item
                    label="负责人"
                    name="leader"
                >
                    <Input placeholder="请输入负责人" />
                </Form.Item>
                <Form.Item
                    label="联系电话"
                    name="phone"
                >
                    <Input placeholder="请输入联系电话" />
                </Form.Item>
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[{ type: 'email', message: '请输入正确的邮箱' }]}
                >
                    <Input placeholder="请输入邮箱" />
                </Form.Item>
                <Form.Item
                    label="状态"
                    name="status"
                    initialValue={1}  // 默认状态是启用
                >
                    <Select>
                        <Option value={1}>正常</Option>
                        <Option value={0}>禁用</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddDeptModal;
