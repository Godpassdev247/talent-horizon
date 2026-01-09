/**
 * Firebase Messages Component
 * Real-time messaging using Firebase Firestore
 * Mobile-first responsive chat UI with white/blue theme
 */

import { useState, useEffect, useRef } from 'react';
// v2 - Updated bubble colors: dark for received, blue for sent
import { 
  Search, Send, ArrowLeft, MessageSquare, Check, CheckCheck
} from 'lucide-react';
import { useFirebaseMessaging } from '../hooks/useFirebaseMessaging';
import { FirebaseConversation } from '../lib/firebase';
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
  } = useFirebaseMessaging(currentUser);

  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message (reply in same conversation)
  const handleSendMessage = async () => {
    if (!messageInput.trim() || sending || !selectedConversation) return;

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

  // Handle conversation selection
  const handleSelectConversation = (convId: string) => {
    selectConversation(convId);
    setShowMobileChat(true);
  };

  // Handle back button on mobile
  const handleBackToList = () => {
    setShowMobileChat(false);
    selectConversation('');
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
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center px-4">
          <MessageSquare className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Error loading messages</p>
          <p className="text-slate-400 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-blue-500" />
          </div>
          <p className="text-slate-700 font-semibold text-lg">No messages yet</p>
          <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
            When employers contact you about job opportunities, their messages will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="firebase-messages" className="h-full flex bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Left Panel - Conversations List */}
      <div className={`${showMobileChat ? 'hidden' : 'flex'} md:flex w-full md:w-[320px] lg:w-[340px] flex-col bg-white border-r border-blue-100 flex-shrink-0`}>
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            {totalUnreadCount > 0 && (
              <span className="bg-white text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                {totalUnreadCount}
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
            <input 
              type="text"
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-3 pl-10 bg-blue-500/30 border-0 rounded-full text-sm text-white placeholder-blue-200 focus:outline-none focus:bg-blue-500/50 focus:ring-2 focus:ring-white/30 transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto bg-white">
          {filteredConversations.map((conv) => {
            const otherParticipant = getOtherParticipant(conv);
            const unreadCount = currentUser ? (conv.unreadCount?.[currentUser.id] || 0) : 0;
            const isSelected = selectedConversation?.id === conv.id;

            return (
              <div 
                key={conv.id} 
                className={`flex gap-3 p-4 cursor-pointer border-b border-slate-100 transition-all active:scale-[0.98] ${
                  isSelected 
                    ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                } ${unreadCount > 0 ? 'bg-blue-50/50' : ''}`}
                onClick={() => handleSelectConversation(conv.id)}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                    {otherParticipant.name.charAt(0).toUpperCase()}
                  </div>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold text-slate-800 truncate ${unreadCount > 0 ? 'font-bold' : ''}`}>
                      {otherParticipant.name}
                    </span>
                    <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${unreadCount > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                    {conv.lastSenderId === currentUser?.id && (
                      <span className="text-blue-500">You: </span>
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
      <div className={`${showMobileChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-gradient-to-b from-blue-50/50 to-white overflow-hidden`}>
        {selectedConversation ? (
          <div className="flex flex-col h-full">
            {/* Chat Header - Fixed at top */}
            <div className="flex-shrink-0 flex items-center gap-3 p-4 bg-white border-b border-blue-100 shadow-sm z-10">
              <button 
                className="md:hidden p-2 hover:bg-blue-50 rounded-full transition-colors active:scale-95"
                onClick={handleBackToList}
              >
                <ArrowLeft className="w-5 h-5 text-blue-600" />
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {getOtherParticipant(selectedConversation).name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">
                  {getOtherParticipant(selectedConversation).name}
                </h3>
                <p className="text-xs text-blue-500 font-medium">
                  {getOtherParticipant(selectedConversation).role === 'admin' ? 'Recruiter' : 'Job Seeker'}
                </p>
              </div>
            </div>

            {/* Messages Area - Scrollable middle section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/50 min-h-0">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-slate-500 text-sm">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === currentUser?.id;
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`relative max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl ${
                          isOwn 
                            ? 'rounded-br-md' 
                            : 'rounded-bl-md'
                        }`}
                        style={{
                          backgroundColor: isOwn ? '#3b82f6' : '#334155',
                          color: 'white'
                        }}
                      >
                        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-blue-100' : 'text-slate-300'}`}>
                          <span className="text-[11px]">
                            {formatMessageTime(msg.timestamp)}
                          </span>
                          {isOwn && (
                            msg.read 
                              ? <CheckCheck className="w-3.5 h-3.5" />
                              : <Check className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="flex-shrink-0 p-3 sm:p-4 bg-white border-t border-blue-100 z-10">
              <div className="flex items-end gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <textarea
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all max-h-32 overflow-y-auto"
                    style={{ minHeight: '48px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sending}
                  className={`p-3 rounded-full transition-all active:scale-95 shadow-md ${
                    messageInput.trim() && !sending
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* No conversation selected - Desktop only */
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Select a conversation</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Choose a conversation from the list to view and reply to messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
