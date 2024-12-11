import React, {useState, useEffect, useRef} from 'react';
import "./mainpage.css";
import { PoweroffOutlined, LineChartOutlined, ClockCircleOutlined, CloseOutlined  } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Input, Modal, Card, Row, Col, Pagination, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import reactLogo from "../../assets/react.svg";
import taobaoLogo from '../../assets/taobao.svg';
import jdLogo from '../../assets/jingdong.svg';
import tmallLogo from '../../assets/tmall.svg';
import pddLogo from '../../assets/pdd.svg';   // 拼多多
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const items1: MenuProps['items'] = ['搜索', '商品库'].map((key) => ({
    key,
    label: `${key}`,
}));
const items2: MenuProps['items'] = [
    {
        key: 'pdd',
        icon: <img src={pddLogo} alt="Taobao" style={{ width: '36px', height: '36px' }} />,
        label: '拼多多',
        style: { marginTop: '16px', marginBottom: '16px' },
    },
    {
        key: 'jd',
        icon: <img src={jdLogo} alt="JD" style={{ width: '36px', height: '36px' }} />,
        label: '京东',
        style: { marginBottom: '16px' },
    },
    {
        key: 'tmall',
        icon: <img src={tmallLogo} alt="Tmall" style={{ width: '36px', height: '36px' }} />,
        label: '天猫',
    },
];

interface PriceHistory {
    date: string;
    price: number;
}

const MainPage: React.FC = () => {
    const [selectedMenu, setSelectedMenu] = useState<string>('搜索');
    const [selectedSite, setSelectedSite] = useState<string>('pdd'); // 当前选中的网站
    const [searchKeyword, setSearchKeyword] = useState<string>(''); // 搜索关键词
    const [productList, setProductList] = useState<any[]>([]); // 搜索商品列表
    const [dbproductList, setDbProductList] = useState<any[]>([]); // 数据库商品列表
    const [loading, setLoading] = useState<boolean>(false); // 加载状态
    const [currentPage, setCurrentPage] = useState<number>(1); // 当前页码
    const itemsPerPage = 8; // 每页显示的商品数量
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = productList.slice(indexOfFirstItem, indexOfLastItem);
    const currentDbProducts = dbproductList.slice(indexOfFirstItem, indexOfLastItem);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 控制 Modal 显示
    const [selectedProduct, setSelectedProduct] = useState<any>(null); // 选中的商品
    const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]); // 历史价格数据
    const [historyLoading, setHistoryLoading] = useState<boolean>(false); // 历史价格加载状态
    const [priceWatchList, setPriceWatchList] = useState<Set<string>>(new Set()); // 降价提醒列表
    const previousPrices = useRef<{ [key: string]: number }>({}); // 记录之前的价格
    // const [loginStatus, setLoginStatus] = useState<{ [key: string]: boolean }>({
    //     taobao: false,
    //     jd: false,
    //     tmall: false,
    // }); // 登录状态
    // const [qrCode, setQrCode] = useState<string>(''); // 二维码图片url
    // const [sessionId, setSessionId] = useState<string>(''); // 后端会话ID
    const maxPage = 1;
    // const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 控制 Modal 显示

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setSelectedMenu(e.key);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 滚动到顶部
    };

    const onSearch = async (value: string) => {
        console.log('Search:', value);
        setSearchKeyword(value);
        // if (!loginStatus[selectedSite]) {
        //     // 未登录状态，弹出登录二维码
        //     await loginSite(selectedSite);
        // }
    };

    const onDatabaseSearch = async (value: string) => {
        console.log('Database Search:', value);
        setSearchKeyword(value);
    }

    // const loginSite = async (site: string) => {
    //     try {
    //         // 请求后端获取二维码
    //         const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/goods/login`, {
    //             params: {
    //                 site,
    //             },
    //             withCredentials: true,
    //         });
    //
    //         const { sessionid, url } = response.data;
    //         setSessionId(sessionid);
    //         console.log('sessionId:', sessionid);
    //
    //         setQrCode(url);
    //         setIsModalVisible(true);
    //
    //     } catch (error) {
    //         console.error('获取二维码失败:', error);
    //         Modal.error({
    //             title: '获取二维码失败',
    //             content: '请稍后重试。',
    //         });
    //     }
    // };

    // const checkLoginStatus = async (sessionId: string, site: string) => {
    //     try {
    //         const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/goods/checkLogin`, {
    //             params: {
    //                 sessionId,
    //                 site,
    //             },
    //             withCredentials: true,
    //         });
    //         if (response.data === '登录成功') {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } catch (error) {
    //         console.error('检查登录状态失败:', error);
    //         return false;
    //     }
    // };

    const handleSiteChange = (e: any) => {
        setSelectedSite(e.key);
        setCurrentPage(1);
    };

    const handleLogout = () => {
        Modal.confirm({
            title: '确认要退出登录吗？',
            okText: '是',
            cancelText: '否',
            onOk() {
                navigate('/'); // 返回首页
            },
        });
    };

    // useEffect(() => {
    //     if (isModalVisible && sessionId) {
    //         let isMounted = true;
    //         let attempts = 0;
    //         const maxAttempts = 10; // 最大尝试次数
    //         const interval = setInterval(async () => {
    //             if (!isMounted) {
    //                 clearInterval(interval);
    //                 return;
    //             }
    //             attempts += 1;
    //             console.log(`Polling attempt ${attempts}`);
    //             const loginResult = await checkLoginStatus(sessionId, selectedSite);
    //             if (loginResult) {
    //                 if (isMounted) {
    //                     const updatedStatus = { ...loginStatus, [selectedSite]: true };
    //                     setLoginStatus(updatedStatus);
    //                     setIsModalVisible(false);
    //                     fetchProducts(searchKeyword, selectedSite);
    //                     Modal.success({
    //                         title: '登录成功',
    //                         content: '您已成功登录。',
    //                     });
    //                 }
    //                 clearInterval(interval);
    //             } else if (attempts >= maxAttempts) {
    //                 if (isMounted) {
    //                     setIsModalVisible(false);
    //                     Modal.error({
    //                         title: '登录超时',
    //                         content: '登录未能完成，请重试。',
    //                     });
    //                 }
    //                 clearInterval(interval);
    //             }
    //         }, 3000); // 每3秒轮询一次
    //
    //         return () => {
    //             isMounted = false;
    //             clearInterval(interval);
    //         };
    //     }
    // }, [isModalVisible, sessionId, selectedSite, searchKeyword, loginStatus]);
    //
    // const handleCheckLoginStatus = async () => {
    //     const loginResult = await checkLoginStatus(sessionId, selectedSite);
    //     if (loginResult) {
    //         const updatedStatus = { ...loginStatus, [selectedSite]: true };
    //         setLoginStatus(updatedStatus);
    //         setIsModalVisible(false);
    //         fetchProducts(searchKeyword, selectedSite);
    //         Modal.success({
    //             title: '登录成功',
    //             content: '您已成功登录。',
    //         });
    //     } else {
    //         Modal.error({
    //             title: '登录失败',
    //             content: '请重试。',
    //         });
    //     }
    // };

    useEffect(() => {
        if (searchKeyword) {
            if (selectedMenu === '搜索') {
                fetchProducts(searchKeyword, selectedSite);
            } else if (selectedMenu === '商品库') {
                console.log('搜索商品库');
                fetchDatabaseProducts(searchKeyword);
            }
        }
    }, [searchKeyword, selectedSite, selectedMenu]);

    const fetchDatabaseProducts = async (keyword: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/goods/database-search`, {
                params: {
                    keyword,
                },
                withCredentials: true,
            });
            setDbProductList(response.data);
            console.log('数据库搜索成功');
            console.log(dbproductList);
            console.log(currentDbProducts);
        } catch (error: any) {
            console.error('数据库搜索失败:', error);
            console.error('搜索失败，请稍后重试');
        } finally {
            setLoading(false);
            // 将searchKeyword置空
            setSearchKeyword('');
        }
    };

    const fetchProducts = async (keyword: string, site: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/goods/search`, {
                 params: {
                    keyword,
                    site,
                    maxPage,
                },
                withCredentials: true,
            });
            setProductList(response.data); // 假设后端返回的数据格式为 { products: [...] }
            console.log('搜索成功');
            checkPriceDrops(response.data); // 调用检查降价
        } catch (error: any) {
            console.error('搜索失败:', error);
            console.error('搜索失败，请稍后重试');
        } finally {
            setLoading(false);
            // 将searchKeyword置空
            setSearchKeyword('');
        }
    };

    // 检查降价并发送邮件
    const checkPriceDrops = async (products: any[]) => {
        for (const product of products) {
            if (priceWatchList.has(product.goodsId)) {
                const previousPrice = previousPrices.current[product.goodsId];
                if (previousPrice && product.goodsPrice < previousPrice) {
                    try {
                        const emailResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/getEmail`, {
                            withCredentials: true,
                        });
                        const userEmail = emailResponse.data;
                        await axios.post(`${import.meta.env.VITE_API_URL}/api/user/sendPriceDropEmail`, {
                            email: userEmail,
                            productName: product.goodsName,
                        }, {
                            withCredentials: true,
                        });
                        Modal.success({
                            title: '降价提醒',
                            content: `已向 ${userEmail} 发送 ${product.goodsName} 降价通知邮件。`,
                        });
                    } catch (error) {
                        console.error('发送降价邮件失败:', error);
                    }
                }
                // 更新之前的价格
                previousPrices.current[product.goodsId] = product.goodsPrice;
            }
        }
    };

    // 处理降价提醒按钮点击
    const handlePriceWatchClick = (e: React.MouseEvent<HTMLElement>, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        const updatedWatchList = new Set(priceWatchList);
        if (priceWatchList.has(product.goodsId)) {
            updatedWatchList.delete(product.goodsId);
        } else {
            updatedWatchList.add(product.goodsId);
            // 记录当前价格
            previousPrices.current[product.goodsId] = product.goodsPrice;
        }
        setPriceWatchList(updatedWatchList);
    };

    // 处理历史价格按钮点击
    const handleHistoryClick = async (e: React.MouseEvent<HTMLElement>, product: any) => {
        e.preventDefault(); // 阻止默认行为
        e.stopPropagation();
        setSelectedProduct(product);
        setIsModalVisible(true);
        setHistoryLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/goods/history`, {
                params: {
                    goodsId: product.goodsId,
                },
                withCredentials: true,
            });
            // 假设后端返回的数据格式为 [{ date: '2024-04-25', price: 999.99 }, ...]
            setPriceHistory(response.data);
            console.log('历史价格数据:', response.data);
        } catch (error: any) {
            console.error('获取历史价格失败:', error);
            Modal.error({
                title: '获取历史价格失败',
                content: '请稍后重试。',
            });
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
        setPriceHistory([]);
    };

    return (
        <div className={"mainpage-container"} style={{ overflow: 'auto'}}>
            {/*<div className={"mainpage_inner"}>*/}
                <Layout style={{ minHeight: '100vh', flexDirection: 'column', overflow: 'auto', minWidth: "1280px" }}>
                    <Header style={{ display: 'flex', alignItems: 'center' }}>
                        <a href="https://react.dev" target="_blank">
                            <img src={reactLogo} className="logo react" alt="React logo"/>
                        </a>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['搜索']}
                            selectedKeys={[selectedMenu]}
                            onClick={handleMenuClick}
                            items={items1}
                            style={{ flex: 1, minWidth: 0 }}
                        />
                        <PoweroffOutlined
                            onClick={handleLogout}
                            style={{ fontSize: '24px', color: 'white', marginLeft: 'auto', cursor: 'pointer' }}
                        />
                    </Header>
                    {selectedMenu == '搜索' && (
                        <Layout>
                            <Sider width={200} style={{ background: colorBgContainer }}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['pdd']}
                                    style={{ height: '100%', borderRight: 0 }}
                                    items={items2}
                                    onClick={handleSiteChange}
                                />
                            </Sider>
                            <Layout style={{ padding: '0 24px 24px' }}>
                                <Search
                                    placeholder="输入搜索内容"
                                    enterButton="搜索"
                                    size="large"
                                    onSearch={onSearch}
                                    loading={loading} // 根据需要设置 loading 状态
                                    style={{ marginBottom: '24px', marginTop: '24px' }}
                                />
                                <Content
                                    style={{
                                        padding: 24,
                                        margin: 0,
                                        minHeight: 280,
                                        background: colorBgContainer,
                                        borderRadius: borderRadiusLG,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        width: '100%',
                                        border: '1px solid #f0f0f0',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                                        padding: '16px',
                                        boxSizing: 'border-box',
                                        background: 'white',
                                        borderRadius: '8px',
                                        overflow: 'auto',
                                    }}
                                >
                                    <Row gutter={[16, 16]} style={{flex: 1, width: '100%', margin: 0}}>
                                        {currentProducts.map((product, index) => (
                                            <Col key={index} xs={24} sm={12} md={6} lg={6} xl={4}>
                                                <a href={product.goodsUrl} referrer="no-referrer|origin|unsafe-url" target="_blank" rel="noopener noreferrer"
                                                   style={{textDecoration: 'none'}}>
                                                    <Card
                                                        hoverable
                                                        cover={
                                                            <img
                                                                alt={product.goodsName}
                                                                src={product.goodsImgUrl}
                                                                style={{height: '200px', objectFit: 'cover'}}
                                                                referrerPolicy="no-referrer"
                                                            />
                                                        }
                                                        style={{width: '100%'}}
                                                    >
                                                        <Card.Meta
                                                            title={product.goodsName}
                                                            description={<span style={{
                                                                color: '#1890ff',
                                                                fontWeight: 'bold'
                                                            }}>{product.goodsPrice}</span>}
                                                        />
                                                    </Card>
                                                </a>
                                            </Col>
                                        ))}
                                    </Row>
                                    <div style={{textAlign: 'center', marginTop: '24px'}}>
                                        <Pagination
                                            current={currentPage}
                                            pageSize={itemsPerPage}
                                            total={productList.length}
                                            onChange={handlePageChange}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                </Content>
                            </Layout>
                        </Layout>
                    )}
                    {selectedMenu == '商品库' && (
                        <Layout>
                            <Layout style={{ padding: '0 24px 24px' }}>
                                <Search
                                    placeholder="输入商品名称"
                                    enterButton="搜索"
                                    size="large"
                                    onSearch={onDatabaseSearch}
                                    loading={loading}
                                    style={{ marginBottom: '24px', marginTop: '24px' }}
                                />
                                <Content
                                    style={{
                                        padding: 24,
                                        margin: 0,
                                        minHeight: 280,
                                        background: colorBgContainer,
                                        borderRadius: borderRadiusLG,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        width: '100%',
                                        border: '1px solid #f0f0f0',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                                        boxSizing: 'border-box',
                                        background: 'white',
                                        borderRadius: '8px',
                                        overflow: 'auto',
                                    }}
                                >
                                    <Row gutter={[16, 16]} style={{ flex: 1, width: '100%', margin: 0 }}>
                                        {currentDbProducts.map((product, index) => (
                                            <Col key={index} xs={24} sm={12} md={6} lg={6} xl={4}>
                                                <a href={product.goodsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                    <Card
                                                        hoverable
                                                        cover={
                                                            <img
                                                                alt={product.goodsName}
                                                                src={product.goodsImgUrl}
                                                                style={{height: '200px', objectFit: 'cover'}}
                                                                referrerPolicy="no-referrer"
                                                            />
                                                        }
                                                        style={{width: '100%', position: 'relative'}}
                                                    >
                                                        <Card.Meta
                                                            title={product.goodsName}
                                                            description={<span style={{
                                                                color: '#1890ff',
                                                                fontWeight: 'bold'
                                                            }}>{product.goodsPrice}</span>}
                                                        />
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '8px',
                                                            right: '8px',
                                                            display: 'flex',
                                                            gap: '8px', // 添加间距
                                                        }}>
                                                            <LineChartOutlined
                                                                style={{
                                                                    // position: 'absolute',
                                                                    // bottom: '8px',
                                                                    // right: '8px',
                                                                    fontSize: '20px',
                                                                    color: '#1890ff',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={(e) => handleHistoryClick(e, product)}
                                                            />
                                                            {priceWatchList.has(product.goodsId) ? (
                                                                <CloseOutlined
                                                                    style={{
                                                                        fontSize: '20px',
                                                                        color: '#ff4d4f',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={(e) => handlePriceWatchClick(e, product)}
                                                                />
                                                            ) : (
                                                                <ClockCircleOutlined
                                                                    style={{
                                                                        fontSize: '20px',
                                                                        color: '#1890ff',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={(e) => handlePriceWatchClick(e, product)}
                                                                />
                                                            )}
                                                        </div>
                                                    </Card>
                                                </a>
                                            </Col>
                                            ))}
                                    </Row>
                                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                        <Pagination
                                            current={currentPage}
                                            pageSize={itemsPerPage}
                                            total={dbproductList.length}
                                            onChange={handlePageChange}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                </Content>
                            </Layout>
                        </Layout>
                    )}
                    <Footer style={{textAlign: 'center'}}>
                        PCW ©{new Date().getFullYear()} Created by 星际飙车侠
                    </Footer>
                </Layout>
                <Modal
                    title={selectedProduct ? `${selectedProduct.goodsName} 的历史价格` : '历史价格'}
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                    width={800}
                >
                    {historyLoading ? (
                        <div style={{ textAlign: 'center' }}>
                            <Spin tip="加载中..." />
                        </div>
                    ) : priceHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                                data={priceHistory}
                                margin={{
                                    top: 5, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis dataKey="price" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <p>暂无历史价格数据。</p>
                        </div>
                    )}
                </Modal>
            {/*</div>*/}
            {/*/!* 登录二维码 Modal *!/*/}
            {/*<Modal*/}
            {/*    title="请使用手机微信扫码登录"*/}
            {/*    open={isModalVisible}*/}
            {/*    footer={null} // 移除底部按钮*/}
            {/*    closable={false} // 禁止用户手动关闭 Modal*/}
            {/*    centered*/}
            {/*>*/}
            {/*    <div style={{ textAlign: 'center' }}>*/}
            {/*        {qrCode ? (*/}
            {/*            <img src={qrCode} alt="二维码" style={{ width: '200px', height: '200px' }} />*/}
            {/*        ) : (*/}
            {/*            <Spin tip="二维码加载中..." />*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</Modal>*/}
        </div>
    );
};

export default MainPage;