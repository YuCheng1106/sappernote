import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Switch } from 'antd';

const { Option } = Select;

const EditDeptModal = ({ visible, onCancel, onEdit, dept }) => {
    const [form] = Form.useForm();

    // 如果传入了部门信息，预填充表单数据
    useEffect(() => {
        if (dept) {
            form.setFieldsValue(dept);
        }
    }, [dept, form]);

    // 点击确定按钮时，表单校验成功则提交数据
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onEdit(values);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="编辑部门"
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
                    label="部门名称"
                    rules={[{ required: true, message: '请输入部门名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="leader"
                    label="负责人"
                    rules={[{ required: true, message: '请输入负责人姓名' }]}
                >
                    <Input />
                </Form.Item>
                {/*<Form.Item*/}
                {/*    name="phone"*/}
                {/*    label="联系电话"*/}
                {/*    // rules={[{ required: true, message: '请输入联系电话' }]}*/}
                {/*>*/}
                {/*    <Input />*/}
                {/*</Form.Item>*/}
                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[{ required: true, message: '请输入邮箱' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="状态"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="正常" unCheckedChildren="禁用" defaultChecked />
                </Form.Item>
                <Form.Item name="remark" label="备注">
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditDeptModal;
