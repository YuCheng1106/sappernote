import React, {useEffect, useState} from 'react';
import {Table, Input, Button, Select, Space, Typography, Alert} from 'antd';
import axios from 'axios';
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

const {Option} = Select;
const {Text} = Typography;

const WorkLogsShow = () => {
    const currentuser = useSelector((state: RootState) => state.user);
    console.log(currentuser);
    const [logs, setLogs] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedGroup, setSelectedGroup] = useState<string>('个人');
    // const [currentuser, setCurrentUser] = useState<any>(null);
    const [userNames, setUserNames] = useState<Record<string, string>>({});
    const [groupNames, setGroupNames] = useState<Record<string, string>>({});
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [noLogsMessage, setNoLogsMessage] = useState<boolean>(false);
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const logResponse = await axios.get(currentuser?.is_superuser ? '/api/v1/show/worklogs/all' : '/api/v1/show/worklogs/user');
                setLogs(logResponse);
                // console.log(logResponse);

                // Load user names and group names
                const userIds = [...new Set(logResponse.map(log => log.user_uuid))];
                const groupIds = [...new Set(logResponse.map(log => log.group_uuid))];

                const userNamePromises = userIds.map(uuid => fetchUserName(uuid));
                const groupNamePromises = groupIds.map(id => fetchGroupNames(id));

                await Promise.all([...userNamePromises, ...groupNamePromises]);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        loadInitialData();
    }, []);

    const fetchUserName = async (uuid: string) => {
        try {
            const response = await axios.get(`/api/v1/sys/users/uuid/${uuid}`);
            setUserNames(prev => ({...prev, [uuid]: response.nickname}));
        } catch (error) {
            console.error('Error fetching user name:', error);
        }
    };

    const fetchGroupNames = async (id: string) => {
        try {
            const response = await axios.get(`/api/v1/sys/depts/${id}`);
            setGroupNames(prev => ({...prev, [id]: response.name}));
        } catch (error) {
            console.error('Error fetching group names:', error);
        }
    };

    const searchLogs = () => {
        const results = logs.filter(log => log.content && log.content.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchResults(results);
        setNoLogsMessage(results.length === 0);
    };

    const filteredLogs = () => {
        if (searchResults.length > 0) {
            return searchResults;
        }
        if (selectedGroup === "个人") {
            return logs.filter(log => log.user_uuid === currentuser?.uuid);
        }
        if (selectedGroup === "全部") {
            return logs;
        }
        return logs.filter(log => log.group_uuid === selectedGroup);
    };

    const columns = [
        {
            title: '姓名',
            dataIndex: 'nickname',
            render: (text: string, record: any) => userNames[record.user_uuid] || '未知',
            width: '5%',
        },
        {
            title: '时间',
            dataIndex: 'create_datetime',
            render: (text: string) => new Date(text).toLocaleString(),
        },
        {
            title: '工作部门',
            dataIndex: 'group_name',
            width: '7%',
            render: (text: string, record: any) => groupNames[record.group_uuid] || '未知',
        },
        {
            title: '工作日志',
            dataIndex: 'content',
            render: (text: string) => <div dangerouslySetInnerHTML={{__html: formatLogContent(text)}}/>,
        },
    ];

    const formatLogContent = (content: string) => {
        return content
            .replace("解决问题：", "<strong>解决问题：</strong>")
            .replace("解决方法：", "<br/><strong>解决方法：</strong>")
            .replace("解决效果：", "<br/><strong>解决效果：</strong>");
    };

    return (
        <div>
            <div className="container">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="请输入搜索内容"
                    onPressEnter={searchLogs}
                    style={{width: '80%', marginRight: '10px'}}
                />
                <Button onClick={searchLogs}>搜索</Button>
                <Select
                    value={selectedGroup}
                    onChange={setSelectedGroup}
                    style={{width: '100px', marginLeft: '10px'}}
                >
                    <Option value="个人">个人</Option>
                    {currentuser?.is_superuser && <Option value="全部">全部</Option>}
                    {Object.entries(groupNames).map(([id, name]) => (
                        <Option key={id} value={id}>{name}</Option>
                    ))}
                </Select>
                <div className="table-container">
                    <Table
                        columns={columns}
                        dataSource={filteredLogs()}
                        rowKey="uuid"
                        pagination={false}
                    />
                    {noLogsMessage && (
                        <Alert message="暂未找到工作日志" type="info" style={{marginTop: '20px'}}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkLogsShow;
