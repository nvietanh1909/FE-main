import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Avatar, CircularProgress } from '@mui/material';
import { Send as SendIcon, Person as UserIcon } from '@mui/icons-material';
import { RiRobot2Line } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';

// Copy RAGService class from ChatBot.tsx
class RAGService { 
  private baseUrl = "https://umentor.duckdns.org/api";
  
  async queryRAG(message: string, context: string): Promise<string> {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('https://umentor.duckdns.org/api/chatbot/ask', {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          context: context
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return result.response;
    } catch (error) {
      console.error("RAG Query Error:", error);
      throw new Error("Không thể kết nối với RAG service");
    }
  }

  async streamRAG(
    query: string,
    filename?: string,
    onChunk?: (chunk: string) => void
  ): Promise<void> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/chatbot/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, },
      body: JSON.stringify({
        message: query,
        context: ""
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

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Xin chào quý thầy cô! Quý thầy cô cần hỗ trợ gì trong quy trình thủ tục hành chính?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [streamingBotId, setStreamingBotId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

        setMessages((prev) => [...prev, userMessage]);
        setIsProcessing(true);
        setIsTyping(true);

        const botId = (Date.now() + 1).toString();
        setStreamingBotId(botId);

        try {
          let hasReceivedContent = false;

          await ragService.streamRAG(nextMessage, undefined, (chunk) => {
            if (!hasReceivedContent) {
              hasReceivedContent = true;
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                { 
                  id: botId, 
                  content: chunk, 
                  isBot: true,
                  timestamp: new Date()
                },
              ]);
            } else {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botId ? { ...msg, content: msg.content + chunk } : msg
                )
              );
            }
          });

          if (!hasReceivedContent) {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: botId,
                content: "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.",
                isBot: true,
                timestamp: new Date()
              },
            ]);
          }

          setStreamingBotId(null);
          setIsProcessing(false);
          await processMessageQueue();
        } catch (error) {
          setIsTyping(false);
          setStreamingBotId(null);
          setIsProcessing(false);

          const errorResponse: Message = {
            id: (Date.now() + 2).toString(),
            content: "❌ Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn.",
            isBot: true,
            timestamp: new Date()
          };
          setMessages((prev) => [...prev, errorResponse]);
        }
      }, 1000);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (isProcessing) {
      setMessageQueue((prev) => [...prev, inputMessage.trim()]);
      setInputMessage('');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    const currentMessage = inputMessage;
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);
    setIsTyping(true);

    const botId = (Date.now() + 1).toString();
    setStreamingBotId(botId);

    try {
      let hasReceivedContent = false;

      await ragService.streamRAG(currentMessage, undefined, (chunk) => {
        if (!hasReceivedContent) {
          hasReceivedContent = true;
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { 
              id: botId, 
              content: chunk, 
              isBot: true,
              timestamp: new Date()
            },
          ]);
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botId ? { ...msg, content: msg.content + chunk } : msg
            )
          );
        }
      });

      if (!hasReceivedContent) {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: botId,
            content: "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.",
            isBot: true,
            timestamp: new Date()
          },
        ]);
      }

      setStreamingBotId(null);
      setIsProcessing(false);
      await processMessageQueue();
    } catch (error) {
      setIsTyping(false);
      setStreamingBotId(null);
      setIsProcessing(false);

      const errorResponse: Message = {
        id: (Date.now() + 2).toString(),
        content: "❌ Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f8fafc'
    }}>
      {/* Header */}
      <Paper elevation={1} sx={{ 
        p: 3, 
        borderRadius: 0, 
        bgcolor: '#3b82f6',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(255,255,255,0.15)', 
            width: 48, 
            height: 48 
          }}>
            <RiRobot2Line size={24} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              UET Assistant
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Trợ lý thông minh hỗ trợ tra cứu quy trình và thủ tục
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Chat Area */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 3,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '2px',
          },
        }}>
          {messages.map((message) => (
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
                <Avatar sx={{ 
                  bgcolor: '#3b82f6', 
                  width: 36, 
                  height: 36 
                }}>
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
                <Avatar sx={{ 
                  bgcolor: '#1e40af', 
                  width: 36, 
                  height: 36 
                }}>
                  <UserIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
            </Box>
          ))}
          
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: '#3b82f6', 
                width: 36, 
                height: 36 
              }}>
                <RiRobot2Line size={18} color="white" />
              </Avatar>
              <Paper elevation={1} sx={{ 
                p: 2.5, 
                borderRadius: '16px 16px 16px 4px',
                border: '1px solid #e5e7eb'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Đang trả lời
                  </Typography>
                  <CircularProgress size={12} sx={{ color: '#3b82f6' }} />
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
              disabled={isTyping || isProcessing}
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
              disabled={!inputMessage.trim() || isTyping || isProcessing}
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
  );
};

export default AssistantPage;