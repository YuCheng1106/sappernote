import { useState, useEffect } from 'react';
import { Modal, Select } from 'antd';
import {SysDeptRes} from "../../../api/dept.ts";

const { Option } = Select;

interface EditDeptsModalProps {
    visible: boolean;
    depts?: SysDeptRes[];      // 假设 depts 是 SysDeptRes 类型的数组
    allDepts?: SysDeptRes[];   // 假设 allDepts 也是 SysDeptRes 类型的数组
    onCancel: () => void;      // onCancel 不接受参数
    onEdit: (editedDepts: SysDeptRes[]) => void;  // 假设 onEdit 接受编辑后的部门列表作为参数
}

const EditDeptsModal = ({
                            visible,
                            depts = [],         // 设置默认值为空数组
                            allDepts = [],      // 设置默认值为空数组
                            onCancel,
                            onEdit
                        }: EditDeptsModalProps) => {
    const [selectedDepts, setSelectedDepts] = useState(depts.map((dept) => dept.name));

    // 当 props 中的 depts 变化时，更新本地状态
    useEffect(() => {
        setSelectedDepts(depts.map((dept) => dept.name));
    }, [depts]);

    const handleSave = () => {
        const selectedDept = allDepts
            .filter((dept) => selectedDepts.includes(dept.name))  // 根据名称筛选
        // .map((role) => role.id);  // 只获取 id
        onEdit(selectedDept);
    };

    return (
        <Modal
            title="编辑用户部门"
            open={visible}
            onCancel={onCancel}
            onOk={handleSave} // 点击确定时保存
        >
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择部门"
                value={selectedDepts}
                onChange={(newDepts) => setSelectedDepts(newDepts)}  // 更新本地的部门选择
            >
                {allDepts.map((dept) => (
                    <Option key={dept.id} value={dept.name}>
                        {dept.name}
                    </Option>
                ))}
            </Select>
        </Modal>
    );
};

export default EditDeptsModal;
