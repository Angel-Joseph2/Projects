import React from 'react';
import '../styles/App.css';

const MessageBubble = ({ message, isOutgoing }) => {
  const time = new Date(message.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`message-bubble-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      <div className={`message-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`}>
        <div className="message-text">{message.text_content}</div>
        <div className="message-meta">
          <span className="message-time">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
