import React, { useState, useEffect, useContext } from 'react';
import { List, Avatar, Badge, Spin, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/App.css';

const { Text } = Typography;

const UserList = ({ selectedUserId, onSelectUser }) => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (user && user.id) {
          const response = await api.get(`/api/users/${user.id}`);
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Fetch unread counts and merge into users list
  useEffect(() => {
    if (!user || !user.id) return;
    const fetchUnread = async () => {
      try {
        const resp = await api.get(`/api/messages/unread/${user.id}`);
        const counts = resp.data; // { senderId: count }
        setUsers(prev =>
          prev.map(u => ({ ...u, unreadCount: counts[u.id] || 0 }))
        );
      } catch (e) {
        console.error('Failed to fetch unread counts', e);
      }
    };
    fetchUnread();
  }, [user]);

  // Socket listener for realtime unread updates
  useEffect(() => {
    const handleUpdate = ({ sender_id, recipient_id, unread_count }) => {
      if (!user || user.id !== recipient_id) return;
      setUsers(prev =>
        prev.map(u =>
          u.id === sender_id ? { ...u, unreadCount: unread_count } : u
        )
      );
    };
    import('../services/socket').then(({ default: socket }) => {
      socket.on('unread_count_updated', handleUpdate);
    });
    return () => {
      import('../services/socket').then(({ default: socket }) => {
        socket.off('unread_count_updated', handleUpdate);
      });
    };
  }, [user]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin tip="Loading users..." />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
        No other users found.
      </div>
    );
  }

  const handleClick = (item) => {
    // Clear unread count locally when user opens chat
    setUsers(prev =>
      prev.map(u => (u.id === item.id ? { ...u, unreadCount: 0 } : u))
    );
    onSelectUser(item);
  };

  return (
    <List
      className="user-list"
      itemLayout="horizontal"
      dataSource={users}
      renderItem={item => (
        <List.Item
          className={`user-list-item ${selectedUserId === item.id ? 'active' : ''}`}
          onClick={() => handleClick(item)}
        >
          <List.Item.Meta
            avatar={
              <Badge dot={item.unreadCount > 0} count={item.unreadCount} color="blue">
                <Avatar style={{ backgroundColor: '#87d068' }}>
                  {item.username.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
            }
            title={<Text strong>{item.username}</Text>}
            description={item.email}
          />
        </List.Item>
      )}
    />
  );
};

export default UserList;
