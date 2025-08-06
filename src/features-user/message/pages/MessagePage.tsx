import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { FaHome } from 'react-icons/fa';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import ConversationList from '../components/ConversationList.tsx';
import ChatWindow from '../components/ChatWindow.tsx';

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: number;
  isOnline: boolean;
}

interface Message {
  id: number;
  text: string;
  isMe: boolean;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

export default function MessagePage() {
  nprogress.configure({ showSpinner: false });
  nprogress.start();

  useEffect(() => {
    nprogress.done();
  }, []);

  const [selectedConversation, setSelectedConversation] = useState<number | null>(1); // Mặc định chọn cuộc trò chuyện đầu tiên
  
  // Mock data
  const [conversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'Nguyễn Đức Anh',
      lastMessage: 'Chào bạn, tôi cần hỗ trợ về quy trình thanh toán',
      time: '10:30',
      avatar: '',
      unread: 2,
      isOnline: true
    },
    {
      id: 2,
      name: 'Ngô Thị Tâm',
      lastMessage: 'Cảm ơn bạn đã hỗ trợ!',
      time: '9:15',
      avatar: '',
      unread: 0,
      isOnline: false
    },
    {
      id: 3,
      name: 'Nguyễn Việt Anh',
      lastMessage: 'Tài liệu đã được gửi',
      time: 'Hôm qua',
      avatar: '',
      unread: 1,
      isOnline: true
    },
    {
      id: 4,
      name: 'Phạm Thu Hà',
      lastMessage: 'Xin chào, tôi muốn tìm hiểu về thủ tục mới',
      time: 'Hôm qua',
      avatar: '',
      unread: 0,
      isOnline: false
    },
    {
      id: 5,
      name: 'Đỗ Minh Tuấn',
      lastMessage: 'Bạn có thể gọi điện cho tôi không?',
      time: '2 ngày',
      avatar: '',
      unread: 3,
      isOnline: true
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Chào bạn, tôi cần hỗ trợ về quy trình thanh toán',
      isMe: false,
      time: '10:25'
    },
    {
      id: 2,
      text: 'Chào bạn! Tôi có thể giúp bạn với quy trình thanh toán. Bạn cần hỗ trợ cụ thể về vấn đề gì?',
      isMe: true,
      time: '10:26'
    },
    {
      id: 3,
      text: 'Tôi muốn biết cách thanh toán chi phí hoạt động chuyên môn',
      isMe: false,
      time: '10:30'
    }
  ]);

  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
  };

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isMe: true,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="py-4 px-6">
      <Breadcrumbs separator=">" aria-label="breadcrumb" className="text-base mb-4">
        <Link
          underline="none"
          color="inherit"
          href="/"
          className="flex items-center gap-1"
        >
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Typography color="#2563eb" fontWeight={600}>
          Tin nhắn
        </Typography>
      </Breadcrumbs>

      {/* Messenger Layout */}
      <Box sx={{
        height: 'calc(100vh - 100px)',
        backgroundColor: '#fff',
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        marginTop: 2,
        overflow: 'hidden',
        display: 'flex'
      }}>
        {/* Conversation List - 30% */}
        <Box sx={{ width: '30%', minWidth: '300px' }}>
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />
        </Box>

        {/* Chat Window - 70% */}
        <Box sx={{ flex: 1 }}>
          <ChatWindow
            conversationId={selectedConversation}
            conversationName={selectedConversationData?.name || ''}
            isOnline={selectedConversationData?.isOnline || false}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </Box>
      </Box>
    </div>
  );
} 