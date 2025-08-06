import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Avatar, Badge, InputBase, IconButton, Chip } from '@mui/material';
import { Send, Phone, VideoCall, Info, EmojiEmotions, AttachFile } from '@mui/icons-material';

interface Message {
  id: number;
  text: string;
  isMe: boolean;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface AdminChatWindowProps {
  conversationId: number | null;
  conversationName: string;
  isOnline: boolean;
  department: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export default function AdminChatWindow({ 
  conversationId,
  conversationName,
  isOnline,
  department,
  messages, 
  onSendMessage 
}: AdminChatWindowProps) {
  const [message, setMessage] = useState('');
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
                backgroundColor: isOnline ? '#22c55e' : '#9ca3af',
                color: isOnline ? '#22c55e' : '#9ca3af',
                boxShadow: `0 0 0 2px #fff`,
                width: 12,
                height: 12,
              },
            }}
          >
            <Avatar sx={{ 
              width: 40, 
              height: 40,
              backgroundColor: '#3b82f6',
              mr: 2,
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              {conversationName.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
          
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1e293b' }}>
              {conversationName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={department}
                size="small"
                sx={{ 
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontSize: '0.7rem',
                  height: '18px'
                }}
              />
              <Typography variant="caption" sx={{ 
                color: isOnline ? '#22c55e' : '#6b7280',
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                {isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" sx={{ color: '#6b7280' }}>
            <Phone />
          </IconButton>
          <IconButton size="small" sx={{ color: '#6b7280' }}>
            <VideoCall />
          </IconButton>
          <IconButton size="small" sx={{ color: '#6b7280' }}>
            <Info />
          </IconButton>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box 
        ref={chatContainerRef}
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          backgroundColor: '#f8fafc'
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                backgroundColor: msg.isMe ? '#3b82f6' : '#fff',
                color: msg.isMe ? '#fff' : '#1e293b',
                p: 2,
                borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                border: msg.isMe ? 'none' : '1px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Typography variant="body2" sx={{ mb: 0.5, lineHeight: 1.4 }}>
                {msg.text}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: msg.isMe ? 'rgba(255,255,255,0.8)' : '#6b7280',
                  fontSize: '0.7rem'
                }}
              >
                {msg.time}
              </Typography>
            </Box>
          </Box>
        ))}
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
          borderRadius: '20px',
          px: 2,
          py: 1
        }}>
          <IconButton size="small" sx={{ color: '#6b7280', mr: 1 }}>
            <AttachFile />
          </IconButton>
          
          <InputBase
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn hỗ trợ..."
            multiline
            maxRows={3}
            sx={{ 
              flex: 1, 
              fontSize: '14px',
              '& input': { padding: '8px 0' }
            }}
          />
          
          <IconButton size="small" sx={{ color: '#6b7280', ml: 1 }}>
            <EmojiEmotions />
          </IconButton>
          
          <IconButton 
            size="small" 
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
