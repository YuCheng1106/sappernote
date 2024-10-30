import {Layout, Avatar, Dropdown, Space, Button} from 'antd';
import {SettingOutlined, ShareAltOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd'


const {Header} = Layout;

const CustomHeader = () => {

    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (key === '1') {

        }
    };

    const items: MenuProps['items'] = [
        {
            label: '退出登录',
            key: '1',
        },
    ];

    return (
        <Header style={{
            background: '#fff',
            marginLeft: "5px",
            padding: '2px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>

            {/* 左侧：Logo 和系统名称 */}
            <div style={{display: 'flex', alignItems: 'center'}}>
                <h2 style={{margin: 0}}>自我神格</h2>
            </div>

            {/* 右侧：搜索框、快捷按钮 */}
            <Space size="middle">
                {/* 搜索框 */}
                <Button icon={<SettingOutlined/>}>设置</Button>
                <Button icon={<ShareAltOutlined />}>分享</Button>

                {/* 头像 */}
                <Dropdown menu={{items, onClick, style:{ marginTop: '10px' ,right:'-15px'}} }>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Avatar
                                src="https://sapper3701-1316534880.cos.ap-nanjing.myqcloud.com/44330c73-c348-4cb8-b740-f5d1d32af983/f4944bc0-1008-4ad7-8fe8-6a96ca57a12a.png" // 替换为用户头像地址
                                alt="用户头像"
                                size="default"
                                style={{cursor: 'pointer',marginBottom: '8px'}}
                            />
                        </Space>
                    </a>
                </Dropdown>
            </Space>
        </Header>
    );
};

export default CustomHeader;
