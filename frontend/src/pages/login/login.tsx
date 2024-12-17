import {useCallback, useState, useEffect, useRef} from "react";
import {Form, Input, Button, Checkbox, message, Row, Image} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useDispatchUser} from '../../hooks';
import './index.css'
import {EyeInvisibleOutlined, EyeOutlined, UserOutlined,LockOutlined,CheckCircleOutlined} from "@ant-design/icons";
import {LoginData} from "../../types/user.ts";

const IPT_RULE_USERNAME = [{required: true, message: "请输入用户名"}];
const IPT_RULE_PASSWORD = [{required: true, message: "请输入密码"}];
const IPT_RULE_CAPTCHA = [{required: true, message: "请输入验证码"}];

function LoginPage() {
    const [btnLoad, setBtnLoad] = useState(false);

    const navigate = useNavigate(); // 使用 useNavigate hook
    const captchaSrc = useSelector((state: RootState) => state.user.captcha);
    const {login, fetchUser, getCaptcha} = useDispatchUser();
    const hasFetchedCaptcha = useRef(false);
    const refreshCaptcha = useCallback(() => {
        getCaptcha();
    }, [getCaptcha]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    useEffect(() => {
        if (!hasFetchedCaptcha.current) {
            refreshCaptcha();
            hasFetchedCaptcha.current = true; // 仅请求一次
        }
    }, [refreshCaptcha]);

    const onFinish = useCallback((values: LoginData) => {
        setBtnLoad(true);
        login(values)
            .unwrap()
            .then(() => {
                fetchUser().unwrap().then(() => {
                    message.success('登录成功');
                    navigate('/playground');
                });
            })
            .catch((error) => {
                setBtnLoad(false);
                message.error(error.message || '登录失败，请重试');
            });
    }, [login, fetchUser, navigate]);

    return (
        <div className="login-container">
            <div className="wrapper">
                <div className="title">管理系统登录</div>
                <Form
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item name="username" rules={IPT_RULE_USERNAME}>
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="请输入账号"
                        />
                        {/*<Input placeholder="账号:admin/user"/>*/}
                    </Form.Item>
                    <Form.Item name="password" rules={IPT_RULE_PASSWORD}>
                        <Input
                            type={passwordVisible ? "text" : "password"}
                            autoComplete="off"
                            // placeholder="密码:admin123/user123"
                            placeholder="请输入密码"
                            prefix={<LockOutlined />}

                            suffix={
                                passwordVisible ?
                                    <EyeOutlined
                                        onClick={togglePasswordVisibility}
                                        style={{cursor: 'pointer', color: 'inherit'}}
                                    /> :
                                    <EyeInvisibleOutlined
                                        onClick={togglePasswordVisibility}
                                        style={{cursor: 'pointer', color: 'inherit'}}
                                    />
                            }
                        />
                    </Form.Item>
                    <Form.Item name="captcha" rules={IPT_RULE_CAPTCHA}>
                        <Row align="middle">
                            <Input prefix={<CheckCircleOutlined />} placeholder="请输入验证码" style={{width: '60%', flex: 1}}/>
                            <Image
                                src={captchaSrc}
                                preview={false}
                                alt="captcha"
                                onClick={refreshCaptcha}
                                style={{cursor: "pointer", height: "32px", width: "auto"}}
                            />
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>
                    </Form.Item>
                    <Row justify="space-around">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={btnLoad}
                        >
                            登录
                        </Button>
                        <Link to="/register">
                            <Button>注册</Button>
                        </Link>
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;
