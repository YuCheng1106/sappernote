import { useState, useEffect } from 'react';
import { Modal, Select } from 'antd';
import {SysRoleRes} from "../../../api/role.ts";

const { Option } = Select;

interface EditRolesModalProps {
    visible: boolean;
    roles?: SysRoleRes[];      // 假设 roles 是 SysRoleRes 类型的数组
    allRoles?: SysRoleRes[];   // 假设 allRoles 也是 SysRoleRes 类型的数组
    onCancel: () => void;      // onCancel 不接受参数
    onEdit: (editedRoles: SysRoleRes[]) => void;  // 假设 onEdit 接受编辑后的角色列表作为参数
}

const EditRolesModal = ({
                            visible,
                            roles = [],          // 设置默认值为空数组
                            allRoles = [],        // 设置默认值为空数组
                            onCancel,
                            onEdit
                        }: EditRolesModalProps) =>{
    const [selectedRoles, setSelectedRoles] = useState(roles.map((role) => role.name));

    // 当 props 中的 roles 变化时更新本地 state
    useEffect(() => {
        setSelectedRoles(roles.map((role) => role.name));
    }, [roles]);

    const handleSave = () => {
        // 过滤出选中的角色对象并获取它们的 id
        const selectedRole = allRoles
            .filter((role) => selectedRoles.includes(role.name))  // 根据名称筛选
            // .map((role) => role.id);  // 只获取 id

        // 调用 onEdit 并传递角色
        onEdit(selectedRole);
    };


    return (
        <Modal
            title="编辑用户角色"
            open={visible}
            onCancel={onCancel}
            onOk={handleSave}  // 点击确定时保存
        >
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择角色"
                value={selectedRoles}
                onChange={(newRoles) => setSelectedRoles(newRoles)}  // 仅更新本地 state
            >
                {allRoles.map((role) => (
                    <Option key={role.id} value={role.name}>
                        {role.name}
                    </Option>
                ))}
            </Select>
        </Modal>
    );
};

export default EditRolesModal;
