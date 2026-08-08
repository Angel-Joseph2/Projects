import React from 'react';
import { Avatar, Typography } from 'antd';
import '../styles/App.css';

const { Text } = Typography;

const ChatHeader = ({ user }) => {
  if (!user) return null;

  return (
    <div className="chat-header">
      <Avatar style={{ backgroundColor: '#87d068', marginRight: 12 }}>
        {user.username.charAt(0).toUpperCase()}
      </Avatar>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text strong style={{ fontSize: 16 }}>{user.username}</Text>
      </div>
    </div>
  );
};

export default ChatHeader;
