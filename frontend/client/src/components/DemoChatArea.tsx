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
 */

import { useState, useRef, useEffect } from 'react';
import { useDemo, FileAttachment } from '@/contexts/DemoContext';
import { formatLastSeen } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Check, CheckCheck, Paperclip, X, Download, FileText, Film, Image as ImageIcon } from 'lucide-react';

interface DemoChatAreaProps {
  onBack: () => void;
  showBackButton?: boolean;
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
function shouldShowDateSeparator(currentMsg: Date, prevMsg: Date | null): boolean {
  if (!prevMsg) return true;
  const currentDate = new Date(currentMsg.getFullYear(), currentMsg.getMonth(), currentMsg.getDate());
  const prevDate = new Date(prevMsg.getFullYear(), prevMsg.getMonth(), prevMsg.getDate());
  return currentDate.getTime() !== prevDate.getTime();
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Get file type from mime type
function getFileType(mimeType: string): FileAttachment['type'] {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('text')) return 'document';
  return 'other';
}

// File Preview Modal Component
function FilePreviewModal({ 
  attachment, 
  onClose 
}: { 
  attachment: FileAttachment; 
  onClose: () => void;
}) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-[oklch(0.2_0.05_250)]/80 hover:text-[oklch(0.2_0.05_250)]"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="absolute -top-12 right-12 p-2 text-[oklch(0.2_0.05_250)]/80 hover:text-[oklch(0.2_0.05_250)] flex items-center gap-2"
        >
          <Download className="w-6 h-6" />
          <span className="text-sm">Save</span>
        </button>

        {/* Content */}
        <div className="bg-[oklch(0.15_0.02_260)] rounded-2xl overflow-hidden">
          {attachment.type === 'image' && (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
          )}
          {attachment.type === 'video' && (
            <video
              src={attachment.url}
              controls
              className="max-w-full max-h-[80vh] mx-auto"
            />
          )}
          {attachment.type === 'pdf' && (
            <iframe
              src={attachment.url}
              className="w-full h-[80vh]"
              title={attachment.name}
            />
          )}
          {(attachment.type === 'document' || attachment.type === 'other') && (
            <div className="p-8 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-[oklch(0.5_0.03_250)]" />
              <p className="text-[oklch(0.2_0.05_250)] font-medium mb-2">{attachment.name}</p>
              <p className="text-[oklch(0.5_0.03_250)] text-sm mb-4">{formatFileSize(attachment.size)}</p>
              <button onClick={handleDownload} className="btn-primary-glass px-4 py-2 rounded-xl flex items-center justify-center mx-auto">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          )}
        </div>

        {/* File name */}
        <p className="text-center text-[oklch(0.2_0.05_250)]/80 mt-4 text-sm">{attachment.name}</p>
      </motion.div>
    </motion.div>
  );
}

// Attachment Preview Component (inline in message)
function AttachmentPreview({ 
  attachment, 
  isSent,
  onPreview
}: { 
  attachment: FileAttachment; 
  isSent: boolean;
  onPreview: () => void;
}) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (attachment.type === 'image') {
    return (
      <div className="relative cursor-pointer group" onClick={onPreview}>
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-w-[250px] sm:max-w-[300px] rounded-lg object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center">
          <Download 
            className="w-8 h-8 text-[oklch(0.2_0.05_250)] opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDownload}
          />
        </div>
      </div>
    );
  }

  if (attachment.type === 'video') {
    return (
      <div className="relative cursor-pointer" onClick={onPreview}>
        <video
          src={attachment.url}
          className="max-w-[250px] sm:max-w-[300px] rounded-lg"
          muted
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
          <Film className="w-12 h-12 text-[oklch(0.2_0.05_250)]" />
        </div>
      </div>
    );
  }

  // PDF and other documents
  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
        isSent ? 'bg-white/10' : 'bg-[oklch(0.95_0.01_250)]'
      }`}
      onClick={onPreview}
    >
      {attachment.type === 'pdf' ? (
        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-red-400" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isSent ? 'text-[oklch(0.2_0.05_250)]' : 'text-[oklch(0.2_0.05_250)]'}`}>
          {attachment.name}
        </p>
        <p className={`text-xs ${isSent ? 'text-[oklch(0.2_0.05_250)]/60' : 'text-[oklch(0.5_0.03_250)]'}`}>
          {formatFileSize(attachment.size)}
        </p>
      </div>
      <button
        onClick={handleDownload}
        className={`p-2 rounded-lg ${isSent ? 'hover:bg-white/10' : 'hover:bg-[oklch(0.9_0.01_250)]'}`}
      >
        <Download className={`w-4 h-4 ${isSent ? 'text-[oklch(0.2_0.05_250)]/80' : 'text-[oklch(0.5_0.03_250)]'}`} />
      </button>
    </div>
  );
}

export default function DemoChatArea({ onBack, showBackButton = true }: DemoChatAreaProps) {
  const { 
    currentUser,
    currentConversation, 
    messages,
    currentChatPartner, 
    isPartnerTyping,
    sendMessage
  } = useDemo();
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<FileAttachment | null>(null);
  const [pendingFile, setPendingFile] = useState<FileAttachment | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<FileAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMessages = currentConversation ? messages[currentConversation.id] || [] : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isPartnerTyping]);

  // Handle message input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const attachment: FileAttachment = {
        id: `file-${Date.now()}`,
        name: file.name,
        type: getFileType(file.type),
        url: reader.result as string,
        size: file.size,
        mimeType: file.type
      };
      setPendingFile(attachment);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle send message
  const handleSend = async () => {
    if ((!message.trim() && !pendingFile) || isSending) return;
    
    // Preserve line breaks - only trim leading/trailing whitespace from each line
    const messageText = message.replace(/^\s+|\s+$/g, '');
    setMessage('');
    const fileToSend = pendingFile;
    setPendingFile(null);
    setIsSending(true);
    
    try {
      sendMessage(messageText, fileToSend || undefined);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessage(messageText);
      setPendingFile(fileToSend);
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
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 50%, #e6f0ff 100%)' }}>
      {/* Header - removed 3-dot menu */}
      <header className="bg-[oklch(0.97_0.01_240)] border-b border-[oklch(0.92_0.01_250)] py-4 sm:py-5 px-3 sm:px-4 safe-area-top">
        <div className="flex items-center gap-3 sm:gap-4">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-1 flex-shrink-0 text-[oklch(0.35_0.08_250)] hover:text-[oklch(0.25_0.08_250)] transition-colors"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          
          <div className="relative flex-shrink-0 ml-2">
            <img
              src={currentChatPartner.photoURL || '/images/avatar-placeholder.png'}
              alt={currentChatPartner.displayName}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4">
        <AnimatePresence initial={false}>
          {currentMessages.map((msg, index) => {
            const isSent = msg.senderId === currentUser?.uid;
            const prevMsg = index > 0 ? currentMessages[index - 1] : null;
            const showDateSeparator = shouldShowDateSeparator(msg.timestamp, prevMsg?.timestamp || null);
            
            // Check if this message is from the same sender as the previous one (for grouping)
            const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;
            const timeDiff = prevMsg ? msg.timestamp.getTime() - prevMsg.timestamp.getTime() : Infinity;
            const isGrouped = isSameSender && timeDiff < 60000 && !showDateSeparator;

            return (
              <div key={msg.id}>
                {/* Date Separator */}
                {showDateSeparator && (
                  <div className="flex justify-center my-3 sm:my-4">
                    <span className="text-[10px] sm:text-xs text-[oklch(0.5_0.03_250)] bg-[oklch(0.95_0.01_250)] px-3 py-1 rounded-full">
                      {formatDateSeparator(msg.timestamp)}
                    </span>
                  </div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} ${isGrouped ? 'mt-0' : 'mt-0.5'}`}
                >
                  {/* Message Bubble */}
                  <div 
                    className={`
                      max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]
                      ${isSent ? 'message-bubble-sent' : 'message-bubble-received'} 
                      ${msg.attachment ? 'p-1.5' : 'px-3 sm:px-4 py-1.5 sm:py-2'}
                    `}
                  >
                    {/* Attachment */}
                    {msg.attachment && (
                      <div className={msg.text ? 'mb-2' : ''}>
                        <AttachmentPreview 
                          attachment={msg.attachment} 
                          isSent={isSent}
                          onPreview={() => setPreviewAttachment(msg.attachment!)}
                        />
                      </div>
                    )}
                    
                    {/* Text */}
                    {msg.text && (
                      <p className={`text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap ${msg.attachment ? 'px-2 pb-1' : ''} ${isSent ? 'text-white' : 'text-[oklch(0.2_0.05_250)]'}`}>
                        {msg.text}
                      </p>
                    )}
                  </div>
                  
                  {/* Timestamp OUTSIDE bubble */}
                  <div className={`flex items-center gap-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] sm:text-[11px] text-[oklch(0.5_0.03_250)]">
                      {formatBubbleTime(msg.timestamp)}
                    </span>
                    {isSent && (
                      <>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-[oklch(0.6_0.15_200)]" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-[oklch(0.5_0.03_250)]" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-[oklch(0.5_0.03_250)]" />
                        )}
                      </>
                    )}
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
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start mt-2"
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

      {/* Pending File Preview */}
      <AnimatePresence>
        {pendingFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-3 sm:px-4 py-2 border-t border-[oklch(0.9_0.01_250)]"
          >
            <div className="flex items-center gap-3 p-2 rounded-lg bg-[oklch(0.95_0.01_250)]">
              {pendingFile.type === 'image' ? (
                <img src={pendingFile.url} alt="" className="w-12 h-12 rounded object-cover" />
              ) : pendingFile.type === 'video' ? (
                <div className="w-12 h-12 rounded bg-[oklch(0.9_0.01_250)] flex items-center justify-center">
                  <Film className="w-6 h-6 text-[oklch(0.5_0.03_250)]" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded bg-[oklch(0.9_0.01_250)] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[oklch(0.5_0.03_250)]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[oklch(0.2_0.05_250)] truncate">{pendingFile.name}</p>
                <p className="text-xs text-[oklch(0.5_0.03_250)]">{formatFileSize(pendingFile.size)}</p>
              </div>
              <button
                onClick={() => setPendingFile(null)}
                className="p-1.5 rounded-lg hover:bg-[oklch(0.9_0.01_250)]"
              >
                <X className="w-5 h-5 text-[oklch(0.5_0.03_250)]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-[oklch(0.9_0.01_250)] p-2 sm:p-4 safe-area-bottom">
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
