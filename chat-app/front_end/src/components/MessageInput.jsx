import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import '../styles/App.css';

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        autoSize={{ minRows: 1, maxRows: 4 }}
        style={{ borderRadius: 20, flex: 1 }}
      />
      <Button 
        type="primary" 
        shape="circle" 
        icon={<SendOutlined />} 
        size="large"
        onClick={handleSend}
        disabled={!text.trim()}
      />
    </div>
  );
};

export default MessageInput;
