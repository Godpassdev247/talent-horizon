/**
 * Firebase Messages Component
 * Real-time messaging using Firebase Firestore
 * WhatsApp/Telegram style chat UI
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, Paperclip, MessageSquare, ArrowLeft, 
  User, Check, CheckCheck, Image, File, X, Download
} from 'lucide-react';
import { useFirebaseMessaging } from '../hooks/useFirebaseMessaging';
import { FirebaseConversation, FirebaseMessage } from '../lib/firebase';
import { Timestamp } from 'firebase/firestore';

interface FirebaseMessagesProps {
  currentUser: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
  } | null;
}

// Format timestamp for display
const formatTime = (timestamp: Timestamp | null | undefined): string => {
  if (!timestamp) return '';
  try {
    const date = timestamp.toDate();
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

// Format full date for message bubbles
const formatMessageTime = (timestamp: Timestamp | null | undefined): string => {
  if (!timestamp) return '';
  try {
    const date = timestamp.toDate();
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
};

export function FirebaseMessages({ currentUser }: FirebaseMessagesProps) {
  const {
    conversations,
    messages,
    selectedConversation,
    loading,
    error,
    totalUnreadCount,
    selectConversation,
    sendNewMessage,
    markAsRead,
  } = useFirebaseMessaging(currentUser);

  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || sending) return;

    setSending(true);
    try {
      await sendNewMessage(messageInput.trim());
      setMessageInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const otherParticipant = conv.participants.find(p => p.id !== currentUser?.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherParticipant?.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get other participant in conversation
  const getOtherParticipant = (conv: FirebaseConversation & { id: string }) => {
    return conv.participants.find(p => p.id !== currentUser?.id) || conv.participants[0];
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Error loading messages</p>
          <p className="text-slate-400 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No messages yet</p>
          <p className="text-slate-400 text-sm mt-2">When employers contact you, their messages will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#f5f7fa] flex-col md:flex-row">
      {/* Left Panel - Conversations List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] lg:w-[360px] flex-col bg-white border-r border-[#e5e7eb] flex-shrink-0`}>
        {/* Header */}
        <div className="p-5 border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#111827]">Messages</h2>
            {totalUnreadCount > 0 && (
              <span className="bg-[#ef4444] text-white text-xs font-bold px-2 py-1 rounded-full">
                {totalUnreadCount}
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af]" />
            <input 
              type="text"
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-3 pl-10 border border-[#d1d5db] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] focus:ring-[3px] focus:ring-[#6366f1]/10 transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => {
            const otherParticipant = getOtherParticipant(conv);
            const unreadCount = currentUser ? (conv.unreadCount?.[currentUser.id] || 0) : 0;
            const isSelected = selectedConversation?.id === conv.id;

            return (
              <div 
                key={conv.id} 
                className={`flex gap-3 p-4 cursor-pointer border-b border-[#f3f4f6] transition-colors ${
                  isSelected 
                    ? 'bg-[#eff6ff] border-l-[3px] border-l-[#3b82f6]' 
                    : 'hover:bg-[#f9fafb]'
                } ${unreadCount > 0 ? 'bg-[#fefce8]' : ''}`}
                onClick={() => selectConversation(conv.id)}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-semibold text-lg">
                    {otherParticipant.name.charAt(0).toUpperCase()}
                  </div>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4444] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold text-[#111827] truncate ${unreadCount > 0 ? 'font-bold' : ''}`}>
                      {otherParticipant.name}
                    </span>
                    <span className="text-xs text-[#9ca3af] flex-shrink-0 ml-2">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${unreadCount > 0 ? 'text-[#111827] font-medium' : 'text-[#6b7280]'}`}>
                    {conv.lastSenderId === currentUser?.id && (
                      <span className="text-[#9ca3af]">You: </span>
                    )}
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Chat View */}
      <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[#e5e7eb] bg-white">
              <button 
                className="md:hidden p-2 hover:bg-[#f3f4f6] rounded-lg"
                onClick={() => selectConversation('')}
              >
                <ArrowLeft className="w-5 h-5 text-[#6b7280]" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-semibold">
                {getOtherParticipant(selectedConversation).name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#111827] truncate">
                  {getOtherParticipant(selectedConversation).name}
                </h3>
                <p className="text-xs text-[#6b7280]">
                  {getOtherParticipant(selectedConversation).role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#f0f2f5]">
              <div className="space-y-3">
                {messages.map((msg) => {
                  const isOwn = msg.senderId === currentUser?.id;
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`relative max-w-[75%] px-4 py-2 rounded-2xl ${
                          isOwn 
                            ? 'bg-[#667eea] text-white rounded-br-md' 
                            : 'bg-white text-[#111827] rounded-bl-md shadow-sm'
                        }`}
                      >
                        {/* Message tail */}
                        <div 
                          className={`absolute bottom-0 w-3 h-3 ${
                            isOwn 
                              ? 'right-[-6px] bg-[#667eea]' 
                              : 'left-[-6px] bg-white'
                          }`}
                          style={{
                            clipPath: isOwn 
                              ? 'polygon(0 0, 0% 100%, 100% 100%)' 
                              : 'polygon(100% 0, 0% 100%, 100% 100%)'
                          }}
                        />
                        
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        
                        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-white/70' : 'text-[#9ca3af]'}`}>
                          <span className="text-[10px]">{formatMessageTime(msg.timestamp)}</span>
                          {isOwn && (
                            msg.isRead 
                              ? <CheckCheck className="w-3.5 h-3.5" />
                              : <Check className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-[#e5e7eb] bg-white">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full py-3 px-4 pr-12 border border-[#d1d5db] rounded-2xl text-sm resize-none focus:outline-none focus:border-[#6366f1] focus:ring-[3px] focus:ring-[#6366f1]/10 transition-all max-h-32"
                    style={{ minHeight: '48px' }}
                  />
                  <button 
                    className="absolute right-3 bottom-3 p-1 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sending}
                  className={`p-3 rounded-full transition-all ${
                    messageInput.trim() && !sending
                      ? 'bg-[#667eea] text-white hover:bg-[#5a6fd6]'
                      : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#f9fafb]">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#f3f4f6] flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-[#9ca3af]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Select a conversation</h3>
              <p className="text-sm text-[#6b7280]">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FirebaseMessages;
