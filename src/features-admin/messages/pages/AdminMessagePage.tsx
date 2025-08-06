import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { FaHome } from 'react-icons/fa';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import AdminConversationList from '../components/AdminConversationList.tsx';
import AdminChatWindow from '../components/AdminChatWindow.tsx';

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

interface Message {
  id: number;
  text: string;
  isMe: boolean;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

export default function AdminMessagePage() {
  nprogress.configure({ showSpinner: false });
  nprogress.start();

  useEffect(() => {
    nprogress.done();
  }, []);

  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  
  // Mock data - Admin conversations
  const [conversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      lastMessage: 'Tôi cần hỗ trợ về quy trình thanh toán',
      time: '10:30',
      avatar: '',
      unread: 2,
      isOnline: true,
      department: 'Phòng Tài chính'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      lastMessage: 'Cảm ơn admin đã hỗ trợ!',
      time: '9:15',
      avatar: '',
      unread: 0,
      isOnline: false,
      department: 'Phòng Nhân sự'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      lastMessage: 'Có thể giúp tôi reset mật khẩu không?',
      time: 'Hôm qua',
      avatar: '',
      unread: 1,
      isOnline: true,
      department: 'Phòng IT'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      lastMessage: 'Hệ thống có vấn đề gì không ạ?',
      time: 'Hôm qua',
      avatar: '',
      unread: 0,
      isOnline: false,
      department: 'Phòng Kế toán'
    },
   
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Chào admin, tôi cần hỗ trợ về quy trình thanh toán',
      isMe: false,
      time: '10:25'
    },
    {
      id: 2,
      text: 'Chào bạn! Tôi sẽ hỗ trợ bạn. Bạn gặp vấn đề gì cụ thể với quy trình thanh toán?',
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
          href="/admin"
          className="flex items-center gap-1"
        >
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </Link>
        <Typography color="#2563eb" fontWeight={600}>
          Tin nhắn
        </Typography>
      </Breadcrumbs>

      {/* Admin Messenger Layout */}
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
          <AdminConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />
        </Box>

        {/* Chat Window - 70% */}
        <Box sx={{ flex: 1 }}>
          <AdminChatWindow
            conversationId={selectedConversation}
            conversationName={selectedConversationData?.name || ''}
            isOnline={selectedConversationData?.isOnline || false}
            department={selectedConversationData?.department || ''}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </Box>
      </Box>
    </div>
  );
}
