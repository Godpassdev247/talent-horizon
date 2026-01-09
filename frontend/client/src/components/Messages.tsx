import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMessaging, Message, Conversation } from '../hooks/useMessaging';
import { Send, Paperclip, Image, Smile, Search, Check, CheckCheck, Clock, Mic, X, ArrowLeft } from 'lucide-react';

interface MessagesProps {
  currentUserId: number;
  currentUserName: string;
}

export function Messages({ currentUserId, currentUserName }: MessagesProps) {
  const {
    isConnected,
    conversations,
    messages,
    currentConversation,
    typingUsers,
    sendMessage,
    selectConversation,
    startTyping,
    stopTyping,
    refreshConversations,
  } = useMessaging();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (currentConversation) {
      startTyping(currentConversation.otherUserId);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(currentConversation.otherUserId);
      }, 2000);
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentConversation) return;
    
    sendMessage(currentConversation.otherUserId, messageInput.trim());
    setMessageInput('');
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    stopTyping(currentConversation.otherUserId);
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Format date for message groups
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Get message status icon
  const getStatusIcon = (status: string, senderId: number) => {
    if (senderId !== currentUserId) return null;
    
    switch (status) {
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

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUserEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get total unread count
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  // Select conversation and show mobile chat
  const handleSelectConversation = (conv: Conversation) => {
    selectConversation(conv);
    setShowMobileChat(true);
  };

  // Back to conversation list on mobile
  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="flex h-full bg-gray-50 rounded-lg overflow-hidden shadow-lg">
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

      {/* Conversations List */}
      <div className={`w-full md:w-96 bg-white border-r border-gray-200 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            {totalUnread > 0 && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {totalUnread}
              </span>
            )}
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-center">No conversations yet</p>
              <p className="text-sm text-center mt-1">Start a conversation with job seekers or employers</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  currentConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {conv.otherUserName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 truncate">{conv.otherUserName || 'Unknown'}</h3>
                    {conv.lastMessageAt && (
                      <span className="text-xs text-gray-500">{formatTime(conv.lastMessageAt)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessageSenderId === currentUserId && <span className="text-gray-400">You: </span>}
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
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
      <div className={`flex-1 flex flex-col bg-gray-100 ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center">
              <button
                onClick={handleBackToList}
                className="md:hidden mr-3 p-1 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {currentConversation.otherUserName?.charAt(0).toUpperCase() || '?'}
                </div>
                {currentConversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-800">{currentConversation.otherUserName}</h3>
                <p className="text-xs text-gray-500">
                  {currentConversation.isOnline ? (
                    <span className="text-green-500">Online</span>
                  ) : (
                    'Offline'
                  )}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => {
                const isSent = msg.senderId === currentUserId;
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);

                return (
                  <React.Fragment key={msg.id}>
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
                          <img 
                            src={msg.fileUrl} 
                            alt="Shared image" 
                            className="max-w-xs rounded-lg mb-2"
                          />
                        )}
                        {msg.messageType === 'file' && msg.fileUrl && (
                          <a 
                            href={msg.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-200 hover:text-blue-100 mb-2"
                          >
                            <Paperclip className="w-4 h-4" />
                            {msg.fileName || 'Download file'}
                          </a>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs opacity-70">{formatTime(msg.createdAt)}</span>
                          {getStatusIcon(msg.status, msg.senderId)}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
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
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <Smile className="w-6 h-6" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
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
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                    <Mic className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* No conversation selected */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Send className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
            <p className="text-sm text-center max-w-xs">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
