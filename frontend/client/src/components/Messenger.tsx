/**
 * Messenger Component for Talent Horizon
 * 
 * Responsive chat interface with conversation list and chat area
 * Supports real-time messaging, typing indicators, and presence
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useMessenger } from '@/contexts/messenger/MessengerContext';
import { formatDistanceToNow, formatMessageTime, getInitials } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Check, 
  CheckCheck, 
  Search,
  MessageCircle,
  Loader2,
  BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessengerProps {
  currentUser: {
    id: number | string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'employer';
  };
}

export default function Messenger({ currentUser }: MessengerProps) {
  const {
    conversations,
    currentConversation,
    currentMessages,
    currentChatPartner,
    isPartnerTyping,
    loading,
    selectConversation,
    sendMessage,
    setTyping,
    clearCurrentConversation
  } = useMessenger();

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userId = String(currentUser.id);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isPartnerTyping]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    setTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 2000);
  }, [setTyping]);

  // Handle message input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    handleTyping();
  };

  // Handle send message
  const handleSend = async () => {
    if (!message.trim() || isSending) return;
    
    const messageText = message.trim();
    setMessage('');
    setIsSending(true);
    
    try {
      await sendMessage(messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessage(messageText);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId);
    setShowChat(true);
  };

  // Handle back button
  const handleBack = () => {
    clearCurrentConversation();
    setShowChat(false);
  };

  // Render conversation list
  const renderConversationList = () => (
    <div className={`flex flex-col h-full bg-white ${showChat ? 'hidden md:flex' : 'flex'} md:w-80 lg:w-96 md:border-r border-gray-200`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#1e3a5f] to-[#0f2744]">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Messages
        </h2>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No conversations yet</p>
            <p className="text-gray-400 text-xs mt-1">Messages will appear here</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversations.map((conversation, index) => {
              const partnerId = conversation.participants.find(p => p !== userId);
              const partnerDetails = partnerId ? conversation.participantDetails?.[partnerId] : null;
              const unreadCount = conversation.unreadCount?.[userId] || 0;
              const isSelected = currentConversation?.id === conversation.id;

              return (
                <motion.button
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200 text-left ${
                    isSelected 
                      ? 'bg-[#1e3a5f]/10 border border-[#1e3a5f]/20' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0f2744] flex items-center justify-center text-white font-semibold">
                      {partnerDetails?.name ? getInitials(partnerDetails.name) : '?'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <span className={`font-medium truncate ${isSelected ? 'text-[#1e3a5f]' : 'text-gray-900'}`}>
                          {partnerDetails?.name || 'Unknown User'}
                        </span>
                        {partnerDetails?.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      {conversation.lastMessageTime && (
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatDistanceToNow(conversation.lastMessageTime.toDate())}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${
                        unreadCount > 0 
                          ? 'text-gray-700 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        {conversation.lastMessageSenderId === userId && (
                          <span className="text-gray-400">You: </span>
                        )}
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                      {unreadCount > 0 && (
                        <span className="ml-2 flex-shrink-0 bg-[#ff6b35] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </div>
                    {partnerDetails?.role && partnerDetails.role !== 'user' && (
                      <p className="text-xs text-[#ff6b35] mt-0.5">
                        {partnerDetails.position || partnerDetails.role}
                        {partnerDetails.companyName && ` • ${partnerDetails.companyName}`}
                      </p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Render chat area
  const renderChatArea = () => {
    if (!currentConversation || !currentChatPartner) {
      return (
        <div className={`flex-1 flex items-center justify-center bg-gray-50 ${!showChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        </div>
      );
    }

    const partnerDetails = currentConversation.participantDetails?.[currentChatPartner.uid];

    return (
      <div className={`flex-1 flex flex-col h-full bg-white ${!showChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#1e3a5f] to-[#0f2744]">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
              {currentChatPartner.displayName ? getInitials(currentChatPartner.displayName) : '?'}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h2 className="font-semibold text-white truncate">
                  {currentChatPartner.displayName}
                </h2>
                {partnerDetails?.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-blue-300 flex-shrink-0" />
                )}
              </div>
              {partnerDetails?.role && partnerDetails.role !== 'user' && (
                <p className="text-xs text-[#ff6b35]">
                  {partnerDetails.position || partnerDetails.role}
                  {partnerDetails.companyName && ` • ${partnerDetails.companyName}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-gray-50">
          <AnimatePresence initial={false}>
            {currentMessages.map((msg, index) => {
              const isSent = msg.senderId === userId;
              const showTimestamp = index === 0 || 
                (currentMessages[index - 1] && 
                 msg.timestamp?.toDate().getTime() - currentMessages[index - 1].timestamp?.toDate().getTime() > 300000);

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}
                  style={{
                    paddingLeft: isSent ? '20%' : '16px',
                    paddingRight: isSent ? '16px' : '20%'
                  }}
                >
                  {showTimestamp && msg.timestamp && (
                    <span className="text-xs text-gray-400 mb-2 px-2">
                      {formatMessageTime(msg.timestamp.toDate())}
                    </span>
                  )}
                  
                  <div 
                    className={`max-w-full px-4 py-2.5 ${
                      isSent 
                        ? 'bg-[#1e3a5f] text-white rounded-2xl rounded-br-sm' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  </div>
                  
                  {/* Message Status */}
                  {isSent && (
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[10px] text-gray-400">
                        {msg.timestamp && formatMessageTime(msg.timestamp.toDate()).split(' ').pop()}
                      </span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                      ) : msg.status === 'delivered' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isPartnerTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start pl-4"
              >
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white safe-area-bottom">
          <div className="flex items-end gap-3">
            <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 rounded-full bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 text-sm"
                style={{ maxHeight: '120px' }}
              />
            </div>
            
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className="rounded-full p-3 bg-[#1e3a5f] hover:bg-[#0f2744] text-white flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className={`w-5 h-5 ${isSending ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {renderConversationList()}
      {renderChatArea()}
    </div>
  );
}
