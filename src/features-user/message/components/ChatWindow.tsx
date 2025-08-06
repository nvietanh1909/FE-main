import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Avatar, Badge, InputBase, IconButton } from '@mui/material';
import { Send, Phone, VideoCall, Info, EmojiEmotions, AttachFile } from '@mui/icons-material';

interface Message {
  id: number;
  text: string;
  isMe: boolean;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
  conversationId: number | null;
  conversationName: string;
  isOnline: boolean;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export default function ChatWindow({ 
  conversationId, 
  conversationName, 
  isOnline, 
  messages, 
  onSendMessage 
}: ChatWindowProps) {
  const [message, setMessage] = useState('');
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
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversationId) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        backgroundColor: '#f9fafb'
      }}>
        <Typography variant="h6" color="text.secondary">
          Chọn một cuộc trò chuyện để bắt đầu
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: '#fff'
    }}>
      {/* Chat Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2, 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#fff'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: isOnline ? '#44b883' : '#9ca3af',
                color: isOnline ? '#44b883' : '#9ca3af',
                boxShadow: `0 0 0 2px #fff`,
                width: 10,
                height: 10,
              },
            }}
          >
            <Avatar sx={{ width: 40, height: 40, bgcolor: '#3b82f6' }}>
              {conversationName.charAt(0)}
            </Avatar>
          </Badge>
          
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1.2 }}>
              {conversationName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, mt: -0.2 }}>
              {isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
            </Typography>
          </Box>
        </Box>

      
      </Box>

      {/* Messages Area */}
      <Box 
        ref={chatContainerRef}
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          backgroundColor: '#f9fafb',
          scrollBehavior: 'smooth'
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                backgroundColor: msg.isMe ? '#3b82f6' : '#fff',
                color: msg.isMe ? '#fff' : '#374151',
                borderRadius: '18px',
                px: 2,
                py: 1,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                position: 'relative'
              }}
            >
              <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                {msg.text}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: msg.isMe ? 'rgba(255,255,255,0.7)' : '#6b7280',
                  fontSize: '11px',
                  mt: 0.5,
                  display: 'block'
                }}
              >
                {msg.time}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#fff'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '25px',
          px: 2,
          py: 1
        }}>
          <IconButton size="small" sx={{ color: '#6b7280' }}>
            <AttachFile />
          </IconButton>
          
          <InputBase
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            multiline
            maxRows={4}
            sx={{ 
              flex: 1, 
              mx: 1,
              fontSize: '14px',
              '& textarea': {
                resize: 'none'
              }
            }}
          />
          
          <IconButton size="small" sx={{ color: '#6b7280' }}>
            <EmojiEmotions />
          </IconButton>
          
          <IconButton 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{ 
              color: message.trim() ? '#3b82f6' : '#9ca3af',
              ml: 1
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
