import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';
import '../styles/App.css';

const { Sider, Content } = Layout;

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSelectUser = (userToChat) => {
    setSelectedChatUser(userToChat);
  };

  return (
    <Layout className="dashboard-layout">
      <Sider width={350} className="sidebar" theme="light">
        <div className="sidebar-header">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1890ff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <strong>{user?.username}</strong>
          </div>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} />
        </div>
        <div className="user-list-container">
          <UserList selectedUserId={selectedChatUser?.id} onSelectUser={handleSelectUser} />
        </div>
      </Sider>
      <Content className="chat-area">
        {selectedChatUser ? (
          <ChatWindow selectedUser={selectedChatUser} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', backgroundColor: '#f0f2f5' }}>
            Select a chat to start messaging
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Dashboard;
