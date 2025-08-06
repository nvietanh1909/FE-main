import React, { useState } from 'react';
import { Box, Typography, Avatar, Badge, InputBase, Chip } from '@mui/material';
import { Search } from '@mui/icons-material';

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: number;
  isOnline: boolean;
  department: string;
}

interface AdminConversationListProps {
  conversations: Conversation[];
  selectedConversation: number | null;
  onSelectConversation: (id: number) => void;
}

export default function AdminConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation 
}: AdminConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#fff'
      }}>
        <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: '#1e293b' }}>
          Tin nhắn từ người dùng
        </Typography>
        
        {/* Search */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '20px',
          px: 2,
          py: 1
        }}>
          <Search sx={{ color: '#6b7280', mr: 1 }} />
          <InputBase
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm cuộc trò chuyện..."
            sx={{ 
              flex: 1, 
              fontSize: '14px',
              '& input': { padding: 0 }
            }}
          />
        </Box>
      </Box>

      {/* Conversation List */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto',
        backgroundColor: '#fff'
      }}>
        {filteredConversations.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100px',
            color: '#6b7280'
          }}>
            <Typography variant="body2">
              {searchQuery ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có cuộc trò chuyện'}
            </Typography>
          </Box>
        ) : (
          filteredConversations.map((conversation) => (
          <Box
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer',
              backgroundColor: selectedConversation === conversation.id ? '#e3f2fd' : 'transparent',
              borderLeft: selectedConversation === conversation.id ? '4px solid #2196f3' : '4px solid transparent',
              position: 'relative',
              '&:hover': {
                backgroundColor: selectedConversation === conversation.id ? '#e3f2fd' : '#f8fafc',
              },
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            {/* Avatar with online status */}
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: conversation.isOnline ? '#22c55e' : '#94a3b8',
                  color: conversation.isOnline ? '#22c55e' : '#94a3b8',
                  boxShadow: `0 0 0 2px #fff`,
                  width: 12,
                  height: 12,
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 52, 
                  height: 52,
                  bgcolor: '#3b82f6',
                  fontSize: '18px',
                  fontWeight: 600,
                  border: '2px solid #f8fafc',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)'
                }}
              >
                {conversation.name.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>

            {/* Message content */}
            <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography 
                  variant="subtitle2" 
                  fontWeight={conversation.unread > 0 ? 600 : 500}
                  sx={{ 
                    color: conversation.unread > 0 ? '#1e293b' : '#475569',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '15px',
                    lineHeight: 1.3
                  }}
                >
                  {conversation.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '11px',
                    fontWeight: 500,
                    backgroundColor: '#f1f5f9',
                    px: 1,
                    py: 0.3,
                    borderRadius: '8px'
                  }}
                >
                  {conversation.time}
                </Typography>
              </Box>

              {/* Department Chip */}
              <Chip 
                label={conversation.department}
                size="small"
                sx={{ 
                  mt: 0.5,
                  mb: 0.5,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontSize: '0.7rem',
                  height: '18px',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: conversation.unread > 0 ? '#334155' : '#64748b',
                    fontWeight: conversation.unread > 0 ? 500 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '13px',
                    lineHeight: 1.4,
                    mt: 0.2
                  }}
                >
                  {conversation.lastMessage}
                </Typography>
                
                {conversation.unread > 0 && (
                  <Box sx={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    borderRadius: '12px',
                    minWidth: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    ml: 1,
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
                  }}>
                    {conversation.unread > 99 ? '99+' : conversation.unread}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )))}
      </Box>
    </Box>
  );
}
