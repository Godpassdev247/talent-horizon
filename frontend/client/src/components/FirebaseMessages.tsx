/**
 * Firebase Messages Component
 * Real-time messaging using Firebase Firestore
 * Mobile-first responsive chat UI with white/blue theme
 * Supports file attachments with inline preview
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, ArrowLeft, MessageSquare, Check, CheckCheck, BadgeCheck, Paperclip, X, FileText, Download
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

// Check if file is an image
const isImageFile = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
};

// Check if file is a video
const isVideoFile = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext));
};

// Get file name from URL
const getFileName = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileName = pathname.split('/').pop() || 'file';
    return decodeURIComponent(fileName);
  } catch {
    return 'file';
  }
};

// Image preview modal component
const ImagePreviewModal = ({ src, onClose }: { src: string; onClose: () => void }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        onClick={onClose}
      >
        <X className="w-6 h-6 text-white" />
      </button>
      <img 
        src={src} 
        alt="Preview" 
        className="max-w-full max-h-full object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <a
        href={src}
        download
        className="absolute bottom-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <Download className="w-5 h-5 text-white" />
      </a>
    </div>
  );
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload file to server and get URL
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('File upload error:', error);
      // Fallback: create a data URL for demo purposes
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle send message (reply in same conversation)
  const handleSendMessage = async () => {
    if ((!messageInput.trim() && selectedFiles.length === 0) || sending || !selectedConversation) return;

    setSending(true);
    setUploading(selectedFiles.length > 0);
    
    try {
      // Upload files first
      const attachmentUrls: string[] = [];
      for (const file of selectedFiles) {
        const url = await uploadFile(file);
        attachmentUrls.push(url);
      }
      
      await sendNewMessage(messageInput.trim() || (attachmentUrls.length > 0 ? '📎 Attachment' : ''), attachmentUrls);
      setMessageInput('');
      setSelectedFiles([]);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
      setUploading(false);
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

  // Render attachment preview in message
  const renderAttachment = (url: string, isOwn: boolean) => {
    if (isImageFile(url)) {
      return (
        <div 
          className="mt-2 cursor-pointer rounded-lg overflow-hidden"
          onClick={() => setPreviewImage(url)}
        >
          <img 
            src={url} 
            alt="Attachment" 
            className="max-w-[250px] max-h-[200px] object-cover rounded-lg hover:opacity-90 transition-opacity"
          />
        </div>
      );
    }
    
    if (isVideoFile(url)) {
      return (
        <div className="mt-2 rounded-lg overflow-hidden">
          <video 
            src={url} 
            controls 
            className="max-w-[250px] max-h-[200px] rounded-lg"
          />
        </div>
      );
    }
    
    // Generic file
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`mt-2 flex items-center gap-2 p-2 rounded-lg ${isOwn ? 'bg-blue-400/30' : 'bg-slate-500/30'} hover:opacity-80 transition-opacity`}
      >
        <FileText className="w-5 h-5" />
        <span className="text-sm truncate max-w-[180px]">{getFileName(url)}</span>
        <Download className="w-4 h-4 ml-auto" />
      </a>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
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
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-slate-600" />
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
    <div data-testid="firebase-messages" className="h-full flex bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
      )}

      {/* Left Panel - Conversations List */}
      <div className={`${showMobileChat ? 'hidden' : 'flex'} md:flex w-full md:w-[320px] lg:w-[340px] flex-col bg-white border-r border-slate-200 flex-shrink-0`}>
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#1e3a5f]/90 to-[#0f2744]/80">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            {totalUnreadCount > 0 && (
              <span className="bg-amber-400 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                {totalUnreadCount}
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-3 pl-10 bg-[#1e3a5f]/40 border-0 rounded-full text-sm text-white placeholder-slate-300 focus:outline-none focus:bg-[#1e3a5f]/50 focus:ring-2 focus:ring-white/30 transition-all"
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
                    ? 'bg-amber-50 border-l-4 border-l-amber-500' 
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                } ${unreadCount > 0 ? 'bg-amber-50/50' : ''}`}
                onClick={() => handleSelectConversation(conv.id)}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#1e3a5f]/70 flex items-center justify-center text-white font-semibold text-lg">
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
      <div className={`${showMobileChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-gradient-to-b from-slate-50/50 to-white overflow-hidden`}>
        {selectedConversation ? (
          <div className="flex flex-col h-full">
            {/* Chat Header - Fixed at top */}
            <div className="flex-shrink-0 flex items-center gap-3 p-4 bg-white border-b border-slate-200 shadow-sm z-10">
              <button 
                className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
                onClick={handleBackToList}
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
              <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/70 flex items-center justify-center text-white font-semibold">
                {getOtherParticipant(selectedConversation).name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {getOtherParticipant(selectedConversation).name}
                  </h3>
                  {getOtherParticipant(selectedConversation).isVerified && (
                    <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-amber-600 font-medium">
                  {getOtherParticipant(selectedConversation).position || 
                   (getOtherParticipant(selectedConversation).role === 'admin' ? 'Recruiter' : 'Job Seeker')}
                </p>
                {(getOtherParticipant(selectedConversation).companyName || getOtherParticipant(selectedConversation).companyAddress) && (
                  <p className="text-xs text-slate-500 truncate">
                    {[getOtherParticipant(selectedConversation).companyName, getOtherParticipant(selectedConversation).companyAddress].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Messages Area - Mobile-first responsive design */}
            <div className="flex-1 overflow-y-auto bg-slate-100/50 min-h-0 py-3">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center px-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-500 text-sm">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3 sm:px-4">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === currentUser?.id;
                    const attachments = msg.attachments || [];
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex w-full ${
                          isOwn ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div 
                          className={`relative max-w-[80%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[60%] px-3 py-2 rounded-2xl shadow-sm ${
                            isOwn 
                              ? 'bg-blue-500 rounded-br-sm ml-auto' 
                              : 'bg-slate-700 rounded-bl-sm mr-auto'
                          }`}
                        >
                          {msg.content && msg.content !== '📎 Attachment' && (
                            <p className="text-[15px] leading-snug text-white break-words whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          )}
                          {/* Render attachments */}
                          {attachments.map((url, idx) => (
                            <div key={idx}>
                              {renderAttachment(url, isOwn)}
                            </div>
                          ))}
                          <div className={`flex items-center justify-end gap-1 mt-1 ${
                            isOwn ? 'text-blue-100' : 'text-slate-300'
                          }`}>
                            <span className="text-[11px]">
                              {formatMessageTime(msg.timestamp)}
                            </span>
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
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="flex-shrink-0 px-4 py-2 bg-slate-50 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                      <button
                        onClick={() => removeSelectedFile(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input - Fixed at bottom with proper mobile padding */}
            <div className="flex-shrink-0 px-2 sm:px-3 md:px-4 py-2 sm:py-3 bg-white border-t border-slate-200 z-10 safe-area-bottom">
              <div className="flex items-center gap-2">
                {/* File attachment button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center justify-center"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 min-w-0">
                  <textarea
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    className="w-full py-2.5 px-3 sm:px-4 bg-slate-50 border border-slate-200 rounded-full text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    style={{ minHeight: '40px', maxHeight: '100px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={(!messageInput.trim() && selectedFiles.length === 0) || sending}
                  className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all active:scale-95 flex items-center justify-center ${
                    (messageInput.trim() || selectedFiles.length > 0) && !sending
                      ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* No conversation selected - Desktop only */
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-12 h-12 text-slate-500" />
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
