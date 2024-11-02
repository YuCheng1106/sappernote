import { Button, List, Space } from 'antd';
import { LikeOutlined, DislikeOutlined, CommentOutlined, SaveOutlined } from '@ant-design/icons';

const Conservation = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f6f7', height: '100%', overflow: 'auto'}}>
            <List
                itemLayout="vertical"
                dataSource={[
                    {
                        role: 'user',
                        content: `在 FastAPI 项目中使用 Docker 有以下优势：
                        ● 提供一致的环境、减少依赖问题。
                        ● 提高软件兼容性与稳定性。
                        ● 增强安全性、隔离部署环境。
                        ● 更容易测试与更新。
                        ● 社区支持广泛等。`,
                    },
                    {
                        role: 'assistant',
                        content: `使用 Docker 可以帮助开发者在不同的环境下获得一致的运行效果，同时减少软件依赖与部署的问题，提高整体的开发效率。`
                    },
                    {
                        role: 'user',
                        content: `使用 Docker 可以帮助开发者在不同的环境下获得一致的运行效果，同时减少软件依赖与部署的问题，提高整体的开发效率。`
                    },
                    {
                        role: 'assistant',
                        content: `使用。`
                    },
                    {
                        role: 'user',
                        content: `使用 Docker 可以帮助开发者在不同的环境下获得一致的运行效果，同时减少软件依赖与部署的问题，提高整体的开发效率。`
                    },
                    {
                        role: 'assistant',
                        content: `使用。`
                    }
                ]}
                renderItem={(item) => (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: item.role !== 'assistant' ? 'flex-end' : 'flex-start',
                            marginBottom: '15px'
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '80%',
                                backgroundColor: item.role !== 'assistant' ? '#ffffff' : '#e6f7ff',
                                borderRadius: item.role !== 'assistant' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                textAlign: "left",
                                padding: '10px 10px',
                            }}
                        >
                            <p style={{ marginBottom: '10px' }}>{item.content}</p>
                            {item.role === 'assistant' && <Space size="small">
                                <Button type="text" icon={<LikeOutlined />} />
                                <Button type="text" icon={<DislikeOutlined />} />
                                <Button type="text" icon={<CommentOutlined />} />
                                <Button type="text" icon={<SaveOutlined />}>保存到笔记</Button>
                            </Space>}
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default Conservation;
