import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Switch } from 'antd';

const { Option } = Select;

const EditRoleModal = ({ visible, onCancel, onEdit, role }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (role) {
            form.setFieldsValue(role); // 预填充表单数据
        }
    }, [role, form]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                console.log(values);
                onEdit(values);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="编辑角色"
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
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="角色名称"
                    rules={[{ required: true, message: '请输入角色名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="data_scope"
                    label="数据权限"
                    rules={[{ required: true, message: '请选择数据权限' }]}
                >
                    <Select>
                        <Option value={1}>全部数据权限</Option>
                        <Option value={2}>自定义数据权限</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="status" label="状态">
                    <Switch checkedChildren="开启" unCheckedChildren="禁用" defaultChecked />
                </Form.Item>
                <Form.Item name="remark" label="备注">
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditRoleModal;
