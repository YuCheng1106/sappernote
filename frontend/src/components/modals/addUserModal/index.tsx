import { Modal, Form, Input, Select, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {SysRoleRes} from "../../../api/role.ts";
import {SysDeptRes} from "../../../api/dept.ts";
import {SysUserAddReq} from "../../../api/user.ts";

const { Option } = Select;

interface AddUserModalProps {
    visible: boolean;
    allRoles?: SysRoleRes[];
    allDepts?: SysDeptRes[]; // 假设 allDepts 是 SysDeptRes 类型
    onCancel: () => void;
    onCreate: (values: SysUserAddReq) => void;
}

const AddUserModal = ({
                          visible,
                          allRoles = [],
                          allDepts = [],
                          onCancel,
                          onCreate
                      }: AddUserModalProps) => {
    const [form] = Form.useForm();

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
            title="添加用户"
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
                    name="depts"
                    label="部门"
                    rules={[{ required: true, message: '请选择至少一个部门' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="请选择部门"
                    >
                        {allDepts.map((dept) => (
                            <Option key={dept.id} value={dept.id}>
                                {dept.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

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
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password
                        placeholder="请输入密码"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
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

                <Form.Item
                    name="roles"
                    label="角色"
                    rules={[{ required: true, message: '请选择至少一个角色' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="请选择角色"
                    >
                        {allRoles.map((role) => (
                            <Option key={role.id} value={role.id}>
                                {role.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddUserModal;
