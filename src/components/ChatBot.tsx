import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import { Avatar, Badge } from '@mui/material';
import '../assets/styles/chatbot.css';

export default function ChatBot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý thông minh của bạn. Bạn cần giúp đỡ gì?',
      isBot: true
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      if (isProcessing) {
        // Thêm vào queue nếu đang xử lý
        setMessageQueue(prev => [...prev, message.trim()]);
        setMessage('');
        return;
      }

      const newMessage = {
        id: Date.now(),
        text: message,
        isBot: false
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      setIsProcessing(true);
      setIsTyping(true);
      
      setTimeout(() => {
        const responses = [
          'Tôi có thể giúp bạn với câu hỏi đó. Bạn cần hỗ trợ gì cụ thể?',
          'Để tôi tìm hiểu thêm về vấn đề này cho bạn.',
          'Đây là một câu hỏi thú vị! Hãy để tôi giải thích...',
          'Tôi hiểu rồi. Bạn có thể cung cấp thêm thông tin không?',
          'Dựa vào câu hỏi của bạn, tôi nghĩ...'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setIsTyping(false);
        const botResponse = {
          id: Date.now(),
          text: randomResponse,
          isBot: true
        };
        setMessages(prev => [...prev, botResponse]);
        setIsProcessing(false);

        // Xử lý queue
        if (messageQueue.length > 0) {
          setTimeout(() => {
            const nextMessage = messageQueue[0];
            setMessageQueue(prev => prev.slice(1));
            
            const queuedMessage = {
              id: Date.now(),
              text: nextMessage,
              isBot: false
            };
            setMessages(prev => [...prev, queuedMessage]);
            setIsProcessing(true);
            setIsTyping(true);

            setTimeout(() => {
              const queueResponse = responses[Math.floor(Math.random() * responses.length)];
              setIsTyping(false);
              const queueBotResponse = {
                id: Date.now(),
                text: queueResponse,
                isBot: true
              };
              setMessages(prev => [...prev, queueBotResponse]);
              setIsProcessing(false);
            }, 2000);
          }, 500);
        }
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 12, 
      border: '1px solid #e5e7eb',
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header chatbot */}
      <div style={{ 
        background: '#f8f9fa', 
        color: '#374151', 
        padding: '16px',
        fontWeight: 800,
        fontSize: '20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#44b883',
              color: '#44b883',
              boxShadow: `0 0 0 2px #f8f9fa`,
              '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
              },
            },
            '@keyframes ripple': {
              '0%': {
                transform: 'scale(.8)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
              },
            },
          }}
        >
          <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40 }}>
            <RiRobot2Line size={20} />
          </Avatar>
        </Badge>
        Trợ lý thông minh
      </div>
      
      {/* Chat messages area */}
      <div 
        ref={chatContainerRef}
        style={{ 
          flex: 1, 
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: '#f9fafb'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{ 
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              flexDirection: msg.isBot ? 'row' : 'row-reverse'
            }}
          >
            {/* Avatar chỉ cho bot */}
            {msg.isBot && (
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#44b883',
                    color: '#44b883',
                    boxShadow: `0 0 0 2px #f9fafb`,
                    width: 8,
                    height: 8,
                  },
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: '#3b82f6', 
                    width: 32, 
                    height: 32,
                    fontSize: '14px'
                  }}
                >
                  <RiRobot2Line size={16} />
                </Avatar>
              </Badge>
            )}
            
            {/* Message bubble */}
            <div
              style={{ 
                background: msg.isBot ? '#e5e7eb' : '#3b82f6', 
                color: msg.isBot ? '#374151' : '#ffffff',
                padding: '12px 16px', 
                borderRadius: '18px',
                maxWidth: '75%',
                fontSize: '14px',
                lineHeight: '1.4',
                wordWrap: 'break-word'
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div 
            style={{ 
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              flexDirection: 'row'
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#44b883',
                  color: '#44b883',
                  boxShadow: `0 0 0 2px #f9fafb`,
                  width: 8,
                  height: 8,
                },
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: '#3b82f6', 
                  width: 32, 
                  height: 32,
                  fontSize: '14px'
                }}
              >
                <RiRobot2Line size={16} />
              </Avatar>
            </Badge>
            
            <div
              style={{ 
                background: '#e5e7eb', 
                color: '#6b7280',
                padding: '12px 16px', 
                borderRadius: '18px',
                maxWidth: '75%',
                fontSize: '14px',
                lineHeight: '1.4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '20px'
              }}
            >
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div style={{ 
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#fff'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f3f4f6',
          borderRadius: '24px',
          padding: '4px',
          border: '1px solid #d1d5db'
        }}>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isProcessing ? "Đang xử lý tin nhắn..." : "Nhập tin nhắn..."}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'transparent',
              color: isProcessing ? '#9ca3af' : 'inherit'
            }}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim() || isProcessing}
            style={{
              background: (message.trim() && !isProcessing) ? '#3b82f6' : '#d1d5db',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: (message.trim() && !isProcessing) ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '4px',
              transition: 'all 0.2s'
            }}
          >
            <FiSend size={16} />
          </button>
        </div>
        
        {/* Queue indicator */}
        {messageQueue.length > 0 && (
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            Có {messageQueue.length} tin nhắn đang chờ xử lý...
          </div>
        )}
      </div>
    </div>
  );
}
