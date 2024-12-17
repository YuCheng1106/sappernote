import {useCallback, useState, useEffect, useRef} from "react";
import {Form, Input, Button, message, Row, Image} from "antd";
import {Rule} from 'antd/es/form'; // 引入 Rule 类型
import {Link, useNavigate} from "react-router-dom";
import {getCaptcha, RegisterRes} from '../../api/auth.ts';
import {useDispatch} from 'react-redux';
import {register as registerThunk} from "../../service/userService.ts";
import './index.css';
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    SmileOutlined,
    UserOutlined,
    MailOutlined,
    CheckCircleOutlined,
    LockOutlined
} from '@ant-design/icons';

const IPT_RULE_NICKNAME = [{required: true, message: "请输入昵称"}];
const IPT_RULE_USERNAME: Rule[] = [
    {required: true, message: "请输入用户名"},
    {min: 8, message: "用户名至少为 8 位"},
    {
        pattern: /^[a-zA-Z0-9!@#$%^&*()_+=[\]{};':"\\|,.<>?`~]*$/,
        message: "用户名只能包含字母、数字和常见符号",
    },
    {
        validator: async (_, value) => {
            if (value) {
                const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
                if (letterCount < 5) {
                    return Promise.reject(new Error("用户名必须包含至少 5 个字母"));
                }
            }
            return Promise.resolve();
        },
    },
];
const IPT_RULE_PASSWORD: Rule[] = [
    {required: true, message: "请输入密码"},
    {min: 8, message: "密码至少为 8 位"},
    {
        pattern: /(?=.*[a-z])(?=.*\d)/,
        message: "密码必须包含至少一个小写字母和一个数字",
    },
    {
        max: 20,
        message: "密码不能超过 20 位",
    },
];
const IPT_RULE_EMAIL: Rule[] = [
    {required: true, message: "请输入有效的电子邮箱"},
    {type: 'email', message: "请输入有效的邮箱格式"},
];
const IPT_RULE_CAPTCHA = [{required: true, message: "请输入验证码"}];

function RegisterPage() {
    const [form] = Form.useForm();
    const [captchaSrc, setCaptchaSrc] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hasFetchedCaptcha = useRef(false); // 使用 useRef 控制请求次数

    const refreshCaptcha = useCallback(async () => {
        try {
            const captcha = await getCaptcha();
            setCaptchaSrc(`data:image/png;base64, ${captcha.image}`);
        } catch (err) {
            message.error("验证码获取失败");
        }
    }, []);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // 添加确认密码可见性状态

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    useEffect(() => {
        if (!hasFetchedCaptcha.current) {
            refreshCaptcha();
            hasFetchedCaptcha.current = true; // 仅请求一次
        }
    }, [refreshCaptcha]);


    const validateConfirmPassword = (_: { required?: boolean }, value: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const password = form.getFieldValue('password');
            if (value && value !== password) {
                reject("两次输入的密码不一致");
            } else {
                resolve();
            }
        });
    };

    const onFinish = useCallback(async (values: any) => {
        console.log(values);
        const resultAction = await dispatch(registerThunk(values)) as { payload: RegisterRes, error?: any };

        if (registerThunk.fulfilled.match(resultAction)) {
            const {data} = resultAction.payload; // 确保从 payload 中提取 msg
            message.success(data || "注册成功", 3);
            navigate('/login'); // 添加这一行以使用 navigate
        } else {
            // message.error('注册请求错误，请重试');
        }

    }, [dispatch, navigate]);


    return (
        <div className="login-container">
            <div className="wrapper">
                <div className="title">管理系统注册</div>

                <Form form={form} className="login-form" onFinish={onFinish}>
                    <Row justify="start">
                        <Link to={"/login"}>&lt;<span> </span>已有账号，去登录</Link>
                    </Row>
                    <br/>

                    <Form.Item name="nickname" rules={IPT_RULE_NICKNAME}>
                        <Input prefix={<SmileOutlined/>} placeholder="昵称"/>
                    </Form.Item>

                    <Form.Item name="username" rules={IPT_RULE_USERNAME}>
                        <Input prefix={<UserOutlined/>} autoComplete="off" placeholder="账号"/>
                    </Form.Item>

                    <Form.Item name="email" rules={IPT_RULE_EMAIL}>
                        <Input prefix={<MailOutlined/>} placeholder="电子邮箱"/>
                    </Form.Item>

                    <Form.Item name="password" rules={IPT_RULE_PASSWORD}>
                        <Input
                            type={passwordVisible ? "text" : "password"}
                            autoComplete="off"
                            prefix={<LockOutlined/>}
                            placeholder="密码"
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

                    <Form.Item
                        name="confirm"
                        rules={[
                            {required: true, message: "请确认密码"},
                            {validator: validateConfirmPassword}
                        ]}
                    >
                        <Input
                            type={confirmPasswordVisible ? "text" : "password"}
                            autoComplete="off"
                            placeholder="确认密码"
                            prefix={<LockOutlined/>}
                            suffix={
                                confirmPasswordVisible ?
                                    <EyeOutlined
                                        onClick={toggleConfirmPasswordVisibility}
                                        style={{cursor: 'pointer', color: 'inherit'}}
                                    /> :
                                    <EyeInvisibleOutlined
                                        onClick={toggleConfirmPasswordVisibility}
                                        style={{cursor: 'pointer', color: 'inherit'}}
                                    />
                            }
                        />
                    </Form.Item>

                    <Form.Item name="captcha" rules={IPT_RULE_CAPTCHA}>
                        <Row align="middle">
                            <Input prefix={<CheckCircleOutlined/>} placeholder="请输入验证码"
                                   style={{width: '60%', flex: 1}}/>
                            <Image
                                src={captchaSrc}
                                preview={false}
                                alt="captcha"
                                onClick={refreshCaptcha}
                                style={{cursor: "pointer", height: "32px", width: "auto"}}
                            />
                        </Row>
                    </Form.Item>

                    <Row justify="space-around">
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            注册
                        </Button>
                        <Button htmlType="reset">重置</Button>
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default RegisterPage;
