import React, {useEffect, useState} from 'react';
import {Input, Button, Select, Modal, message, Spin, Alert, Flex} from 'antd';
import axios from 'axios';
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {getToken} from '../../../utils/auth';
import Draggable from 'react-draggable';

const {Option} = Select;

const DraggableModal: React.FC<{
    visible: boolean;
    title: string;
    onCancel: () => void;
    children: React.ReactNode
}> = ({visible, title, onCancel, children}) => {
    const dragHandleRef = React.useRef<HTMLDivElement>(null); // 引用拖动句柄
    return (
        <Draggable>
            <div>
                <Modal
                    visible={visible}
                    title={
                        <div className="drag-handle" ref={dragHandleRef}>
                            {title}
                        </div>
                    }
                    onCancel={onCancel}
                    footer={null}
                    mask={false}
                    maskClosable={false}
                    bodyStyle={{padding: 0}} // 去掉内边距
                >
                    {children}
                </Modal>
            </div>
        </Draggable>
    );
};

const WorklogAdd: React.FC = () => {
    const currentuser = useSelector((state: RootState) => state.user);
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const getChinaDate = (): string => {
        const date = new Date();
        const chinaTimezoneOffset = 8 * 60; // 中国时间偏移量 (分钟)
        const localTimezoneOffset = date.getTimezoneOffset(); // 本地时区偏移量 (分钟)
        const chinaTime = new Date(date.getTime() + (chinaTimezoneOffset + localTimezoneOffset) * 60 * 1000);
        return chinaTime.toISOString().split('T')[0];
    };
    const [currentDate, setCurrentDate] = useState<string>(getChinaDate());
    const [log, setLog] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [checkLoading, setCheckLoading] = useState<boolean>(false);
    const [successVisible, setSuccessVisible] = useState<boolean>(false);
    const [errorVisible, setErrorVisible] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [standardVisible, setStandardVisible] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');
    const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
    const [refuseVisible, setRefuseVisible] = useState<boolean>(false);
    const [standardContent, setStandardContent] = useState<string>('这是标准。');
    const token = getToken();

    useEffect(() => {
        const fetchGroups = async () => {
            if (currentuser) {
                console.log(currentuser);
                const response = await axios.get(`http://localhost:8000/api/v1/sys/depts/${currentuser.id}/all`);
                setGroups(response); // 确保使用 response.data
                console.log(response);

                if (response.length > 0) {
                    setSelectedGroup(response[0].id);
                    setStandardContent(response[0].worklogStandard); // 设置第一个组的标准内容
                    console.log(response[0].id);
                }
            }
        };
        fetchGroups();
    }, [currentuser]);

    useEffect(() => {
        // 根据选中的组更新标准内容
        const selectedGroupData = groups.find(group => group.id === selectedGroup);
        if (selectedGroupData) {
            setStandardContent(selectedGroupData.worklogStandard);
        }
    }, [selectedGroup, groups]);

    const handleSubmitLog = async () => {
        if (!log) {
            message.error("请填写工作日志");
            return;
        }
        await handleCheckLog();
        console.log({modalContent});
        const lines = modalContent.trim().split('\n');
        const lastLine = lines[lines.length - 1].trim();
        const percentageMatch = lastLine.match(/(\d+)%/);
        if (percentageMatch) {
            const percentage = parseInt(percentageMatch[1], 10);
            if (percentage < 80) {
                await handleRefuse();
                return;
            } else if (percentage < 90) {
                const shouldSubmit = await handleConfirmation();
                if (!shouldSubmit) {
                    // 如果用户选择取消，则停止提交
                    return;
                }
            }
        }


        const logData = `姓名：${currentuser.nickname}\n时间：${currentDate}\n工作日志：${log}`;
        setLoading(true);


        // 提交日志
        try {
            const response = await axios.put('http://localhost:8000/api/v1/worklogs/submit', {
                text: logData,
                group_uuid: selectedGroup,
                user_uuid: currentuser.uuid,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // 添加请求头
                },
            });

            setLoading(false);
            if (response.data === 'success') {
                setSuccessVisible(true);
                setTimeout(() => setSuccessVisible(false), 3000);
            } else {
                setErrorVisible(true);
                setTimeout(() => setErrorVisible(false), 3000);
            }
        } catch (error) {
            setLoading(false);
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 3000);
        }
    };

    const handleCheckLog = async () => {
        setCheckLoading(true);
        const combinedText = `${standardContent}\n\n姓名：${currentuser.nickname}\n时间：${currentDate}\n工作日志：${log}`;
        console.log('检查' + combinedText);
        try {
            const response = await fetch('http://localhost:8000/api/v1/worklogs/check_text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // 添加请求头
                },
                body: JSON.stringify({text: combinedText}),
            });
            const result = await response.json();
            setCheckLoading(false);
            setModalContent(result.checkedText || '');
            setModalVisible(true);
        } catch (error) {
            setCheckLoading(false);
            message.error('检查日志时发生错误');
        }
    };

    const handleConfirmation = async () => {
        return new Promise((resolve) => {
            setConfirmationVisible(true);

            const onConfirm = () => {
                setConfirmationVisible(false);
                resolve(true); // 确认提交
            };

            const onCancel = () => {
                setConfirmationVisible(false);
                resolve(false); // 取消提交
            };

            // 这里需要绑定 onConfirm 和 onCancel 到 Modal 按钮
            return {onConfirm, onCancel};
        });
    };

    const handleRefuse = () => {
        setRefuseVisible(false);
        // 继续修改
    };

    return (
        <Flex gap="small" vertical>
            {successVisible && <Alert message="日志已提交并处理成功" type="success"/>}
            {errorVisible && <Alert message="提交日志时发生错误，请稍后重试。" type="error"/>}

            {loading && <Spin tip="Loading..."/>}
            <Flex gap="small" wrap>
                <label>姓名：</label>
                <Input value={currentuser?.nickname} readOnly style={{width: 130}}/>

                <label>时间：</label>
                <Input value={currentDate} readOnly style={{width: 130}}/>

                <label>选择组:</label>
                <Select value={selectedGroup} onChange={setSelectedGroup} style={{width: 100, marginLeft: 5}}>
                    {groups.map(group => (
                        <Option key={group.id} value={group.id}>{group.name}</Option>
                    ))}
                </Select>
            </Flex>

            <label>工作日志：</label>
            <Flex gap="small" vertical>
                <Input.TextArea
                    value={log}
                    onChange={(e) => setLog(e.target.value)}
                    placeholder="请输入工作日志内容..."
                    style={{width: '100%', height: '70vh'}}
                />

                <Flex gap="small" wrap>
                    <Button onClick={handleSubmitLog} loading={loading}>提交</Button>
                    <Button onClick={handleCheckLog} loading={checkLoading}>检查</Button>
                    <Button onClick={() => setLog('')}>清除</Button>
                    <Button onClick={() => setStandardVisible(true)}>查看标准</Button>
                    {/*<Button onClick={() => setModalVisible(true)}>查看结果</Button>*/}
                    {/*<Button onClick={() => setRefuseVisible(true)}>拒绝</Button>*/}
                </Flex>
            </Flex>

            <DraggableModal
                visible={standardVisible}
                title="工作日志标准"
                onCancel={() => setStandardVisible(false)}
            >
                <p>{standardContent}</p>
            </DraggableModal>

            <DraggableModal
                visible={modalVisible}
                title="检查结果"
                onCancel={() => setModalVisible(false)}
            >
                <p>{modalContent}</p>
            </DraggableModal>


            <Modal
                visible={confirmationVisible}
                title="确认"
                onCancel={() => setConfirmationVisible(false)}
                footer={[
                    <Button key="confirm" type="primary" onClick={handleConfirmation}>
                        确定
                    </Button>,
                    <Button key="cancel" onClick={() => setConfirmationVisible(false)}>取消</Button>,
                ]}
            >
                <p>尚有需要添加的内容，是否继续提交？</p>
            </Modal>

            <Modal
                visible={refuseVisible} title="拒绝"
                onCancel={handleRefuse}
                footer={null}
            >
                <p>您的工作日志未达到80%符合指数，请继续修改</p>
                <Button onClick={handleRefuse}>继续修改</Button>
            </Modal>
        </Flex>
    );
};

export default WorklogAdd;
