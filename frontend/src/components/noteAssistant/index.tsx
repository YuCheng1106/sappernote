import { Button, Card, List, Row, Col } from 'antd';
import { BookOutlined, QuestionCircleOutlined, ClockCircleOutlined, FolderOutlined, FileTextOutlined } from '@ant-design/icons';

const NoteAssistant = () => {

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', height: '100%', overflow: 'auto'}}>
            <h2 style={{ fontWeight: 'bold', color: '#2d8cf0' }}>✶ 笔记本指南</h2>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Button icon={<QuestionCircleOutlined />} size="large">常见问题解答</Button>
                <Button icon={<BookOutlined />} size="large">学习指南</Button>
                <Button icon={<FolderOutlined />} size="large">目录</Button>
                <Button icon={<ClockCircleOutlined />} size="large">时间轴</Button>
                <Button icon={<FileTextOutlined />} size="large">简报文档</Button>
            </div>

            {/* Layout with Left and Right Sections */}
            <Row gutter={20}>
                {/* Left Section - Summary */}
                <Col xs={24} md={14}>
                    <Card title="摘要" bordered={false} style={{ marginBottom: '20px' }}>
                        <p>
                            这四个来源分别探讨了多路径TCP技术在不同场景下的应用和安全性问题。第一个来源介绍了FastAPI框架的项目结构和最佳实践，以及如何运行后端应用程序；
                            第二个来源提出了一种接收缓动的动态可靠多路径传输解决方案（recPR-MPTCP），来支持实时视频和多媒体传输。该方案通过接收端缓冲的扩展和基于单向回送的带宽回采方法，
                            提高了MPTCP的性能和服务质量；第三个来源研究了MPTCP在网络信息不完整的情况下，对网络攻击的鲁棒性，并通过混合攻击策略评估了MPTCP的鲁棒性特性。
                            第四个来源介绍了将抗癌和抗感染药物载于合成脂质体中，用于治疗肿瘤的应用。
                        </p>
                    </Card>
                </Col>

                {/* Right Section - Suggested Questions */}
                <Col xs={24} md={10}>
                    <Card title="建议的问题" bordered={false}>
                        <List
                            dataSource={[
                                "这三篇论文主要研究了什么问题？",
                                "这三篇论文使用的方法有什么共通点？",
                                "这三篇论文的研究成果可以应用于哪些领域？"
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <Button type="link" style={{ textAlign: 'left', padding: 0 }}>{item}</Button>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default NoteAssistant;
