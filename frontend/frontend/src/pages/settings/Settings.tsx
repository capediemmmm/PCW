// import React, { useState, useEffect } from 'react';
// import {
//     App,
//     Layout,
//     Menu,
//     Form,
//     Button,
//     Input,
//     Typography,
//     Modal,
//     Alert,
//     Avatar,
//     Skeleton,
//     notification,
// } from 'antd';
// import {
//     UserOutlined,
//     SettingOutlined,
//     LockOutlined,
//     DeleteOutlined,
//     ArrowLeftOutlined,
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
//
// const { Header, Content, Sider, Footer } = Layout;
// const { Title, Text } = Typography;
//
// const settingsMenuItems = [
//     {
//         label: '账户',
//         key: 'account',
//         icon: <SettingOutlined />,
//     },
//     {
//         label: '密码',
//         key: 'password',
//         icon: <LockOutlined />,
//     },
// ];
//
// interface AccountProps {
//     refreshUserInfo: () => void;
// }
//
// const Account: React.FC<AccountProps> = ({ refreshUserInfo }) => {
//     const navigate = useNavigate();
//     const [emailForm] = Form.useForm();
//     const [usernameForm] = Form.useForm();
//     const [deleteAccountForm] = Form.useForm();
//     const [deleteAccountModal, setDeleteAccountModal] = useState(false);
//     const { message, notification } = App.useApp();
//
//     const onEmailFinish = (values: { email: string }) => {
//         axios
//             .post(`${import.meta.env.VITE_API_URL}/api/user/changeEmail`, values, {
//                 withCredentials: true,
//             })
//             .then((response) => {
//                 if (response.data === 'success') {
//                     message.success('邮箱修改成功！');
//                     emailForm.resetFields();
//                     refreshUserInfo();
//                 } else {
//                     notification.error({
//                         message: '邮箱修改失败！',
//                         description: response.data,
//                     });
//                 }
//             })
//             .catch((error) => {
//                 console.error('请求失败:', error);
//                 if (error.response && error.response.status === 401) {
//                     notification.error({
//                         message: '请先登录！',
//                         description: '您尚未登录，请先登录！',
//                     });
//                     navigate('/');
//                 } else {
//                     notification.error({
//                         message: '邮箱修改失败！',
//                         description: error.message,
//                     });
//                 }
//             });
//     };
//
//     const onUsernameFinish = (values: { username: string }) => {
//         axios
//             .post(`${import.meta.env.VITE_API_URL}/api/user/changeUsername`, values, {
//                 withCredentials: true,
//             })
//             .then((response) => {
//                 if (response.data === 'success') {
//                     message.success('用户名修改成功！');
//                     usernameForm.resetFields();
//                     refreshUserInfo();
//                 } else {
//                     notification.error({
//                         message: '用户名修改失败！',
//                         description: response.data,
//                     });
//                 }
//             })
//             .catch((error) => {
//                 console.error('请求失败:', error);
//                 if (error.response && error.response.status === 401) {
//                     notification.error({
//                         message: '请先登录！',
//                         description: '您尚未登录，请先登录！',
//                     });
//                     navigate('/');
//                 } else {
//                     notification.error({
//                         message: '用户名修改失败！',
//                         description: error.message,
//                     });
//                 }
//             });
//     };
//
//     const onDeleteAccountFinish = (values: { password: string }) => {
//         axios
//             .post(`${import.meta.env.VITE_API_URL}/api/user/delete`, values, {
//                 withCredentials: true,
//             })
//             .then((response) => {
//                 if (response.data === 'success') {
//                     deleteAccountForm.resetFields();
//                     setDeleteAccountModal(false);
//                     message.success('账户删除成功！');
//                     navigate('/');
//                 } else {
//                     notification.error({
//                         message: '账户删除失败！',
//                         description: response.data,
//                     });
//                 }
//             })
//             .catch((error) => {
//                 console.error('请求失败:', error);
//                 if (error.response && error.response.status === 401) {
//                     notification.error({
//                         message: '请先登录！',
//                         description: '您尚未登录，请先登录！',
//                     });
//                     navigate('/');
//                 } else {
//                     notification.error({
//                         message: '账户删除失败！',
//                         description: error.message,
//                     });
//                 }
//             });
//     };
//
//     const deleteAccount = () => {
//         setDeleteAccountModal(true);
//     };
//
//     const validateEmail = async (_: any, value: string) => {
//         const emailPattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
//         if (!emailPattern.test(value)) {
//             if (value.length !== 0) {
//                 return Promise.reject('请输入有效的邮箱地址！');
//             }
//         } else {
//             try {
//                 const response = await fetch(
//                     `${import.meta.env.VITE_API_URL}/api/user/validateEmail?email=` + value
//                 );
//                 const data = await response.text();
//                 if (data === 'success') {
//                     return Promise.reject('该邮箱已被注册！');
//                 }
//             } catch (error) {
//                 return Promise.reject(error);
//             }
//         }
//         return Promise.resolve();
//     };
//
//     const validateUsername = async (_: any, value: string) => {
//         const usernamePattern = /^[a-zA-Z0-9_-]{4,16}$/;
//         if (!usernamePattern.test(value)) {
//             if (value.length !== 0) {
//                 return Promise.reject('用户名必须为4-16个字符！');
//             }
//         } else {
//             try {
//                 const response = await fetch(
//                     `${import.meta.env.VITE_API_URL}/api/user/validateUsername?username=` + value
//                 );
//                 const data = await response.text();
//                 if (data === 'success') {
//                     return Promise.reject('该用户名已被注册！');
//                 }
//             } catch (error) {
//                 return Promise.reject(error);
//             }
//         }
//         return Promise.resolve();
//     };
//
//     return (
//         <>
//             <Title
//                 level={3}
//                 style={{
//                     borderBottom: '1px solid #e8e8e8',
//                     paddingBottom: '0.5rem',
//                     marginTop: '1rem',
//                 }}
//             >
//                 修改邮箱
//             </Title>
//             <Form
//                 form={emailForm}
//                 initialValues={{ remember: true }}
//                 onFinish={onEmailFinish}
//                 scrollToFirstError
//                 layout='inline'
//                 style={{
//                     marginBottom: '3rem',
//                 }}
//             >
//                 <Form.Item
//                     name='email'
//                     label='新邮箱'
//                     validateTrigger='onBlur'
//                     rules={[
//                         { required: true, message: '请输入您的邮箱地址！' },
//                         { validator: validateEmail },
//                     ]}
//                     hasFeedback
//                 >
//                     <Input />
//                 </Form.Item>
//                 <Form.Item>
//                     <Button type='primary' htmlType='submit'>
//                         修改
//                     </Button>
//                 </Form.Item>
//             </Form>
//
//             <Title
//                 level={3}
//                 style={{
//                     borderBottom: '1px solid #e8e8e8',
//                     paddingBottom: '0.5rem',
//                 }}
//             >
//                 修改用户名
//             </Title>
//             <Form
//                 form={usernameForm}
//                 initialValues={{ remember: true }}
//                 onFinish={onUsernameFinish}
//                 scrollToFirstError
//                 layout='inline'
//                 style={{
//                     marginBottom: '3rem',
//                 }}
//             >
//                 <Form.Item
//                     name='username'
//                     label='新用户名'
//                     hasFeedback
//                     validateTrigger='onBlur'
//                     rules={[
//                         { required: true, message: '请输入您的用户名！' },
//                         { validator: validateUsername },
//                     ]}
//                 >
//                     <Input />
//                 </Form.Item>
//                 <Form.Item>
//                     <Button type='primary' htmlType='submit'>
//                         修改
//                     </Button>
//                 </Form.Item>
//             </Form>
//
//             <Title
//                 level={3}
//                 style={{
//                     borderBottom: '1px solid #e8e8e8',
//                     paddingBottom: '0.5rem',
//                 }}
//             >
//                 删除账户
//             </Title>
//             <Alert
//                 message='一旦您删除了账户，将无法恢复。请谨慎操作。'
//                 type='warning'
//                 showIcon
//                 style={{
//                     marginTop: '1rem',
//                     marginBottom: '1rem',
//                 }}
//             />
//             <Button
//                 type='primary'
//                 danger
//                 icon={<DeleteOutlined />}
//                 onClick={deleteAccount}
//             >
//                 删除账户
//             </Button>
//
//             <Modal
//                 title='删除账户'
//                 open={deleteAccountModal}
//                 footer={null}
//                 onCancel={() => setDeleteAccountModal(false)}
//             >
//                 <Text strong>您确定要删除您的账户吗？</Text>
//                 <Alert
//                     message='此操作无法撤销！'
//                     type='warning'
//                     description='您所有的数据将被永久删除！'
//                     showIcon
//                     style={{
//                         marginTop: '1rem',
//                         marginBottom: '1rem',
//                     }}
//                 />
//                 <Text style={{ fontWeight: 'bold' }}>请输入您的密码以确认：</Text>
//                 <Form
//                     form={deleteAccountForm}
//                     initialValues={{ remember: true }}
//                     onFinish={onDeleteAccountFinish}
//                     scrollToFirstError
//                     layout='vertical'
//                     style={{
//                         marginTop: '1rem',
//                     }}
//                 >
//                     <Form.Item
//                         name='password'
//                         rules={[
//                             { required: true, message: '请输入您的密码！' },
//                         ]}
//                         hasFeedback
//                     >
//                         <Input.Password
//                             type='password'
//                             minLength={6}
//                             placeholder='密码'
//                         />
//                     </Form.Item>
//                     <Form.Item>
//                         <Button
//                             type='primary'
//                             htmlType='submit'
//                             danger
//                             style={{
//                                 width: '100%',
//                             }}
//                         >
//                             <b>我确定要删除我的账户！</b>
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </>
//     );
// };
//
// const Password: React.FC = () => {
//     const navigate = useNavigate();
//     const [form] = Form.useForm();
//     const { message, notification } = App.useApp();
//     const [loadingChange, setLoadingChange] = useState(false);
//
//     const onFinish = (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
//         setLoadingChange(true);
//         axios
//             .post(`${import.meta.env.VITE_API_URL}/api/user/changePassword`, values, {
//                 withCredentials: true,
//             })
//             .then((response) => {
//                 if (response.data === 'success') {
//                     message.success('密码修改成功！');
//                     form.resetFields();
//                 } else {
//                     notification.error({
//                         message: '密码修改失败！',
//                         description: response.data,
//                     });
//                 }
//             })
//             .catch((error) => {
//                 console.error('请求失败:', error);
//                 if (error.response && error.response.status === 401) {
//                     notification.error({
//                         message: '请先登录！',
//                         description: '您尚未登录，请先登录！',
//                     });
//                     navigate('/');
//                 } else {
//                     notification.error({
//                         message: '密码修改失败！',
//                         description: error.message,
//                     });
//                 }
//             })
//             .finally(() => {
//                 setLoadingChange(false);
//             });
//     };
//
//     return (
//         <>
//             <Title
//                 level={3}
//                 style={{
//                     borderBottom: '1px solid #e8e8e8',
//                     paddingBottom: '0.5rem',
//                     marginTop: '1rem',
//                 }}
//             >
//                 修改密码
//             </Title>
//             <Form
//                 form={form}
//                 initialValues={{ remember: true }}
//                 onFinish={onFinish}
//                 scrollToFirstError
//                 layout='horizontal'
//                 style={{
//                     maxWidth: '400px',
//                 }}
//                 labelCol={{
//                     span: 8,
//                 }}
//                 wrapperCol={{
//                     span: 16,
//                 }}
//             >
//                 <Form.Item
//                     name='oldPassword'
//                     label='旧密码'
//                     rules={[
//                         { required: true, message: '请输入您的旧密码！' },
//                     ]}
//                     hasFeedback
//                 >
//                     <Input.Password
//                         type='password'
//                         minLength={6}
//                         placeholder='旧密码'
//                     />
//                 </Form.Item>
//                 <Form.Item
//                     name='newPassword'
//                     label='新密码'
//                     rules={[
//                         { required: true, message: '请输入您的新密码！' },
//                     ]}
//                     hasFeedback
//                 >
//                     <Input.Password
//                         type='password'
//                         minLength={6}
//                         placeholder='新密码'
//                     />
//                 </Form.Item>
//                 <Form.Item
//                     name='confirmPassword'
//                     label='确认密码'
//                     dependencies={['newPassword']}
//                     hasFeedback
//                     rules={[
//                         { required: true, message: '请确认您的新密码！' },
//                         ({ getFieldValue }) => ({
//                             validator(_, value) {
//                                 if (!value || getFieldValue('newPassword') === value) {
//                                     return Promise.resolve();
//                                 }
//                                 return Promise.reject(new Error('两次输入的密码不匹配！'));
//                             },
//                         }),
//                     ]}
//                 >
//                     <Input.Password
//                         type='password'
//                         minLength={6}
//                         placeholder='确认密码'
//                     />
//                 </Form.Item>
//                 <Form.Item style={{ textAlign: 'center' }}>
//                     <Button type='primary' htmlType='submit' loading={loadingChange}>
//                         修改
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </>
//     );
// };
//
// const SettingsPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [current, setCurrent] = useState('account');
//     const [username, setUsername] = useState('未知用户');
//     const [email, setEmail] = useState('未知邮箱');
//     const [loadingInfo, setLoadingInfo] = useState(false);
//     const { notification, message } = App.useApp();
//
//     const refreshUserInfo = () => {
//         setLoadingInfo(true);
//         axios
//             .get(`${import.meta.env.VITE_API_URL}/api/user/info`, {
//                 withCredentials: true,
//             })
//             .then((response) => {
//                 setUsername(response.data.username);
//                 setEmail(response.data.email);
//             })
//             .catch((error) => {
//                 console.error('请求失败:', error);
//                 if (error.response && error.response.status === 401) {
//                     notification.error({
//                         message: '请先登录！',
//                         description: '您尚未登录，请先登录！',
//                     });
//                     navigate('/');
//                 } else {
//                     notification.error({
//                         message: '获取用户信息失败！',
//                         description: error.message,
//                     });
//                 }
//             })
//             .finally(() => {
//                 setLoadingInfo(false);
//             });
//     };
//
//     useEffect(() => {
//         refreshUserInfo();
//     }, []);
//
//     const handleMenuClick = (e: any) => {
//         setCurrent(e.key);
//     };
//
//     const handleReturn = () => {
//         navigate('/index');
//     };
//
//     return (
//         <div className='settings-container' style={{ overflow: 'auto' }}>
//             <Layout style={{ minHeight: '100vh', flexDirection: 'column', overflow: 'auto', minWidth: '300px' }}>
//                 <Header
//                     style={{
//                         width: '100%',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                         background: '#001529',
//                         padding: '0 24px',
//                     }}
//                 >
//                     <div style={{display: 'flex', alignItems: 'center'}}>
//                         <Avatar size={40} icon={<UserOutlined/>}/>
//                         <div
//                             style={{
//                                 marginLeft: 10,
//                                 maxWidth: '300px', // 设置最大宽度，根据需求调整
//                                 whiteSpace: 'nowrap', // 禁止换行
//                                 overflow: 'hidden', // 隐藏溢出部分
//                                 textOverflow: 'ellipsis', // 使用省略号表示溢出部分
//                             }}
//                         >
//                             {!loadingInfo ? (
//                                 <Text
//                                     strong
//                                     style={{color: 'white', fontSize: '16px'}}
//                                     title={`${username} <${email}>`} // 悬停显示完整信息
//                                 >
//                                     {username} &lt;{email}&gt;
//                                 </Text>
//                             ) : (
//                                 <Skeleton.Input style={{width: 200}} active size='small'/>
//                             )}
//                         </div>
//                     </div>
//                     <ArrowLeftOutlined
//                         style={{fontSize: '24px', color: 'white', cursor: 'pointer'}}
//                         onClick={handleReturn}
//                     />
//                 </Header>
//                 <Layout>
//                     <Sider
//                         breakpoint='lg'
//                         collapsible={false}
//                         collapsedWidth='0'
//                         style={{background: '#fff', minWidth: '150px'}}
//                     >
//                         <Menu
//                             mode='inline'
//                             defaultSelectedKeys={['account']}
//                             selectedKeys={[current]}
//                             style={{ height: '100%', borderRight: 0 }}
//                             items={settingsMenuItems}
//                             onClick={handleMenuClick}
//                         />
//                     </Sider>
//                     <Layout style={{ padding: '24px' }}>
//                         <Content
//                             style={{
//                                 margin: 0,
//                                 minHeight: 280,
//                                 background: '#fff',
//                                 borderRadius: '8px',
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 alignItems: 'center',
//                                 width: '100%',
//                                 border: '1px solid #f0f0f0',
//                                 boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
//                                 padding: '16px',
//                                 boxSizing: 'border-box',
//                                 overflow: 'auto',
//                             }}
//                         >
//                             {current === 'account' ? <Account refreshUserInfo={refreshUserInfo} /> : <Password />}
//                         </Content>
//                     </Layout>
//                 </Layout>
//                 <Footer style={{ textAlign: 'center' }}>
//                     PCW ©{new Date().getFullYear()} Created by 星际飙车侠
//                 </Footer>
//             </Layout>
//         </div>
//     );
// };
//
// export default SettingsPage;

import React, { useState, useEffect } from 'react';
import {
    Layout,
    Menu,
    Form,
    Button,
    Input,
    Typography,
    Modal,
    Alert,
    Avatar,
    Skeleton,
    notification,
} from 'antd';
import {
    UserOutlined,
    SettingOutlined,
    LockOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Header, Content, Sider, Footer } = Layout;
const { Title, Text } = Typography;

const settingsMenuItems = [
    {
        label: '账户',
        key: 'account',
        icon: <SettingOutlined />,
    },
    {
        label: '密码',
        key: 'password',
        icon: <LockOutlined />,
    },
];

interface AccountProps {
    refreshUserInfo: () => void;
}

const Account: React.FC<AccountProps> = ({ refreshUserInfo }) => {
    const navigate = useNavigate();
    const [emailForm] = Form.useForm();
    const [usernameForm] = Form.useForm();
    const [deleteAccountForm] = Form.useForm();
    const [deleteAccountModal, setDeleteAccountModal] = useState(false);

    const onEmailFinish = async (values: { email: string }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/changeEmail`, values, {
                withCredentials: true,
            });
            if (response.data === 'success') {
                Modal.success({
                    title: '修改成功',
                    content: '邮箱修改成功！',
                    onOk: () => {
                        emailForm.resetFields();
                        refreshUserInfo();
                    },
                });
            } else {
                notification.error({
                    message: '修改失败',
                    description: response.data,
                });
            }
        } catch (error: any) {
            console.error('请求失败:', error);
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: '请先登录！',
                    description: '您尚未登录，请先登录！',
                });
                navigate('/');
            } else {
                notification.error({
                    message: '修改失败！',
                    description: error.message,
                });
            }
        }
    };

    const onUsernameFinish = async (values: { username: string }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/changeUsername`, values, {
                withCredentials: true,
            });
            if (response.data === 'success') {
                Modal.success({
                    title: '修改成功',
                    content: '用户名修改成功！',
                    onOk: () => {
                        usernameForm.resetFields();
                        refreshUserInfo();
                    },
                });
            } else {
                notification.error({
                    message: '修改失败',
                    description: response.data,
                });
            }
        } catch (error: any) {
            console.error('请求失败:', error);
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: '请先登录！',
                    description: '您尚未登录，请先登录！',
                });
                navigate('/');
            } else {
                notification.error({
                    message: '修改失败！',
                    description: error.message,
                });
            }
        }
    };

    const onDeleteAccountFinish = async (values: { password: string }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/delete`, values, {
                withCredentials: true,
            });
            if (response.data === 'success') {
                Modal.success({
                    title: '删除成功',
                    content: '账户删除成功！',
                    onOk: () => {
                        deleteAccountForm.resetFields();
                        setDeleteAccountModal(false);
                        navigate('/');
                    },
                });
            } else {
                notification.error({
                    message: '删除失败',
                    description: response.data,
                });
            }
        } catch (error: any) {
            console.error('请求失败:', error);
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: '请先登录！',
                    description: '您尚未登录，请先登录！',
                });
                navigate('/');
            } else {
                notification.error({
                    message: '删除失败！',
                    description: error.message,
                });
            }
        }
    };

    const deleteAccount = () => {
        setDeleteAccountModal(true);
    };

    const validateEmail = async (_: any, value: string) => {
        const emailPattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!emailPattern.test(value)) {
            if (value.length !== 0) {
                return Promise.reject('请输入有效的邮箱地址！');
            }
        } else {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/user/validateEmail?email=` + value
                );
                const data = await response.text();
                if (data === 'success') {
                    return Promise.reject('该邮箱已被注册！');
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.resolve();
    };

    const validateUsername = async (_: any, value: string) => {
        const usernamePattern = /^[a-zA-Z0-9_-]{4,16}$/;
        if (!usernamePattern.test(value)) {
            if (value.length !== 0) {
                return Promise.reject('用户名必须为4-16个字符！');
            }
        } else {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/user/validateUsername?username=` + value
                );
                const data = await response.text();
                if (data === 'success') {
                    return Promise.reject('该用户名已被注册！');
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.resolve();
    };

    return (
        <>
            <Title
                level={3}
                style={{
                    borderBottom: '1px solid #e8e8e8',
                    paddingBottom: '0.5rem',
                    marginTop: '1rem',
                }}
            >
                修改邮箱
            </Title>
            <Form
                form={emailForm}
                initialValues={{ remember: true }}
                onFinish={onEmailFinish}
                scrollToFirstError
                layout='inline'
                style={{
                    marginBottom: '3rem',
                }}
            >
                <Form.Item
                    name='email'
                    label='新邮箱'
                    validateTrigger='onBlur'
                    rules={[
                        { required: true, message: '请输入您的邮箱地址！' },
                        { validator: validateEmail },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        修改
                    </Button>
                </Form.Item>
            </Form>

            <Title
                level={3}
                style={{
                    borderBottom: '1px solid #e8e8e8',
                    paddingBottom: '0.5rem',
                }}
            >
                修改用户名
            </Title>
            <Form
                form={usernameForm}
                initialValues={{ remember: true }}
                onFinish={onUsernameFinish}
                scrollToFirstError
                layout='inline'
                style={{
                    marginBottom: '3rem',
                }}
            >
                <Form.Item
                    name='username'
                    label='新用户名'
                    hasFeedback
                    validateTrigger='onBlur'
                    rules={[
                        { required: true, message: '请输入您的用户名！' },
                        { validator: validateUsername },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        修改
                    </Button>
                </Form.Item>
            </Form>

            <Title
                level={3}
                style={{
                    borderBottom: '1px solid #e8e8e8',
                    paddingBottom: '0.5rem',
                }}
            >
                删除账户
            </Title>
            <Alert
                message='一旦您删除了账户，将无法恢复。请谨慎操作。'
                type='warning'
                showIcon
                style={{
                    marginTop: '1rem',
                    marginBottom: '1rem',
                }}
            />
            <Button
                type='primary'
                danger
                icon={<DeleteOutlined />}
                onClick={deleteAccount}
            >
                删除账户
            </Button>

            <Modal
                title='删除账户'
                open={deleteAccountModal}
                footer={null}
                onCancel={() => setDeleteAccountModal(false)}
            >
                <Text strong>您确定要删除您的账户吗？</Text>
                <Alert
                    message='此操作无法撤销！'
                    type='warning'
                    description='您所有的数据将被永久删除！'
                    showIcon
                    style={{
                        marginTop: '1rem',
                        marginBottom: '1rem',
                    }}
                />
                <Text style={{ fontWeight: 'bold' }}>请输入您的密码以确认：</Text>
                <Form
                    form={deleteAccountForm}
                    initialValues={{ remember: true }}
                    onFinish={onDeleteAccountFinish}
                    scrollToFirstError
                    layout='vertical'
                    style={{
                        marginTop: '1rem',
                    }}
                >
                    <Form.Item
                        name='password'
                        rules={[
                            { required: true, message: '请输入您的密码！' },
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            type='password'
                            minLength={6}
                            placeholder='密码'
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type='primary'
                            htmlType='submit'
                            danger
                            style={{
                                width: '100%',
                            }}
                        >
                            <b>我确定要删除我的账户！</b>
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

const Password: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loadingChange, setLoadingChange] = useState(false);

    const onFinish = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
        setLoadingChange(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/changePassword`, values, {
                withCredentials: true,
            });
            if (response.data === 'success') {
                Modal.success({
                    title: '修改成功',
                    content: '密码修改成功！',
                    onOk: () => {
                        form.resetFields();
                    },
                });
            } else {
                notification.error({
                    message: '修改失败',
                    description: response.data,
                });
            }
        } catch (error: any) {
            console.error('请求失败:', error);
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: '请先登录！',
                    description: '您尚未登录，请先登录！',
                });
                navigate('/');
            } else {
                notification.error({
                    message: '修改失败！',
                    description: error.message,
                });
            }
        } finally {
            setLoadingChange(false);
        }
    };

    return (
        <>
            <Title
                level={3}
                style={{
                    borderBottom: '1px solid #e8e8e8',
                    paddingBottom: '0.5rem',
                    marginTop: '1rem',
                }}
            >
                修改密码
            </Title>
            <Form
                form={form}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                scrollToFirstError
                layout='horizontal'
                style={{
                    maxWidth: '400px',
                }}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
            >
                <Form.Item
                    name='oldPassword'
                    label='旧密码'
                    rules={[
                        { required: true, message: '请输入您的旧密码！' },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        type='password'
                        minLength={6}
                        placeholder='旧密码'
                    />
                </Form.Item>
                <Form.Item
                    name='newPassword'
                    label='新密码'
                    rules={[
                        { required: true, message: '请输入您的新密码！' },
                        { min: 6, message: '密码必须至少6个字符！' },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        type='password'
                        minLength={6}
                        placeholder='新密码'
                    />
                </Form.Item>
                <Form.Item
                    name='confirmPassword'
                    label='确认密码'
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                        { required: true, message: '请确认您的新密码！' },
                        { min: 6, message: '密码必须至少6个字符！' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不匹配！'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        type='password'
                        minLength={6}
                        placeholder='确认密码'
                    />
                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type='primary' htmlType='submit' loading={loadingChange}>
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('account');
    const [username, setUsername] = useState('未知用户');
    const [email, setEmail] = useState('未知邮箱');
    const [loadingInfo, setLoadingInfo] = useState(false);

    const refreshUserInfo = async () => {
        setLoadingInfo(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/info`, {
                withCredentials: true,
            });
            setUsername(response.data.username);
            setEmail(response.data.email);
        } catch (error: any) {
            console.error('请求失败:', error);
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: '请先登录！',
                    description: '您尚未登录，请先登录！',
                });
                navigate('/');
            } else {
                notification.error({
                    message: '获取用户信息失败！',
                    description: error.message,
                });
            }
        } finally {
            setLoadingInfo(false);
        }
    };

    useEffect(() => {
        refreshUserInfo();
    }, []);

    const handleMenuClick = (e: any) => {
        setCurrent(e.key);
    };

    const handleReturn = () => {
        navigate('/index');
    };

    return (
        <div className='settings-container' style={{ overflow: 'auto' }}>
            <Layout style={{ minHeight: '100vh', flexDirection: 'column', overflow: 'auto', minWidth: '300px' }}>
                <Header
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#001529',
                        padding: '0 24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar size={40} icon={<UserOutlined />} />
                        <div
                            style={{
                                marginLeft: 10,
                                maxWidth: '300px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {!loadingInfo ? (
                                <Text
                                    strong
                                    style={{ color: 'white', fontSize: '16px' }}
                                    title={`${username} <${email}>`}
                                >
                                    {username} &lt;{email}&gt;
                                </Text>
                            ) : (
                                <Skeleton.Input style={{ width: 200 }} active size='small' />
                            )}
                        </div>
                    </div>
                    <ArrowLeftOutlined
                        style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }}
                        onClick={handleReturn}
                    />
                </Header>
                <Layout>
                    <Sider
                        breakpoint='lg'
                        collapsible={false}
                        collapsedWidth='0'
                        style={{ background: '#fff', minWidth: '150px' }}
                    >
                        <Menu
                            mode='inline'
                            defaultSelectedKeys={['account']}
                            selectedKeys={[current]}
                            style={{ height: '100%', borderRight: 0 }}
                            items={settingsMenuItems}
                            onClick={handleMenuClick}
                        />
                    </Sider>
                    <Layout style={{ padding: '24px' }}>
                        <Content
                            style={{
                                margin: 0,
                                minHeight: 280,
                                background: '#fff',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                                border: '1px solid #f0f0f0',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                                padding: '16px',
                                boxSizing: 'border-box',
                                overflow: 'auto',
                            }}
                        >
                            {current === 'account' ? <Account refreshUserInfo={refreshUserInfo} /> : <Password />}
                        </Content>
                    </Layout>
                </Layout>
                <Footer style={{ textAlign: 'center' }}>
                    PCW ©{new Date().getFullYear()} Created by 星际飙车侠
                </Footer>
            </Layout>
        </div>
    );
};

export default SettingsPage;