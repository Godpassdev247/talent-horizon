/**
 * Demo Chat Area Component
 * 
 * Design: Liquid Glass - Neo-glassmorphism with organic, fluid shapes
 * Main chat interface with message display, input, and typing indicator
 * 
 * FEATURES:
 * - File upload (images, videos, PDFs, documents)
 * - Inline preview for media files
 * - Download functionality
 * - Simple back arrow button (no rounded background)
 * - No 3-dot menu in header
 * - Fixed header at top
 * - Fixed input at bottom
 * - Scrollable messages area in between
 */

import { useState, useRef, useEffect } from 'react';
import { useDemo, FileAttachment } from '@/contexts/FirebaseChatContext';
import { formatLastSeen } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Check, CheckCheck, Paperclip, X, Download, FileText, Film, Image as ImageIcon, Menu } from 'lucide-react';

interface DemoChatAreaProps {
  onBack: () => void;
  showBackButton?: boolean;
  onShowSidebar?: () => void;
}

// Format time for message bubble (e.g., "10:30 AM")
function formatBubbleTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Format date separator (e.g., "Today", "Yesterday", "Jan 5")
function formatDateSeparator(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Check if we should show a date separator between messages
function shouldShowDateSeparator(currentMsg: { timestamp: Date }, prevMsg: { timestamp: Date } | null): boolean {
  if (!prevMsg) return true;
  const currentDate = new Date(currentMsg.timestamp.getFullYear(), currentMsg.timestamp.getMonth(), currentMsg.timestamp.getDate());
  const prevDate = new Date(prevMsg.timestamp.getFullYear(), prevMsg.timestamp.getMonth(), prevMsg.timestamp.getDate());
  return currentDate.getTime() !== prevDate.getTime();
}

// File Preview Modal Component
function FilePreviewModal({ attachment, onClose }: { attachment: FileAttachment; onClose: () => void }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="absolute -top-12 right-12 p-2 text-white/80 hover:text-white transition-colors"
        >
          <Download className="w-7 h-7" />
        </button>

        {/* Content */}
        {attachment.type === 'image' ? (
          <img
            src={attachment.url}
            alt={attachment.name}
            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
          />
        ) : attachment.type === 'video' ? (
          <video
            src={attachment.url}
            controls
            className="w-full max-h-[85vh] rounded-lg"
          />
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-[oklch(0.35_0.1_250)]" />
            <p className="text-lg font-medium text-[oklch(0.2_0.05_250)]">{attachment.name}</p>
            <p className="text-sm text-[oklch(0.5_0.03_250)] mt-1">
              {(attachment.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={handleDownload}
              className="mt-4 px-6 py-2 bg-[oklch(0.35_0.1_250)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Download
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Attachment Preview Component (in message bubble)
function AttachmentPreview({ 
  attachment, 
  isSent,
  onPreview 
}: { 
  attachment: FileAttachment; 
  isSent: boolean;
  onPreview: (attachment: FileAttachment) => void;
}) {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (attachment.type === 'image') {
    return (
      <div 
        className="relative cursor-pointer group"
        onClick={() => onPreview(attachment)}
      >
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-w-[240px] sm:max-w-[280px] rounded-lg"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
          <Download 
            className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDownload}
          />
        </div>
      </div>
    );
  }

  if (attachment.type === 'video') {
    return (
      <div 
        className="relative cursor-pointer group"
        onClick={() => onPreview(attachment)}
      >
        <video
          src={attachment.url}
          className="max-w-[240px] sm:max-w-[280px] rounded-lg"
        />
        <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
          <Film className="w-12 h-12 text-white" />
        </div>
      </div>
    );
  }

  // Document/PDF
  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
        isSent ? 'bg-white/20' : 'bg-[oklch(0.95_0.01_250)]'
      }`}
      onClick={() => onPreview(attachment)}
    >
      <FileText className={`w-8 h-8 ${isSent ? 'text-white/80' : 'text-[oklch(0.35_0.1_250)]'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isSent ? 'text-white' : 'text-[oklch(0.2_0.05_250)]'}`}>
          {attachment.name}
        </p>
        <p className={`text-xs ${isSent ? 'text-white/70' : 'text-[oklch(0.5_0.03_250)]'}`}>
          {(attachment.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      <Download 
        className={`w-5 h-5 ${isSent ? 'text-white/80' : 'text-[oklch(0.35_0.1_250)]'}`}
        onClick={handleDownload}
      />
    </div>
  );
}

// Pending File Preview Component
function PendingFilePreview({ 
  file, 
  onRemove 
}: { 
  file: File; 
  onRemove: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    return () => setPreview(null);
  }, [file]);

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="relative inline-block mr-2 mb-2"
    >
      {isImage && preview ? (
        <img src={preview} alt={file.name} className="w-20 h-20 object-cover rounded-lg" />
      ) : isVideo ? (
        <div className="w-20 h-20 bg-[oklch(0.95_0.01_250)] rounded-lg flex items-center justify-center">
          <Film className="w-8 h-8 text-[oklch(0.35_0.1_250)]" />
        </div>
      ) : (
        <div className="w-20 h-20 bg-[oklch(0.95_0.01_250)] rounded-lg flex flex-col items-center justify-center p-2">
          <FileText className="w-6 h-6 text-[oklch(0.35_0.1_250)]" />
          <span className="text-[10px] text-[oklch(0.5_0.03_250)] truncate w-full text-center mt-1">
            {file.name.split('.').pop()?.toUpperCase()}
          </span>
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

export default function DemoChatArea({ onBack, showBackButton, onShowSidebar }: DemoChatAreaProps) {
  const { 
    currentUser, 
    currentConversation, 
    currentChatPartner, 
    currentMessages,
    sendMessage,
    isPartnerTyping,
    setTypingStatus
  } = useDemo();

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<FileAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Set typing status
    setTypingStatus(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to clear typing status
    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus(false);
    }, 2000);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setPendingFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle send
  const handleSend = async () => {
    if ((!message.trim() && !pendingFile) || isSending) return;
    
    setIsSending(true);
    setTypingStatus(false);
    
    try {
      await sendMessage(message.trim(), pendingFile || undefined);
      setMessage('');
      setPendingFile(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
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
    <div className="flex flex-col h-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 50%, #e6f0ff 100%)' }}>
      {/* Fixed Header */}
      <header className="flex-shrink-0 bg-[oklch(0.97_0.01_240)] border-b border-[oklch(0.92_0.01_250)] py-3 sm:py-4 px-3 sm:px-4 safe-area-top z-20">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Show sidebar button when sidebar is hidden */}
          {onShowSidebar && (
            <button
              onClick={onShowSidebar}
              className="p-1.5 flex-shrink-0 text-[oklch(0.35_0.08_250)] hover:text-[oklch(0.25_0.08_250)] hover:bg-[oklch(0.95_0.01_250)] rounded-lg transition-all"
              aria-label="Show conversations"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-1 flex-shrink-0 text-[oklch(0.35_0.08_250)] hover:text-[oklch(0.25_0.08_250)] transition-colors"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          
          <div className="relative flex-shrink-0">
            <img
              src={currentChatPartner.photoURL || '/images/avatar-placeholder.png'}
              alt={currentChatPartner.displayName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover"
            />
            {currentChatPartner.online && (
              <div className="absolute -bottom-0.5 -right-0.5 online-indicator" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-[oklch(0.25_0.08_250)] truncate text-sm sm:text-base">
              {currentChatPartner.displayName}
            </h2>
            <p className="text-xs text-[oklch(0.5_0.03_250)]">
              {isPartnerTyping ? (
                <span className="text-[oklch(0.7_0.15_200)]">typing...</span>
              ) : currentChatPartner.online ? (
                'Online'
              ) : (
                formatLastSeen(currentChatPartner.lastSeen)
              )}
            </p>
          </div>
        </div>
      </header>

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <AnimatePresence initial={false}>
          {(currentMessages || []).map((msg, index) => {
            const isSent = msg.senderId === currentUser?.uid;
            const prevMsg = index > 0 ? currentMessages[index - 1] : null;
            const showDate = shouldShowDateSeparator(msg, prevMsg);

            return (
              <div key={msg.id}>
                {/* Date Separator */}
                {showDate && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center my-4"
                  >
                    <span className="px-3 py-1 text-xs text-[oklch(0.5_0.03_250)] bg-[oklch(0.95_0.01_250)] rounded-full">
                      {formatDateSeparator(msg.timestamp)}
                    </span>
                  </motion.div>
                )}

                {/* Message Bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex mb-3 ${isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%] ${isSent ? 'items-end' : 'items-start'} flex flex-col`}>
                    {/* Message Content */}
                    <div
                      className={`
                        px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl
                        ${isSent 
                          ? 'bg-[oklch(0.35_0.1_250)] text-white rounded-br-md' 
                          : 'bg-white text-[oklch(0.2_0.05_250)] rounded-bl-md shadow-sm border border-[oklch(0.92_0.01_250)]'
                        }
                      `}
                    >
                      {/* Attachment */}
                      {msg.attachment && (
                        <div className="mb-2">
                          <AttachmentPreview 
                            attachment={msg.attachment} 
                            isSent={isSent}
                            onPreview={setPreviewAttachment}
                          />
                        </div>
                      )}
                      
                      {/* Text */}
                      {msg.text && (
                        <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                          {msg.text}
                        </p>
                      )}
                    </div>

                    {/* Timestamp and Status - Outside bubble */}
                    <div className={`flex items-center gap-1 mt-1 px-1 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className={`text-[10px] sm:text-xs ${isSent ? 'text-[oklch(0.5_0.03_250)]' : 'text-[oklch(0.55_0.02_250)]'}`}>
                        {formatBubbleTime(msg.timestamp)}
                      </span>
                      {isSent && (
                        <span className="text-[oklch(0.5_0.03_250)]">
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-[oklch(0.6_0.15_200)]" />
                          ) : msg.status === 'delivered' ? (
                            <CheckCheck className="w-3.5 h-3.5" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isPartnerTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-start mb-3"
            >
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-[oklch(0.92_0.01_250)]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[oklch(0.5_0.03_250)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[oklch(0.5_0.03_250)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[oklch(0.5_0.03_250)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Pending File Preview */}
      <AnimatePresence>
        {pendingFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-shrink-0 px-3 sm:px-4 py-2 bg-[oklch(0.98_0.01_250)] border-t border-[oklch(0.92_0.01_250)]"
          >
            <PendingFilePreview file={pendingFile} onRemove={() => setPendingFile(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Input Area at Bottom */}
      <div className="flex-shrink-0 bg-white border-t border-[oklch(0.9_0.01_250)] p-2 sm:p-3 safe-area-bottom z-20">
        <div className="flex items-end gap-2 sm:gap-3">
          {/* File upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 sm:p-2.5 flex-shrink-0 mb-0.5 hover:opacity-70 transition-opacity"
          >
            <Paperclip className="w-5 h-5 text-[oklch(0.35_0.1_250)]" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[oklch(0.97_0.01_250)] border border-[oklch(0.9_0.01_250)] text-[oklch(0.2_0.05_250)] placeholder-[oklch(0.5_0.03_250)] resize-none focus:outline-none focus:border-[oklch(0.35_0.1_250)] text-sm sm:text-base"
              style={{ maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={(!message.trim() && !pendingFile) || isSending}
            className="p-2 sm:p-2.5 flex-shrink-0 mb-0.5 hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className={`w-5 h-5 text-[oklch(0.35_0.1_250)] ${isSending ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewAttachment && (
          <FilePreviewModal
            attachment={previewAttachment}
            onClose={() => setPreviewAttachment(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
