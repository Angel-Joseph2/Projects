import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Badge, Button, theme } from 'antd';
import {
  DashboardOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  BellOutlined,
  MoonOutlined,
  SunOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function MainLayout() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}') || {};
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user.role === 'doctor') {
      const loadNotifs = () => {
        setNotifications(JSON.parse(localStorage.getItem('doctorNotifications') || '[]'));
      };
      loadNotifs();
      const handleStorage = (e) => {
        if (!e.key || e.key === 'doctorNotifications') loadNotifs();
      };
      window.addEventListener('storage', handleStorage);
      window.addEventListener('doctorNotificationsUpdated', loadNotifs);
      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('doctorNotificationsUpdated', loadNotifs);
      };
    }
  }, [user.role]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = (e) => {
    e.stopPropagation();
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('doctorNotifications', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getMenuItems = () => {
    const roleBase = `/${user.role}`;
    const commonItems = [
      { key: `${roleBase}/dashboard`, icon: <DashboardOutlined />, label: 'Dashboard' },
    ];

    if (user.role === 'admin') {
      return [
        ...commonItems,
        { key: `${roleBase}/medicines`, icon: <MedicineBoxOutlined />, label: 'Medicines' },
        { key: `${roleBase}/doctors`, icon: <UserOutlined />, label: 'Doctors' },
        { key: `${roleBase}/pharmacists`, icon: <SafetyCertificateOutlined />, label: 'Pharmacists' },
        { key: `${roleBase}/reports`, icon: <BarChartOutlined />, label: 'Reports' },
      ];
    }

    if (user.role === 'doctor') {
      return [
        ...commonItems,
        { key: `${roleBase}/medicines`, icon: <MedicineBoxOutlined />, label: 'Available Medicines' },
        { key: `${roleBase}/prescriptions`, icon: <FileTextOutlined />, label: 'Prescriptions' },
      ];
    }

    if (user.role === 'pharmacist') {
      return [
        ...commonItems,
        { key: `${roleBase}/medicines`, icon: <MedicineBoxOutlined />, label: 'Medicine Stock' },
        { key: `${roleBase}/billing`, icon: <ShoppingOutlined />, label: 'Billing' },
      ];
    }

    return commonItems;
  };

  const avatarMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: (
          <span>
            {user.role?.toUpperCase()}: {user.username || user.name || user.email || 'User'}
          </span>
        ),
        disabled: true,
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        breakpoint="lg"
        style={{
          background: 'linear-gradient(180deg, #0a2342 0%, #1a3a6b 60%, #0d4f8b 100%)',
          boxShadow: '2px 0 12px rgba(0,0,0,0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '20px 0' : '20px 20px',
            gap: 10,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: 8,
          }}
        >
          <MedicineBoxOutlined style={{ fontSize: 28, color: '#4fc3f7' }} />
          {!collapsed && (
            <Text
              strong
              style={{
                color: '#fff',
                fontSize: 15,
                lineHeight: '1.2',
                letterSpacing: 0.3,
              }}
            >
              Pharmacy<br />
              <span style={{ color: '#4fc3f7', fontSize: 13 }}>Management</span>
            </Text>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={getMenuItems()}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#cce4ff',
          }}
          theme="dark"
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: token.colorBgContainer,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, color: token.colorText }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              style={{ fontSize: 18, color: token.colorText }}
            />
            {user.role === 'doctor' && (
              <Dropdown
                menu={{
                  items: notifications.length > 0 ? [
                    {
                      key: 'header',
                      label: (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 300 }} onClick={(e) => e.stopPropagation()}>
                          <Text strong>Notifications</Text>
                          <Button type="link" size="small" onClick={markAllAsRead} disabled={unreadCount === 0} style={{ padding: 0 }}>
                            Mark all read
                          </Button>
                        </div>
                      ),
                    },
                    { type: 'divider' },
                    ...notifications.slice(0, 5).map(n => ({
                      key: n.id,
                      label: (
                        <div style={{ padding: '8px 0', whiteSpace: 'normal', opacity: n.read ? 0.6 : 1 }}>
                          <Text>New medicine added: {n.medicineName} by {n.addedBy}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(n.timestamp).toLocaleString()}
                          </Text>
                        </div>
                      )
                    }))
                  ] : [
                    { key: 'empty', label: <div style={{ padding: 16, textAlign: 'center', width: 250 }}><Text type="secondary">No notifications</Text></div> }
                  ]
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Badge count={unreadCount} style={{ cursor: 'pointer' }}>
                  <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 20, color: token.colorText }} />} />
                </Badge>
              </Dropdown>
            )}
            <Dropdown menu={avatarMenu} placement="bottomRight" arrow>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: isDarkMode ? token.colorFillAlter : '#f0f6ff',
                }}
              >
                <Avatar
                  style={{ background: 'linear-gradient(135deg,#1a3a6b,#4fc3f7)', color: '#fff' }}
                  icon={<UserOutlined />}
                />
                <Text style={{ color: isDarkMode ? token.colorText : '#0a2342', fontWeight: 600 }}>
                  {user.username || user.name || 'User'}
                </Text>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: 0,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
