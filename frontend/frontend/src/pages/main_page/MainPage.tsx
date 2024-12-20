import React, {useState, useEffect, useRef} from 'react';
import "./mainpage.css";
import { UserOutlined, SettingOutlined, ShoppingOutlined, PoweroffOutlined, LineChartOutlined, ClockCircleOutlined, CloseOutlined  } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Layout, Menu, theme, Input, Modal, Card, Row, Col, Pagination, Spin, Dropdown} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    const [collapsed, setCollapsed] = useState(false);
    const maxPage = 1;

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
    };

    const onDatabaseSearch = async (value: string) => {
        console.log('Database Search:', value);
        setSearchKeyword(value);
    }

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
                // 向后端api/user/logout接口发送请求
                try {
                    const response = axios.get(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
                        withCredentials: true,
                    });
                    console.log('退出登录成功:', response);
                } catch (error: any) {
                    console.error('退出登录失败:', error);
                    // 输出失败给用户
                    Modal.error({
                        title: '退出登录失败',
                        content: '请稍后重试。',
                    });
                }
                navigate('/'); // 返回首页
            },
        });
    };

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

    useEffect(() => {
        const validateUser = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_API_URL}/api/user/info`, {
                    withCredentials: true,
                });
                // 用户已登录，继续渲染页面
            } catch (error) {
                console.error('用户未登录:', error);
                Modal.error({
                    title: '未登录',
                    content: '请先登录。',
                    onOk() {
                        navigate('/');
                    },
                });
            }
        };
        validateUser();
    }, []);

    const fetchDatabaseProducts = async (keyword: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/goods/database-search`, {
                params: {
                    keyword,
                },
                withCredentials: true,
            });
            let products = response.data;
            products = products.map((product: any) => ({
                ...product,
                goodsPriceNum: parsePrice(product.goodsPrice),
            }));
            setDbProductList(products);
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

    const parsePrice = (priceStr: string): number => {
        const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : num;
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
            let products = response.data;
            products = products.map((product: any) => ({
                ...product,
                goodsPriceNum: parsePrice(product.goodsPrice),
            }));

            setProductList(products); // 假设后端返回的数据格式为 { products: [...] }
            console.log('搜索成功');
            checkPriceDrops(products); // 调用检查降价
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
            if (priceWatchList.has(product.goodsUrl)) {
                const previousPrice = previousPrices.current[product.goodsUrl];
                // 输出id，前价格和当前价格
                console.log("goodsUrl: " + product.goodsUrl + " previousPrice: " + previousPrice + " currentPrice: " + product.goodsPriceNum);
                if (previousPrice && product.goodsPriceNum < previousPrice) {
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
                previousPrices.current[product.goodsUrl] = product.goodsPriceNum;
            }
        }
    };

    // 处理降价提醒按钮点击
    const handlePriceWatchClick = (e: React.MouseEvent<HTMLElement>, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        const updatedWatchList = new Set(priceWatchList);
        if (priceWatchList.has(product.goodsUrl)) {
            updatedWatchList.delete(product.goodsUrl);
        } else {
            updatedWatchList.add(product.goodsUrl);
            // 记录当前价格
            previousPrices.current[product.goodsUrl] = product.goodsPriceNum;
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
            const historyData: PriceHistory[] = response.data.map((item: any) => ({
                date: item.date,
                price: parsePrice(item.price), // 将价格字符串转换为数值
            }));
            setPriceHistory(historyData);
            console.log('历史价格数据:', historyData);
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

    const handleBreakpoint = (broken: boolean) => {
        // console.log("宽度已经小于500px");
        if (broken) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    };

    const handleSettings = () => {
        navigate('/settings'); // 新增的设置导航逻辑
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'settings',
            label: '设置',
            icon: <SettingOutlined />,
        },
        {
            key: 'logout',
            label: '退出登录',
            icon: <PoweroffOutlined />,
        },
    ];

    return (
        <div className={"mainpage-container"} style={{ overflow: 'auto'}}>
            {/*<div className={"mainpage_inner"}>*/}
                <Layout style={{ minHeight: '100vh', flexDirection: 'column', overflow: 'auto', minWidth: "300px" }}>
                    <Header style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
                        <ShoppingOutlined
                            style={{ fontSize: '24px', color: 'white', marginRight: '16px', cursor: 'pointer' }}
                        />
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['搜索']}
                            selectedKeys={[selectedMenu]}
                            onClick={handleMenuClick}
                            items={items1}
                            style={{ flex: 1, minWidth: 20 }}
                        />
                        <Dropdown
                            menu={{
                                items: userMenuItems,
                                onClick: ({ key }) => {
                                    if (key === 'settings') {
                                        handleSettings();
                                    } else if (key === 'logout') {
                                        handleLogout();
                                    }
                                },
                            }}
                            placement="bottomRight"
                        >
                            <UserOutlined
                                style={{ fontSize: '24px', color: 'white', marginLeft: 'auto', cursor: 'pointer' }}
                            />
                        </Dropdown>
                    </Header>
                    {selectedMenu == '搜索' && (
                        <Layout>
                            <Sider
                                breakpoint="lg"
                                collapsible={true}
                                collapsedWidth="50px"
                                collapsed={collapsed}
                                onBreakpoint={handleBreakpoint}
                                // collapsed={this.state.collapsed}
                                trigger={null}
                                style = {{ minWidth: "50px", background: colorBgContainer }}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['pdd']}
                                    style={{ height: '100%', borderRight: 0 }}
                                    items={items2}
                                    onClick={handleSiteChange}
                                />
                            </Sider>
                            <Layout style={{ flex: 1, maxWidth: "100%", minWidth: "250px", padding: '0 24px 24px' }}>
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
                                        overflow: 'auto',
                                    }}
                                >
                                    <Row gutter={[16, 16]} style={{flex: 1, width: '100%', margin: 0}}>
                                        {currentProducts.map((product, index) => (
                                            <Col key={index} xs={24} sm={12} md={6} lg={6} xl={4}>
                                                <a href={product.goodsUrl} referrerPolicy="no-referrer" target="_blank" rel="noopener noreferrer"
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
                                                                    fontSize: '20px',
                                                                    color: '#1890ff',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={(e) => handleHistoryClick(e, product)}
                                                            />
                                                            {priceWatchList.has(product.goodsUrl) ? (
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
        </div>
    );
};

export default MainPage;