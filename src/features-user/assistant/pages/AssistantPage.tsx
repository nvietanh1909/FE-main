import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
  LinearProgress // Mới: Thêm loading indicator
} from '@mui/material';
import { 
  Send as SendIcon, 
  Person as UserIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { RiRobot2Line } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';
import '@/assets/styles/chatbot.css';

// --- Interfaces (Đồng bộ với API) ---

// Phản hồi từ GET /conversations
interface ApiConversation {
  id: number;
  title: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Phản hồi từ GET /conversations/{id}/messages
interface ApiMessage {
  id: number;
  conversation_id: number;
  content: string;
  type: 'user' | 'chatbot';
  created_at: string;
}

// Interface nội bộ của FE (để render)
interface Message {
  id: string; // Dùng string cho cả ID từ DB (number) và ID tạm thời (string)
  content: string;
  isBot: boolean;
  timestamp: Date;
}

// Interface nội bộ của FE (để render sidebar)
interface Conversation {
  id: number;
  title: string;
}

// --- RAGService (Cập nhật) ---
class RAGService { 
  private baseUrl = "https://umentor.duckdns.org/api";
  
  private getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return {
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }

  // (queryRAG không thay đổi, nhưng nên thêm Auth)
  async queryRAG(message: string, context: string): Promise<string> {
    // ... (Giữ nguyên, nhưng nên dùng this.getAuthHeaders())
    return "Not implemented in this flow"; 
  }

  // MỚI: Lấy danh sách hội thoại
  async getConversations(): Promise<ApiConversation[]> {
    const response = await fetch(`${this.baseUrl}/chatbot/conversations`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
  
  // MỚI: Lấy tin nhắn của 1 hội thoại
  async getMessages(conversationId: number): Promise<ApiMessage[]> {
    // API của bạn có phân trang, ở đây tôi tải trang 1 với size lớn
    // Bạn có thể implement lazy loading/infinite scroll sau
    const response = await fetch(
      `${this.baseUrl}/chatbot/conversations/${conversationId}/messages?page=1&page_size=100`, 
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const paginatedResponse = await response.json();
    return paginatedResponse.messages; // Trả về mảng messages
  }


  // CẬP NHẬT: streamRAG
  async streamRAG(
    query: string,
    // context: string,
    conversationId: number | null, // <-- THAY ĐỔI: Thêm conversationId
    onChunk?: (chunk: string) => void
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/chatbot/ask`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        message: query,
        // context: context,
        conversation_id: conversationId // <-- THAY ĐỔI: Gửi conversation_id
      }),
    });

    if (!response.body) {
      throw new Error("ReadableStream not supported!");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (onChunk) onChunk(chunk);
    }
  }
}

const ragService = new RAGService();


// --- Component ---
const AssistantPage: React.FC = () => {

  // --- State ---
  const defaultWelcomeMessage: Message = {
    id: 'welcome-1',
    content: 'Xin chào quý thầy cô! Quý thầy cô cần hỗ trợ gì trong quy trình thủ tục hành chính?',
    isBot: true,
    timestamp: new Date()
  };

  // State cho danh sách hội thoại (từ API)
  const [conversations, setConversations] = useState<Conversation[]>([]);
  // State cho ID hội thoại đang chọn (number từ DB hoặc null)
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  // State cho tin nhắn của hội thoại đang chọn
  const [activeMessages, setActiveMessages] = useState<Message[]>([defaultWelcomeMessage]);
  
  // State loading
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // State chat
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [streamingBotId, setStreamingBotId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy tiêu đề của hội thoại đang active
  const activeConversationTitle = conversations.find(c => c.id === activeConversationId)?.title || 'Hội thoại mới';

  // --- Effects ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  // MỚI: Effect tải danh sách hội thoại khi mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const apiConvos = await ragService.getConversations();
        
        // Map sang interface của FE
        const feConvos = apiConvos.map(c => ({ id: c.id, title: c.title }));
        setConversations(feConvos);

        // Tự động chọn hội thoại đầu tiên (mới nhất)
        if (feConvos.length > 0) {
          setActiveConversationId(feConvos[0].id);
        } else {
          // Nếu không có hội thoại nào, set là chat mới
          setActiveConversationId(null);
          setActiveMessages([defaultWelcomeMessage]);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
        // Có thể thêm state báo lỗi
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, []); // Chỉ chạy 1 lần khi mount

  // MỚI: Effect tải tin nhắn khi activeConversationId thay đổi
  useEffect(() => {
    const loadMessages = async (convoId: number) => {
      try {
        setIsLoadingMessages(true);
        setActiveMessages([]); // Xóa tin nhắn cũ
        const apiMessages = await ragService.getMessages(convoId);

        // Map ApiMessage sang Message (interface của FE)
        const feMessages = apiMessages.map((msg): Message => ({
          id: msg.id.toString(),
          content: msg.content,
          isBot: msg.type === 'chatbot',
          timestamp: new Date(msg.created_at) // Dùng timestamp từ DB
        }));
        
        setActiveMessages(feMessages);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setActiveMessages([
          { id: 'err-1', content: 'Lỗi: Không tải được lịch sử tin nhắn.', isBot: true, timestamp: new Date() }
        ]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    if (activeConversationId !== null) {
      // Nếu là hội thoại đã có (ID là number), tải tin nhắn
      loadMessages(activeConversationId);
    } else {
      // Nếu là hội thoại mới (ID là null), reset về tin nhắn chào mừng
      setActiveMessages([defaultWelcomeMessage]);
      setIsLoadingMessages(false);
    }
  }, [activeConversationId]); // Chạy mỗi khi đổi hội thoại


  // --- Logic Functions ---

  // Vẫn giữ nguyên, dùng để gửi context
  // const buildContext = (messages: Message[]): string => {
  //   return messages
  //     .slice(1) 
  //     .slice(-10) 
  //     .map(msg => `${msg.isBot ? 'Bot' : 'User'}: ${msg.content}`)
  //     .join('\n');
  // };
  
  // CẬP NHẬT: Đơn giản là set ID về null
  const handleNewChat = () => {
    if (isProcessing) return; // Không cho tạo chat mới khi đang xử lý
    setActiveConversationId(null);
    setInputMessage('');
  };

  // CẬP NHẬT: Đơn giản là set ID
  const handleSelectChat = (id: number) => {
    if (isProcessing) return; // Không cho đổi chat khi đang xử lý
    setActiveConversationId(id);
  };
  
  // CẬP NHẬT: Hàm helper chỉ cập nhật state activeMessages
  const addMessageToActiveState = (message: Message) => {
    setActiveMessages(prev => [...prev, message]);
  };

  // CẬP NHẬT: Hàm helper chỉ cập nhật state activeMessages
  const updateStreamingMessageInState = (botId: string, chunk: string) => {
    setActiveMessages(prev => prev.map(msg =>
      msg.id === botId ? { ...msg, content: msg.content + chunk } : msg
    ));
  };
  
  // MỚI: Hàm tải lại danh sách hội thoại (sau khi tạo mới)
  const refreshConversations = async (): Promise<number | null> => {
    try {
      const apiConvos = await ragService.getConversations();
      const feConvos = apiConvos.map(c => ({ id: c.id, title: c.title }));
      setConversations(feConvos);
      
      // Trả về ID của hội thoại mới nhất
      return feConvos.length > 0 ? feConvos[0].id : null;
    } catch (error) {
      console.error("Failed to refresh conversations:", error);
      return null;
    }
  };


  // CẬP NHẬT: processMessageQueue
  const processMessageQueue = async () => {
    if (messageQueue.length > 0) {
      setTimeout(async () => {
        const nextMessage = messageQueue[0];
        setMessageQueue((prev) => prev.slice(1));

        const userMessage: Message = {
          id: Date.now().toString(),
          content: nextMessage,
          isBot: false,
          timestamp: new Date()
        };

        addMessageToActiveState(userMessage); // Cập nhật state
        setIsProcessing(true);
        setIsTyping(true);

        const botId = (Date.now() + 1).toString();
        setStreamingBotId(botId);

        //const currentContext = buildContext(activeMessages);
        const wasNewChat = activeConversationId === null;

        try {
          let hasReceivedContent = false;
          
          await ragService.streamRAG(
            nextMessage, 
            //currentContext, 
            activeConversationId, // Gửi ID (number | null)
            (chunk) => {
              if (!hasReceivedContent) {
                hasReceivedContent = true;
                setIsTyping(false);
                addMessageToActiveState({
                  id: botId, 
                  content: chunk, 
                  isBot: true,
                  timestamp: new Date()
                });
              } else {
                updateStreamingMessageInState(botId, chunk);
              }
            }
          );

          if (!hasReceivedContent) {
            setIsTyping(false);
            addMessageToActiveState({
              id: botId,
              content: "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.",
              isBot: true,
              timestamp: new Date()
            });
          }

          // MỚI: Nếu đây là tin nhắn đầu của chat mới, tải lại convos
          if (wasNewChat) {
            const newConvoId = await refreshConversations();
            if (newConvoId) {
              setActiveConversationId(newConvoId);
            }
          }

          setStreamingBotId(null);
          setIsProcessing(false);
          await processMessageQueue(); // Đệ quy gọi tin nhắn tiếp theo
        } catch (error) {
          setIsTyping(false);
          setStreamingBotId(null);
          setIsProcessing(false);
          addMessageToActiveState({
            id: (Date.now() + 2).toString(),
            content: "❌ Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn.",
            isBot: true,
            timestamp: new Date()
          });
        }
      }, 1000);
    }
  };

  // CẬP NHẬT: sendMessage
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (isProcessing) {
      setMessageQueue((prev) => [...prev, inputMessage.trim()]);
      setInputMessage('');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(), // ID tạm thời
      content: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    const currentMessage = inputMessage;
    
    addMessageToActiveState(userMessage); // Thêm vào state
    setInputMessage('');
    setIsProcessing(true);
    setIsTyping(true);

    const botId = (Date.now() + 1).toString();
    setStreamingBotId(botId);

    //const currentContext = buildContext(activeMessages);
    const wasNewChat = activeConversationId === null; // Kiểm tra xem có phải chat mới không

    try {
      let hasReceivedContent = false;

      await ragService.streamRAG(
        currentMessage, 
        //currentContext, 
        activeConversationId, // Gửi ID (number | null)
        (chunk) => {
          if (!hasReceivedContent) {
            hasReceivedContent = true;
            setIsTyping(false);
            addMessageToActiveState({
              id: botId, 
              content: chunk, 
              isBot: true,
              timestamp: new Date()
            });
          } else {
            updateStreamingMessageInState(botId, chunk);
          }
        }
      );

      if (!hasReceivedContent) {
        setIsTyping(false);
        addMessageToActiveState({
          id: botId,
          content: "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.",
          isBot: true,
          timestamp: new Date()
        });
      }
      
      // MỚI: Nếu đây là tin nhắn đầu của chat mới, tải lại convos
      if (wasNewChat) {
        const newConvoId = await refreshConversations();
        if (newConvoId) {
          setActiveConversationId(newConvoId); // Set ID mới
        }
      }

      setStreamingBotId(null);
      setIsProcessing(false);
      await processMessageQueue(); // Xử lý hàng đợi
    } catch (error) {
      setIsTyping(false);
      setStreamingBotId(null);
      setIsProcessing(false);
      addMessageToActiveState({
        id: (Date.now() + 2).toString(),
        content: "❌ Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn.",
        isBot: true,
        timestamp: new Date()
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- JSX ---
  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'row',
      bgcolor: '#f8fafc'
    }}>

      {/* ======================================== */}
      {/* Sidebar Lịch sử hội thoại         */}
      {/* ======================================== */}
      <Box sx={{
        width: 280,
        bgcolor: '#eef2f6',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}>
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewChat}
            disabled={isProcessing} // Disable khi đang xử lý
            sx={{
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#1d4ed8' },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Hội thoại mới
          </Button>
        </Box>
        <Divider sx={{ mx: 2 }} />

        {/* MỚI: Loading indicator cho sidebar */}
        {isLoadingConversations && <LinearProgress color="primary" />}

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {!isLoadingConversations && conversations.length === 0 && (
             <Typography sx={{ p: 2, textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
                Chưa có hội thoại nào.
             </Typography>
          )}

          <List sx={{ p: 1 }}>
            {conversations.map((convo) => (
              <ListItemButton
                key={convo.id}
                selected={convo.id === activeConversationId}
                onClick={() => handleSelectChat(convo.id)}
                disabled={isProcessing} // Disable khi đang xử lý
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: '#dbeafe',
                    color: '#1e40af',
                    '&:hover': {
                      bgcolor: '#bfdbfe'
                    }
                  }
                }}
              >
                <ListItemText 
                  primary={convo.title}
                  primaryTypographyProps={{ 
                    noWrap: true, 
                    fontWeight: 500,
                    fontSize: '0.9rem' 
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>

      {/* ======================================== */}
      {/* Khung Chat chính                   */}
      {/* ======================================== */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Paper elevation={1} sx={{ 
          p: 3, 
          borderRadius: 0, 
          bgcolor: '#3b82f6',
          color: 'white',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', width: 48, height: 48 }}>
              <RiRobot2Line size={24} color="white" />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                UET Assistant
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {activeConversationTitle} {/* Hiển thị tiêu đề động */}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Chat Area */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative' // Mới: Thêm để định vị loading
        }}>
          
          {/* MỚI: Loading indicator cho tin nhắn */}
          {isLoadingMessages && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
              <LinearProgress color="primary" />
            </Box>
          )}

          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            p: 3,
            '&::-webkit-scrollbar': { width: '4px', },
            '&::-webkit-scrollbar-track': { background: 'transparent', },
            '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '2px', },
          }}>
            {/* Render tin nhắn từ activeMessages */}
            {activeMessages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                  mb: 3,
                  alignItems: 'flex-end',
                  gap: 1.5
                }}
              >
                {message.isBot && (
                  <Avatar sx={{ bgcolor: '#3b82f6', width: 36, height: 36 }}>
                    <RiRobot2Line size={18} color="white" />
                  </Avatar>
                )}
                
                <Paper
                  elevation={1}
                  sx={{
                    p: 2.5,
                    maxWidth: '75%',
                    bgcolor: message.isBot ? '#ffffff' : '#3b82f6',
                    color: message.isBot ? '#1f2937' : '#ffffff',
                    borderRadius: message.isBot 
                      ? '16px 16px 16px 4px' 
                      : '16px 16px 4px 16px',
                    border: message.isBot ? '1px solid #e5e7eb' : 'none',
                    boxShadow: message.isBot 
                      ? '0 1px 3px rgba(0,0,0,0.05)' 
                      : '0 2px 8px rgba(59,130,246,0.3)'
                  }}
                >
                  {/* (Render Markdown/Typography giữ nguyên) */}
                  {message.isBot ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <Typography variant="body2" sx={{ mb: 0 }}>
                            {children}
                          </Typography>
                        ),
                        strong: ({ children }) => (
                          <Typography component="span" sx={{ fontWeight: 700 }}>
                            {children}
                          </Typography>
                        )
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <Typography variant="body2">
                      {message.content}
                    </Typography>
                  )}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.7, 
                      display: 'block', 
                      textAlign: 'right',
                      mt: 1,
                      fontSize: '0.7rem'
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Typography>
                </Paper>

                {!message.isBot && (
                  <Avatar sx={{ bgcolor: '#1e40af', width: 36, height: 36 }}>
                    <UserIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                )}
              </Box>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#3b82f6', width: 36, height: 36 }}>
                  <RiRobot2Line size={18} color="white" />
                </Avatar>
                <Paper elevation={1} sx={{ 
                  p: 2.5, 
                  borderRadius: '16px 16px 16px 4px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '20px'
                }}>
                  <Box className="typing-indicator" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box className="typing-dot"></Box>
                    <Box className="typing-dot"></Box>
                    <Box className="typing-dot"></Box>
                  </Box>
                </Paper>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Paper elevation={2} sx={{ 
            p: 3, 
            borderRadius: 0,
            borderTop: '1px solid #e5e7eb',
            bgcolor: '#ffffff'
          }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
              <TextField
                multiline
                maxRows={4}
                fullWidth
                placeholder="Nhập câu hỏi của bạn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isProcessing} // Chỉ disable khi đang xử lý (chờ BE)
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    bgcolor: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      borderColor: '#3b82f6'
                    },
                    '&.Mui-focused': {
                      borderColor: '#3b82f6',
                      boxShadow: '0 0 0 3px rgba(59,130,246,0.1)'
                    }
                  }
                }}
              />
              <IconButton
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isProcessing} // Disable khi rỗng hoặc đang xử lý
                sx={{
                  bgcolor: '#3b82f6',
                  color: 'white',
                  width: 52,
                  height: 52,
                  '&:hover': {
                    bgcolor: '#1d4ed8'
                  },
                  '&:disabled': {
                    bgcolor: '#d1d5db',
                    color: '#9ca3af'
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Box>

    </Box>
  );
};

export default AssistantPage;