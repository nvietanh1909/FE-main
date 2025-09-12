import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiUpload, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { Avatar, Badge, IconButton, Tooltip } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import "../assets/styles/chatbot.css";

// RAG Service
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

  async uploadDocument(
    file: File
  ): Promise<{ message: string; filename: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Upload Error:", error);
      throw new Error("Không thể upload tài liệu");
    }
  }
}

const ragService = new RAGService();

export default function ChatBot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý thông minh RAG của bạn. Bạn có thể upload tài liệu và hỏi tôi về nội dung đó!",
      isBot: true,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [streamingBotId, setStreamingBotId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      if (isProcessing) {
        setMessageQueue((prev) => [...prev, message.trim()]);
        setMessage("");
        return;
      }

      const userMessage = {
        id: Date.now(),
        text: message,
        isBot: false,
      };

      const currentMessage = message;
      setMessages((prev) => [...prev, userMessage]);
      setMessage("");
      setIsProcessing(true);
      setIsTyping(true);

      const botId = Date.now() + 1;
      setStreamingBotId(botId);

      try {
        let hasReceivedContent = false;

        await ragService.streamRAG(currentMessage, selectedFile, (chunk) => {
          if (!hasReceivedContent) {
            // Lần đầu nhận content, tạo bot message và tắt typing
            hasReceivedContent = true;
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              { id: botId, text: chunk, isBot: true },
            ]);
          } else {
            // Update nội dung bot message
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botId ? { ...msg, text: msg.text + chunk } : msg
              )
            );
          }
        });

        // Nếu không nhận được content nào, hiển thị lỗi
        if (!hasReceivedContent) {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: botId,
              text: "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.",
              isBot: true,
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

        const errorResponse = {
          id: Date.now(),
          text: "❌ Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn.",
          isBot: true,
        };
        setMessages((prev) => [...prev, errorResponse]);
      }
    }
  };

  const processMessageQueue = async () => {
    if (messageQueue.length > 0) {
      setTimeout(async () => {
        const nextMessage = messageQueue[0];
        setMessageQueue((prev) => prev.slice(1));

        const userMessage = {
          id: Date.now(),
          text: nextMessage,
          isBot: false,
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsProcessing(true);
        setIsTyping(true);

        const botId = Date.now() + 1;
        setStreamingBotId(botId);

        try {
          let hasReceivedContent = false;

          await ragService.streamRAG(nextMessage, selectedFile, (chunk) => {
            if (!hasReceivedContent) {
              hasReceivedContent = true;
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                { id: botId, text: chunk, isBot: true },
              ]);
            } else {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botId ? { ...msg, text: msg.text + chunk } : msg
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
                text: "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.",
                isBot: true,
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

          const errorResponse = {
            id: Date.now(),
            text: "❌ Có lỗi xảy ra với tin nhắn trong hàng đợi.",
            isBot: true,
          };
          setMessages((prev) => [...prev, errorResponse]);
        }
      }, 500);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await ragService.uploadDocument(file);

      setSelectedFile(result.filename);

      const successMessage = {
        id: Date.now(),
        text: `✅ **Đã upload thành công tài liệu:** ${result.filename}\n\nBây giờ bạn có thể hỏi tôi về nội dung trong tài liệu này!`,
        isBot: true,
      };

      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        text: "❌ **Không thể upload tài liệu.** Vui lòng kiểm tra định dạng file (PDF, TXT, DOCX) và thử lại.",
        isBot: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        height: isExpanded ? "90vh" : "700px",
        width: isExpanded ? "95vw" : "100%",
        position: isExpanded ? "fixed" : "relative",
        top: isExpanded ? "5vh" : "auto",
        left: isExpanded ? "2.5vw" : "auto",
        zIndex: isExpanded ? 1000 : 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow:
          isExpanded
            ? "0 20px 60px rgba(0, 0, 0, 0.3)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Header chatbot */}
      <div
        style={{
          background: "#f8f9fa",
          color: "#374151",
          padding: "16px",
          fontWeight: 800,
          fontSize: "20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#44b883",
                color: "#44b883",
                boxShadow: `0 0 0 2px #f8f9fa`,
                "&::after": {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  animation: "ripple 1.2s infinite ease-in-out",
                  border: "1px solid currentColor",
                  content: '""',
                },
              },
              "@keyframes ripple": {
                "0%": {
                  transform: "scale(.8)",
                  opacity: 1,
                },
                "100%": {
                  transform: "scale(2.4)",
                  opacity: 0,
                },
              },
            }}
          >
            <Avatar sx={{ bgcolor: "#3b82f6", width: 40, height: 40 }}>
              <RiRobot2Line size={20} />
            </Avatar>
          </Badge>
          <div>
            <div>Trợ lý RAG</div>
            {selectedFile && (
              <div
                style={{ fontSize: "12px", color: "#6b7280", fontWeight: 400 }}
              >
                📄 {selectedFile}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.docx"
            style={{ display: "none" }}
          />
          <Tooltip title="Upload tài liệu (PDF, TXT, DOCX)">
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isProcessing}
              sx={{
                bgcolor: "#3b82f6",
                color: "white",
                "&:hover": { bgcolor: "#2563eb" },
                "&:disabled": { bgcolor: "#d1d5db" },
              }}
            >
              <FiUpload size={18} />
            </IconButton>
          </Tooltip>

          <Tooltip title={isExpanded ? "Thu gọn" : "Mở rộng"}>
            <IconButton
              onClick={toggleExpand}
              sx={{
                bgcolor: "#6b7280",
                color: "white",
                "&:hover": { bgcolor: "#4b5563" },
              }}
            >
              {isExpanded ? (
                <FiMinimize2 size={18} />
              ) : (
                <FiMaximize2 size={18} />
              )}
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Chat messages area */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          backgroundColor: "#f9fafb",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "12px",
              flexDirection: msg.isBot ? "row" : "row-reverse",
            }}
          >
            {msg.isBot && (
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#44b883",
                    color: "#44b883",
                    boxShadow: `0 0 0 2px #f9fafb`,
                    width: 8,
                    height: 8,
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#3b82f6",
                    width: 32,
                    height: 32,
                    fontSize: "14px",
                  }}
                >
                  <RiRobot2Line size={16} />
                </Avatar>
              </Badge>
            )}

            <div
              style={{
                background: msg.isBot ? "#ffffff" : "#3b82f6",
                color: msg.isBot ? "#374151" : "#ffffff",
                padding: "16px 20px",
                borderRadius: "18px",
                maxWidth: "90%",
                fontSize: "14px",
                lineHeight: "1.6",
                wordWrap: "break-word",
                border: msg.isBot ? "1px solid #e5e7eb" : "none",
                boxShadow: msg.isBot ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                overflow: "auto",
              }}
            >
              {msg.isBot ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneLight}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className={className}
                          style={{
                            background: "#f1f3f4",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.9em",
                          }}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => (
                      <h1
                        style={{
                          fontSize: "1.5em",
                          marginBottom: "12px",
                          color: "#1f2937",
                          fontWeight: "bold",
                        }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2
                        style={{
                          fontSize: "1.3em",
                          marginBottom: "10px",
                          color: "#1f2937",
                          fontWeight: "bold",
                        }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        style={{
                          fontSize: "1.2em",
                          marginBottom: "8px",
                          color: "#1f2937",
                          fontWeight: "bold",
                        }}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p style={{ marginBottom: "12px", lineHeight: "1.6" }}>
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul style={{ marginLeft: "20px", marginBottom: "12px" }}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol style={{ marginLeft: "20px", marginBottom: "12px" }}>
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li style={{ marginBottom: "4px", lineHeight: "1.5" }}>
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote
                        style={{
                          borderLeft: "4px solid #3b82f6",
                          marginLeft: "0",
                          paddingLeft: "16px",
                          background: "#f8f9fa",
                          padding: "12px 16px",
                          borderRadius: "4px",
                          fontStyle: "italic",
                          color: "#6b7280",
                          marginBottom: "12px",
                        }}
                      >
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong style={{ fontWeight: "700", color: "#1f2937" }}>
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em style={{ fontStyle: "italic", color: "#4b5563" }}>
                        {children}
                      </em>
                    ),
                    table: ({ children }) => (
                      <div style={{ overflowX: "auto", marginBottom: "16px" }}>
                        <table
                          style={{
                            borderCollapse: "collapse",
                            width: "100%",
                            minWidth: "500px",
                            fontSize: "13px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            overflow: "hidden",
                          }}
                        >
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead style={{ backgroundColor: "#f8f9fa" }}>
                        {children}
                      </thead>
                    ),
                    th: ({ children }) => (
                      <th
                        style={{
                          border: "1px solid #e5e7eb",
                          padding: "12px 16px",
                          backgroundColor: "#f1f3f4",
                          fontWeight: "600",
                          textAlign: "left",
                          color: "#374151",
                        }}
                      >
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td
                        style={{
                          border: "1px solid #e5e7eb",
                          padding: "12px 16px",
                          backgroundColor: "#ffffff",
                          color: "#374151",
                        }}
                      >
                        {children}
                      </td>
                    ),
                    tr: ({ children }) => (
                      <tr
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {children}
                      </tr>
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator - chỉ hiển thị khi isTyping = true */}
        {(isTyping || isUploading) && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "12px",
              flexDirection: "row",
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#44b883",
                  color: "#44b883",
                  boxShadow: `0 0 0 2px #f9fafb`,
                  width: 8,
                  height: 8,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#3b82f6",
                  width: 32,
                  height: 32,
                  fontSize: "14px",
                }}
              >
                <RiRobot2Line size={16} />
              </Avatar>
            </Badge>

            <div
              style={{
                background: "#ffffff",
                color: "#6b7280",
                padding: "16px 20px",
                borderRadius: "18px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "20px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {isUploading ? (
                <span>Đang upload tài liệu...</span>
              ) : (
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f3f4f6",
            borderRadius: "28px",
            padding: "6px",
            border: "1px solid #d1d5db",
            gap: "8px",
          }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isUploading
                ? "Đang upload..."
                : isProcessing
                ? "Đang xử lý tin nhắn..."
                : selectedFile
                ? `Hỏi về ${selectedFile}...`
                : "Nhập tin nhắn hoặc upload tài liệu để bắt đầu..."
            }
            disabled={isProcessing || isUploading}
            rows={1}
            style={{
              flex: 1,
              padding: "14px 20px",
              border: "none",
              borderRadius: "22px",
              fontSize: "14px",
              outline: "none",
              backgroundColor: "transparent",
              color: isProcessing || isUploading ? "#9ca3af" : "inherit",
              resize: "none",
              fontFamily: "inherit",
              lineHeight: "1.4",
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isProcessing || isUploading}
            style={{
              background:
                message.trim() && !isProcessing && !isUploading
                  ? "#3b82f6"
                  : "#d1d5db",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              cursor:
                message.trim() && !isProcessing && !isUploading
                  ? "pointer"
                  : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <FiSend size={18} />
          </button>
        </div>

        {/* Queue indicator */}
        {messageQueue.length > 0 && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "13px",
              color: "#6b7280",
              textAlign: "center",
              background: "#f9fafb",
              padding: "8px 12px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
            }}
          >
            📋 Có {messageQueue.length} tin nhắn đang chờ xử lý...
          </div>
        )}
      </div>
    </div>
  );
}
