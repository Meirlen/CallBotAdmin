import React, { useState } from 'react';
import {
    AppstoreOutlined,
    CalculatorOutlined,
    CompassOutlined,
    DollarCircleOutlined,
    StockOutlined,
    UserOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children,) {
    return { key, icon, children, label, };
}


const items = [
    getItem('Главная', '/orders', <AppstoreOutlined />),
    getItem('История заказов', '/orders-history', <HistoryOutlined />),
    getItem('Калькуляция заказа', '/calc-order', <CalculatorOutlined />),
    getItem('Цена поездки', '/price', <DollarCircleOutlined />),
    getItem('Регионы', '/region', <CompassOutlined />),
    getItem('Повышенный тариф', '/', <StockOutlined />),
    getItem('Роли', '', <UserOutlined />, [
        getItem('Администратор', '/admin'),
        getItem('Супер-администратор', '/super-admin'),
        getItem('Менеджер', '/manager'),
    ]),
];

export default function Navbar({ setName, setEmail, currentActive }) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <Layout style={{ minHeight: '100vh', zIndex: 100 }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={220}
            >
                <div className='sidebar-content' >
                    <div>
                        <img id="logoImage" className="sidebar-logo" src='/images/30a73fef51e49cae69255a5ae18d93e0.png' alt='logo'></img>
                        <Menu
                            theme="dark"
                            defaultSelectedKeys={['/orders']}
                            mode="inline" items={items}
                            onSelect={e => navigate(e.key)}
                            selectedKeys={[pathname]}
                        />
                    </div>
                    {!collapsed && <Text className='sidebar-contact'>Служба поддержки: <br /> +7 (800) 555-35-35</Text>}
                </div>
            </Sider>
        </Layout>
    )

}