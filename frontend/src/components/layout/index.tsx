import { Layout, Menu, Breadcrumb, Image} from 'antd';
import { Outlet, Link } from 'react-router-dom';
import {FileSearchOutlined, HomeOutlined, UserOutlined} from '@ant-design/icons';

import logoImage from '../../assets/images/favicon.ico';

const { Content, Footer, Sider, Header} = Layout;
const { SubMenu } = Menu;



const LayoutContainer = () => {


    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: 'white' }}>
            <Sider collapsible theme="light">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px' }}>
                    <Image src={logoImage} preview={false} width="65px" />
                </div>
                <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
                    {/* 动态渲染菜单 */}
                    <Menu.Item icon={<HomeOutlined />} key="0">
                        <Link to="/">主页</Link>
                    </Menu.Item>
                    <Menu.Item icon={<UserOutlined />} key="1">
                        <Link to="/personal">个人中心</Link>
                    </Menu.Item>

                    <SubMenu key="sub2" icon={<FileSearchOutlined />} title="日志管理">
                        <Menu.Item key="5">
                            <Link to="/worklog/search">搜索日志</Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to="/worklog/show">查看日志</Link>
                        </Menu.Item>
                        <Menu.Item key="7">
                            <Link to="/worklog/add">添加日志</Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>

            <Layout>
                <Header />
                <Content style={{ margin: '16px 10px 16px 5px' }}>
                    <Breadcrumb style={{ margin: '5px 0' }}>
                        <Breadcrumb.Item>
                            <Link to="/">主页</Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ padding: 12, background: '#fff', minHeight: 'calc(100vh - 160px)'}}>
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center', padding: '5px' }}>
                    Teach 4 Tech ©2024 Created by jxselab
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutContainer;
