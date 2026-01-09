/**
 * Real-Time Messages Page
 * WhatsApp/Telegram-style instant messaging with WebSocket
 */

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { io, Socket } from 'socket.io-client';
import { 
  Send, Paperclip, Search, Check, CheckCheck, Clock, 
  ArrowLeft, MoreVertical, Phone, Video, Smile, Mic,
  Image as ImageIcon, File, X, MessageSquare
} from 'lucide-react';

interface Message {
  id: number;
  conversationId: string;
  senderId: number;
  senderName: string;
  recipientId: number;
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl: string | null;
  fileName: string | null;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt: string;
}

interface Conversation {
  id: string;
  recipientId: number;
  recipientName: string;
  recipientEmail: string;
  lastMessage: string | null;
  lastMessageType: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  isOnline: boolean;
}

export default function MessagesPage() {
  const [, setLocation] = useLocation();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('frontendToken') || localStorage.getItem('token');
    if (!token) {
      setLocation('/login');
      return;
    }

    // Decode token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.userId);
      setCurrentUserName(payload.name || 'User');
    } catch (e) {
      console.error('Invalid token');
      setLocation('/login');
      return;
    }

    const socketUrl = window.location.origin;
    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      newSocket.emit('get_conversations');
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Handle conversations list
    newSocket.on('conversations_list', (convs: Conversation[]) => {
      console.log('Received conversations:', convs);
      setConversations(convs);
    });

    // Handle messages list
    newSocket.on('messages_list', ({ conversationId, messages: msgs }: { conversationId: string; messages: Message[] }) => {
      console.log('Received messages for', conversationId, msgs);
      setMessages(msgs);
    });

    // Handle new message
    newSocket.on('new_message', (message: Message) => {
      console.log('New message received:', message);
      
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      
      // Update conversations list
      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: message.content,
              lastMessageType: message.messageType,
              lastMessageAt: message.createdAt,
              unreadCount: conv.unreadCount + 1,
            };
          }
          return conv;
        });
        return updated.sort((a, b) => {
          const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return timeB - timeA;
        });
      });
    });

    // Handle message sent confirmation
    newSocket.on('message_sent', (message: Message) => {
      console.log('Message sent confirmed:', message);
      
      setMessages(prev => {
        // Remove any temporary message and add the confirmed one
        const filtered = prev.filter(m => m.id !== -1);
        if (filtered.some(m => m.id === message.id)) return filtered;
        return [...filtered, message];
      });
      
      // Update conversations
      setConversations(prev => {
        const exists = prev.some(conv => conv.id === message.conversationId);
        if (!exists) {
          newSocket.emit('get_conversations');
          return prev;
        }
        
        return prev.map(conv => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: message.content,
              lastMessageType: message.messageType,
              lastMessageAt: message.createdAt,
            };
          }
          return conv;
        }).sort((a, b) => {
          const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return timeB - timeA;
        });
      });
    });

    // Handle message status updates
    newSocket.on('message_delivered', ({ messageId }: { messageId: number }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'delivered' } : msg
      ));
    });

    newSocket.on('messages_read', ({ conversationId }: { conversationId: string }) => {
      setMessages(prev => prev.map(msg => 
        msg.conversationId === conversationId ? { ...msg, status: 'read' } : msg
      ));
    });

    // Handle typing indicators
    newSocket.on('user_typing', ({ userId }: { userId: number }) => {
      setTypingUsers(prev => new Set(prev).add(userId));
      setTimeout(() => {
        setTypingUsers(prev => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }, 3000);
    });

    newSocket.on('user_stopped_typing', ({ userId }: { userId: number }) => {
      setTypingUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    // Handle online status
    newSocket.on('user_online', ({ userId }: { userId: number }) => {
      setConversations(prev => prev.map(conv => 
        conv.recipientId === userId ? { ...conv, isOnline: true } : conv
      ));
    });

    newSocket.on('user_offline', ({ userId }: { userId: number }) => {
      setConversations(prev => prev.map(conv => 
        conv.recipientId === userId ? { ...conv, isOnline: false } : conv
      ));
    });

    newSocket.on('error', ({ message }: { message: string }) => {
      console.error('WebSocket error:', message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [setLocation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (socket && currentConversation) {
      socket.emit('typing_start', { 
        conversationId: currentConversation.id, 
        recipientId: currentConversation.recipientId 
      });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { 
          conversationId: currentConversation.id, 
          recipientId: currentConversation.recipientId 
        });
      }, 2000);
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentConversation || !socket) return;
    
    // Add temporary message for instant feedback
    const tempMessage: Message = {
      id: -1,
      conversationId: currentConversation.id,
      senderId: currentUserId,
      senderName: currentUserName,
      recipientId: currentConversation.recipientId,
      content: messageInput.trim(),
      messageType: 'text',
      fileUrl: null,
      fileName: null,
      status: 'sending',
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, tempMessage]);
    
    socket.emit('send_message', { 
      recipientId: currentConversation.recipientId, 
      content: messageInput.trim(),
      messageType: 'text'
    });
    
    setMessageInput('');
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Select conversation
  const handleSelectConversation = (conv: Conversation) => {
    setCurrentConversation(conv);
    setMessages([]);
    setShowMobileChat(true);
    
    if (socket) {
      socket.emit('get_messages', { conversationId: conv.id });
      socket.emit('mark_read', { conversationId: conv.id });
      
      // Update unread count locally
      setConversations(prev => prev.map(c => 
        c.id === conv.id ? { ...c, unreadCount: 0 } : c
      ));
    }
  };

  // Format time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get status icon
  const getStatusIcon = (status: string, senderId: number) => {
    if (senderId !== currentUserId) return null;
    
    switch (status) {
      case 'sending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv =>
    conv.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.recipientEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Total unread
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* CSS for message bubbles */}
      <style>{`
        .msg-sent {
          background: #2563eb;
          color: white;
          border-radius: 18px 18px 4px 18px;
          position: relative;
          max-width: 85%;
          word-wrap: break-word;
        }
        .msg-sent::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: -8px;
          width: 0;
          height: 0;
          border: 8px solid transparent;
          border-left-color: #2563eb;
          border-bottom-color: #2563eb;
          border-right: 0;
          border-bottom: 0;
        }
        .msg-received {
          background: #1f2937;
          color: white;
          border-radius: 18px 18px 18px 4px;
          position: relative;
          max-width: 85%;
          word-wrap: break-word;
        }
        .msg-received::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -8px;
          width: 0;
          height: 0;
          border: 8px solid transparent;
          border-right-color: #1f2937;
          border-bottom-color: #1f2937;
          border-left: 0;
          border-bottom: 0;
        }
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 8px 12px;
        }
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #9ca3af;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLocation('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          {totalUnread > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalUnread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-500">{isConnected ? 'Connected' : 'Connecting...'}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className={`w-full md:w-96 bg-white border-r border-gray-200 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-center font-medium">No conversations yet</p>
                <p className="text-sm text-center mt-1">Messages will appear here</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    currentConversation?.id === conv.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {conv.recipientName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {conv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 ml-3 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 truncate">{conv.recipientName || 'Unknown'}</h3>
                      {conv.lastMessageAt && (
                        <span className="text-xs text-gray-500">{formatTime(conv.lastMessageAt)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage || 'No messages yet'}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-gray-50 ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden mr-3 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {currentConversation.recipientName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {currentConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">{currentConversation.recipientName}</h3>
                    <p className="text-xs text-gray-500">
                      {currentConversation.isOnline ? (
                        <span className="text-green-500">Online</span>
                      ) : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => {
                  const isSent = msg.senderId === currentUserId;
                  const showDate = index === 0 || 
                    formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);

                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${isSent ? 'msg-sent' : 'msg-received'} px-4 py-2 shadow-sm`}>
                          {msg.messageType === 'image' && msg.fileUrl && (
                            <img src={msg.fileUrl} alt="Shared" className="max-w-xs rounded-lg mb-2" />
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs opacity-70">{formatTime(msg.createdAt)}</span>
                            {getStatusIcon(msg.status, msg.senderId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {typingUsers.size > 0 && (
                  <div className="flex justify-start">
                    <div className="msg-received px-4 py-2">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Smile className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Paperclip className="w-6 h-6" />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {messageInput.trim() ? (
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  ) : (
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                      <Mic className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-24 h-24 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
              <p className="text-sm text-center max-w-xs">Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
