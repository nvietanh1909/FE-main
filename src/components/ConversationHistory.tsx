import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  TextField,
  Paper,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  ChatBubbleOutline as ChatIcon
} from '@mui/icons-material';
import ConversationService, { Conversation } from '@/services/ConversationService';

interface ConversationHistoryProps {
  onSelectConversation: (conversationId: number) => void;
  onDeleteConversation?: (conversationId: number) => void;
  selectedConversationId?: number;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  onSelectConversation,
  onDeleteConversation,
  selectedConversationId
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await ConversationService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title || `Cuộc trò chuyện ${conversation.id}`);
  };

  const handleEditSave = async () => {
    if (editingId && editTitle.trim()) {
      try {
        console.log('🔍 Updating conversation title:', { id: editingId, title: editTitle.trim() });
        await ConversationService.updateConversationTitle(editingId, editTitle.trim());
        setConversations(prev =>
          prev.map(conv =>
            conv.id === editingId
              ? { ...conv, title: editTitle.trim() }
              : conv
          )
        );
        setEditingId(null);
        setEditTitle('');
        console.log('✅ Conversation title updated successfully');
      } catch (error) {
        console.error('❌ Failed to update conversation title:', error);
      }
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDeleteConversation = async (conversationId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering conversation selection
    
    // Show confirmation dialog
    if (window.confirm('Bạn có chắc chắn muốn xóa cuộc hội thoại này không?')) {
      try {
        console.log('🗑️ Deleting conversation:', conversationId);
        await ConversationService.deleteConversation(conversationId);
        
        // Remove from local state
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        
        // Notify parent component if callback provided
        if (onDeleteConversation) {
          onDeleteConversation(conversationId);
        }
        
        console.log('✅ Conversation deleted successfully');
      } catch (error) {
        console.error('❌ Failed to delete conversation:', error);
        alert('Không thể xóa cuộc hội thoại. Vui lòng thử lại.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hôm nay';
    } else if (diffDays === 2) {
      return 'Hôm qua';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Đang tải...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
        <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChatIcon fontSize="small" />
          Lịch sử trò chuyện
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {conversations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có cuộc trò chuyện nào
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {conversations.map((conversation) => (
              <React.Fragment key={conversation.id}>
                <ListItem 
                  disablePadding
                  sx={{
                    bgcolor: selectedConversationId === conversation.id ? '#f3f4f6' : 'transparent',
                    '&:hover': {
                      bgcolor: '#f9fafb'
                    }
                  }}
                >
                  <ListItemButton
                    onClick={() => onSelectConversation(conversation.id)}
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {editingId === conversation.id ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleEditSave();
                              } else if (e.key === 'Escape') {
                                handleEditCancel();
                              }
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                                height: '32px'
                              }
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSave();
                            }}
                            sx={{ p: 0.5 }}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCancel();
                            }}
                            sx={{ p: 0.5 }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight={selectedConversationId === conversation.id ? 600 : 400}
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      lineHeight: 1.3,
                                      flex: 1
                                    }}
                                  >
                                    {conversation.title || `Cuộc trò chuyện ${conversation.id}`}
                                  </Typography>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    gap: 0.5,
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    '.MuiListItem-root:hover &': {
                                      opacity: 1
                                    }
                                  }}>
                                    <Tooltip title="Sửa tiêu đề cuộc trò chuyện">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditStart(conversation);
                                        }}
                                        sx={{ 
                                          p: 0.3,
                                          '&:hover': {
                                            bgcolor: 'rgba(0,0,0,0.04)'
                                          }
                                        }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa cuộc hội thoại">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                                        sx={{ 
                                          p: 0.3,
                                          '&:hover': {
                                            bgcolor: 'rgba(220,38,38,0.1)',
                                            color: '#dc2626'
                                          }
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {conversation.created_at ? `Tạo: ${formatDate(conversation.created_at)} • ` : ''}{formatDate(conversation.updated_at)}
                                </Typography>
                              }
                              sx={{ m: 0 }}
                            />
                          </Box>
                        </>
                      )}
                    </Box>
                  </ListItemButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default ConversationHistory;