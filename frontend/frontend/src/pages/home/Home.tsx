import { useState, useEffect } from 'react'
import reactLogo from '../../assets/react.svg'
import './home.css'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, App, Form, Input, Checkbox, Spin } from 'antd';
import { NamePath } from 'antd/es/form/interface';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios'

interface RegisterProps {
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LoginProps {
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
    email?: string;
    username?: string;
    password?: string;
    password2?: string;
    remember?: boolean;
}

function Register({ setState, setLoading }: RegisterProps) {
    const navigate = useNavigate();
    const [form] = Form.useForm<FormValues>();
    const { message } = App.useApp();

    const onFinish = async (values: FormValues) => {
        console.log('Received values of form: ', values);
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, values, {
                withCredentials: true,
            });
            if (response.data === 'success') {
                message.success('Register successfully!');
                setState(false);
            } else {
                message.error('Register failed!');
            }
        } catch (error) {
            console.error('Request Fail:', error);
            message.error('Register failed!');
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = async (_: any, value: string) => {
        const emailPattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!emailPattern.test(value)) {
            if (value && value.length !== 0) {
                return Promise.reject(new Error('The input is not valid E-mail!'));
            }
        } else {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/validateEmail?email=${value}`, {
                    withCredentials: true,
                });
                if (response.data === 'success') {
                    return Promise.reject(new Error('This email is already registered!'));
                }
            } catch (error) {
                console.error(error);
            }
        }
        return Promise.resolve();
    };

    const validateUsername = async (_: any, value: string) => {
        const usernamePattern = /^[a-zA-Z0-9_-]{6,16}$/;
        const validChars = /^[a-zA-Z0-9_-]*$/;
        if (!usernamePattern.test(value)) {
            if (value.length !== 0) {
                if (!validChars.test(value)) {
                    return Promise.reject(new Error('Username can only contain letters, numbers, underscores and hyphens!'));
                } else {
                    return Promise.reject(new Error('Username must be 6-16 characters long!'));
                }
            }
        } else {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/validateUsername?username=${value}`, {
                    withCredentials: true,
                });
                if (response.data === 'success') {
                    return Promise.reject(new Error('This username is already registered!'));
                }
            } catch (error) {
                console.error(error);
            }
        }
        return Promise.resolve();
    };

    return (
        <Form
            name="normal_register"
            className="register-form"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            scrollToFirstError
        >
            <Form.Item
                name="email"
                validateDebounce={1000}
                rules={[
                    { required: true, message: 'Please input your E-mail!' },
                    { validator: validateEmail },
                ]}
                hasFeedback
            >
                <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="username"
                hasFeedback
                validateDebounce={1000}
                rules={[
                    { required: true, message: 'Please input your Username!' },
                    { validator: validateUsername },
                ]}
            >
                <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    { required: true, message: 'Please input your Password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' },
                ]}
                hasFeedback
            >
                <Input.Password type="password" placeholder="Password" minLength={6} />
            </Form.Item>
            <Form.Item
                name="password2"
                dependencies={['password'] as NamePath[]}
                rules={[
                    { required: true, message: 'Please input your Password again!' },
                    ({ getFieldValue }) => ({
                        validator(_: any, value: string) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match!'));
                        },
                    }),
                ]}
                hasFeedback
            >
                <Input.Password type="password" placeholder="Password again" minLength={6} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="register-form-button">
                    Register
                </Button>
                Or <Link onClick={() => setState(false)}>login now!</Link>
            </Form.Item>
        </Form>
    );
}

function Login({ setState, setLoading }: LoginProps) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { notification } = App.useApp();

    const onFinish = async (values: FormValues) => {
        console.log('Received values of form: ', values);
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, values, {
                withCredentials: true,
            });
            if (response.data === 'success') {
                navigate('/index');
                notification.success({
                    message: 'Login successfully!',
                    description: 'Welcome to IoT Platform!',
                });
            } else {
                notification.error({
                    message: 'Login failed!',
                    description: 'Please check your username and password.',
                });
            }
        } catch (error) {
            console.error('Request Fail:', error);
            notification.error({
                message: 'Login failed!',
                description: 'Please check your username and password.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            form={form}
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                {/*<Link*/}
                {/*    className="login-form-forgot"*/}
                {/*    onClick={() => {*/}
                {/*        App.useApp().modal.info({*/}
                {/*            title: 'Forgot password',*/}
                {/*            content: (*/}
                {/*                <div>*/}
                {/*                    <p>Please contact the administrator to reset your password.</p>*/}
                {/*                    <p>*/}
                {/*                        <a href="mailto:" target="_blank" rel="noopener noreferrer">*/}
                {/*                            Email*/}
                {/*                        </a>*/}
                {/*                    </p>*/}
                {/*                </div>*/}
                {/*            ),*/}
                {/*            onOk() {},*/}
                {/*        });*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Forgot password*/}
                {/*</Link>*/}
                {/*<a className="login-form-forgot" href="">*/}
                {/*    Forgot password*/}
                {/*</a>*/}

                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                Or <Link onClick={() => setState(true)}>register now!</Link>
            </Form.Item>
        </Form>
    );
}

function Home() {
    const navigate = useNavigate();
    const [state, setState] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    interface LRCardProps {
        state: boolean;
        setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    }

    function LRCard({ state, setLoading }: LRCardProps) {
        return state ? (
            <div className="card">
                <Register setState={setState} setLoading={setLoading} />
            </div>
        ) : (
            <div className="card">
                <Login setState={setState} setLoading={setLoading} />
            </div>
        );
    }

    const validateUser = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/api/user/info`, {
                withCredentials: true,
            });
            navigate('/index');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        validateUser();
    }, []);

    return (
        <div className={"home-container"}>
            <App className="login-register">
                <div>
                    <a href="https://react.dev" target="_blank">
                        <img src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                </div>
                <h1>Price Comparison</h1>
                <Spin spinning={loading}>
                    <Card hoverable className="login-card">
                        <LRCard state={state} setLoading={setLoading} />
                    </Card>
                </Spin>
                <p className="index-footer">星际飙车侠, Zhejiang University</p>
            </App>
        </div>
    );
}

export default Home;