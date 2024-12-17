import { Modal, Form, Input, Select, Button, Switch } from 'antd';
import React from 'react';

const { Option } = Select;

const CreateRoleModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();

    // 当点击确定时提交表单
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

    // 状态开关的处理函数，1代表开启，0代表禁用
    const handleStatusChange = (checked: number) => {
        form.setFieldsValue({ status: checked ? 1 : 0 });
    };

    return (
        <Modal
            title="新建角色"
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
            <Form form={form} layout="vertical" name="create_role_form">
                <Form.Item
                    name="name"
                    label="角色名称"
                    rules={[{ required: true, message: '请输入角色名称' }]}
                >
                    <Input placeholder="请输入角色名称" />
                </Form.Item>

                <Form.Item
                    name="data_scope"
                    label="数据权限"
                    rules={[{ required: true, message: '请选择数据权限' }]}
                >
                    <Select placeholder="自定义数据权限">
                        <Option value={1}>全部数据权限</Option>
                        <Option value={2}>自定义数据权限</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="状态"
                    initialValue={1} // 默认值为开启
                >
                    <Switch
                        checkedChildren="开启"
                        unCheckedChildren="禁用"
                        defaultChecked
                        onChange={handleStatusChange}
                    />
                </Form.Item>

                <Form.Item name="remark" label="备注">
                    <Input.TextArea rows={4} placeholder="请输入备注" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateRoleModal;
