import React, { useState, useEffect, useContext, useRef } from 'react';
import { Spin, message as antMessage } from 'antd';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import '../styles/App.css';
import socket from '../services/socket';

const ChatWindow = ({ selectedUser }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUser) return;
      
      setLoading(true);
      try {
        const response = await api.get(`/api/messages/${currentUser.id}/${selectedUser.id}`);
        setMessages(response.data);
        // Mark messages as read for this conversation
        await api.put(`/api/messages/read/${selectedUser.id}/${currentUser.id}`);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        antMessage.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for incoming messages via Socket.IO
  useEffect(() => {
    const handleIncoming = (msg) => {
      if (!selectedUser || !currentUser) return;
      // Only add message if it belongs to the current conversation
      if (msg.sender_id === selectedUser.id && msg.recipient_id === currentUser.id) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on('receive_message', handleIncoming);
    return () => {
      socket.off('receive_message', handleIncoming);
    };
  }, [selectedUser, currentUser]);

  const handleSendMessage = async (textContent) => {
    if (!currentUser || !selectedUser) return;
    
    const payload = {
      sender_id: currentUser.id,
      recipient_id: selectedUser.id,
      text_content: textContent
    };

    try {
      await api.post('/api/messages/send', payload);
      // For Phase 3, we append optimistically. In Phase 4, Socket.IO will broadcast this.
      setMessages(prev => [...prev, { ...payload, created_at: new Date().toISOString() }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      antMessage.error('Failed to send message');
    }
  };

  if (!selectedUser) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <ChatHeader user={selectedUser} />
      
      <div className="messages-container">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin tip="Loading messages..." />
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <MessageBubble 
                key={msg.id || index} 
                message={msg} 
                isOutgoing={msg.sender_id === currentUser.id} 
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
