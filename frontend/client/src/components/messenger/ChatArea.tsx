/**
 * Chat Area Component
 * 
 * Design: Liquid Glass - Neo-glassmorphism with organic, fluid shapes
 * Main chat interface with message display, input, and typing indicator
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { formatMessageTime, formatLastSeen } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Smile, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatAreaProps {
  onBack: () => void;
}

export default function ChatArea({ onBack }: ChatAreaProps) {
  const { user } = useAuth();
  const { 
    currentConversation, 
    currentMessages, 
    currentChatPartner, 
    isPartnerTyping,
    sendMessage,
    setTyping 
  } = useChat();
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isPartnerTyping]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (setTyping) {
      setTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (setTyping) {
        setTyping(false);
      }
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
      setMessage(messageText); // Restore message on error
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

  if (!currentConversation || !currentChatPartner) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="glass-panel-strong border-b border-[oklch(1_0_0/0.1)] p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 rounded-xl btn-glass"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <img
              src={currentChatPartner.photoURL || '/images/avatar-placeholder.png'}
              alt={currentChatPartner.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            {currentChatPartner.online && (
              <div className="absolute -bottom-0.5 -right-0.5 online-indicator" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-white truncate">
              {currentChatPartner.displayName}
            </h2>
            <p className="text-xs text-[oklch(0.6_0.02_260)]">
              {currentChatPartner.online 
                ? 'Online' 
                : currentChatPartner.lastSeen 
                  ? formatLastSeen(currentChatPartner.lastSeen.toDate())
                  : 'Offline'
              }
            </p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        <AnimatePresence initial={false}>
          {currentMessages.map((msg, index) => {
            const isSent = msg.senderId === user?.uid;
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
              >
                {showTimestamp && msg.timestamp && (
                  <span className="text-xs text-[oklch(0.5_0.02_260)] mb-2 px-2">
                    {formatMessageTime(msg.timestamp.toDate())}
                  </span>
                )}
                
                <div className={`max-w-[75%] ${isSent ? 'message-bubble-sent' : 'message-bubble-received'} px-4 py-2.5`}>
                  <p className={`text-sm leading-relaxed ${isSent ? 'text-white' : 'text-[oklch(0.9_0.01_260)]'}`}>
                    {msg.text}
                  </p>
                </div>
                
                {/* Message Status */}
                {isSent && (
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-[oklch(0.5_0.02_260)]">
                      {msg.timestamp && formatMessageTime(msg.timestamp.toDate()).split(' ').pop()}
                    </span>
                    {msg.status === 'read' ? (
                      <CheckCheck className="w-3.5 h-3.5 text-[oklch(0.7_0.15_200)]" />
                    ) : msg.status === 'delivered' ? (
                      <CheckCheck className="w-3.5 h-3.5 text-[oklch(0.5_0.02_260)]" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-[oklch(0.5_0.02_260)]" />
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
              className="flex items-start"
            >
              <div className="message-bubble-received px-4 py-3 flex items-center gap-1.5">
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
      <div className="glass-panel-strong border-t border-[oklch(1_0_0/0.1)] p-4">
        <div className="flex items-end gap-3">
          <button className="p-2 rounded-xl btn-glass flex-shrink-0 mb-0.5">
            <Smile className="w-5 h-5 text-[oklch(0.6_0.02_260)]" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 rounded-2xl input-glass text-white placeholder-[oklch(0.5_0.02_260)] resize-none focus:outline-none text-sm"
              style={{ maxHeight: '120px' }}
            />
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="btn-primary-glass rounded-xl p-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className={`w-5 h-5 ${isSending ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
