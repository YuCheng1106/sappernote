import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";


const Theme: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate(); // 使用 react-router-dom 的 useNavigate 进行页面跳转

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 阻止默认表单提交行为
        try {
            navigate(`/worklog/result?q=${encodeURIComponent(searchQuery)}`);
        } catch (error) {
            console.error('搜索失败:', error);
            alert('搜索失败，请稍后再试。');
        }
    };


    return (
        <div>
            <h1 style={{
                textAlign: 'center',
                fontSize: '50px',
                margin: '20px 0',
                color: '#1890ff',

            }}>技术寻人</h1>
            <form id="searchForm" onSubmit={handleSearch}>
                <input
                    type="text"
                    name="q"
                    placeholder="搜索日志..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // 使用 onChange 处理输入
                    style={{
                        fontSize: '14.1px',
                        width: '80%',
                        padding: '10px',
                        borderRadius: '20px',
                        border: '1px solid #ccc',
                        marginRight: '10px'

                    }}
                />
                <input
                    type="submit"
                    id="searchButton"
                    value="搜索"
                    style={{
                        fontSize: '14.1px',
                        padding: '10px',
                        borderRadius: '20px',
                        border: '1px solid #ccc',
                        backgroundColor: '#1890ff',
                        color: 'white'
                    }}
                />
            </form>
        </div>
    );
};

export default Theme;
