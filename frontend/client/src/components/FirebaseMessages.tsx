/**
 * Firebase Messages Component
 * 100% Responsive Chat UI for Mobile and Tablet
 * WhatsApp-style design with proper spacing
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

// Format timestamp for conversation list
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

// Format time for message bubbles
const formatMessageTime = (timestamp: Timestamp | null | undefined): string => {
  if (!timestamp) return '';
  try {
    return timestamp.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
};

// File type helpers
const isImageFile = (url: string): boolean => {
  const exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  return exts.some(ext => url.toLowerCase().includes(ext));
};

const isVideoFile = (url: string): boolean => {
  const exts = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  return exts.some(ext => url.toLowerCase().includes(ext));
};

const getFileName = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split('/').pop() || 'file');
  } catch {
    return 'file';
  }
};

// Image Preview Modal
const ImagePreviewModal = ({ src, onClose }: { src: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full" onClick={onClose}>
      <X className="w-6 h-6 text-white" />
    </button>
    <img src={src} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" onClick={e => e.stopPropagation()} />
  </div>
);

export default function FirebaseMessages({ currentUser }: FirebaseMessagesProps) {
  const {
    conversations,
    messages,
    loading,
    selectedConversation,
    selectConversation,
    sendNewMessage,
    totalUnreadCount
  } = useFirebaseMessaging(currentUser);

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const otherParticipant = conv.participants.find(p => p.odooUserId !== currentUser?.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get other participant
  const getOtherParticipant = (conv: FirebaseConversation) => {
    return conv.participants.find(p => p.odooUserId !== currentUser?.id) || conv.participants[0];
  };

  // Select conversation
  const handleSelectConversation = async (convId: string) => {
    await selectConversation(convId);
    setShowChat(true);
  };

  // Send message
  const handleSendMessage = async () => {
    if ((!messageInput.trim() && selectedFiles.length === 0) || sending) return;
    
    setSending(true);
    setUploading(selectedFiles.length > 0);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (response.ok) {
          const data = await response.json();
          if (data.url) uploadedUrls.push(data.url);
        }
      }
      
      const content = messageInput.trim() || (uploadedUrls.length > 0 ? '📎 Attachment' : '');
      if (content || uploadedUrls.length > 0) {
        await sendNewMessage(content, uploadedUrls.length > 0 ? uploadedUrls : undefined);
      }
      
      setMessageInput('');
      setSelectedFiles([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render attachment
  const renderAttachment = (url: string) => {
    if (isImageFile(url)) {
      return (
        <img
          src={url}
          alt="Attachment"
          className="max-w-[200px] max-h-[200px] rounded-lg cursor-pointer mt-1"
          onClick={() => setPreviewImage(url)}
        />
      );
    }
    if (isVideoFile(url)) {
      return <video src={url} controls className="max-w-[240px] rounded-lg mt-1" />;
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-white/10 rounded-lg mt-1 hover:bg-white/20">
        <FileText className="w-5 h-5" />
        <span className="text-sm truncate max-w-[150px]">{getFileName(url)}</span>
        <Download className="w-4 h-4" />
      </a>
    );
  };

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Please log in to view messages</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex bg-white overflow-hidden">
      {/* Image Preview Modal */}
      {previewImage && <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />}

      {/* Conversation List */}
      <div className={`${showChat ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-80 lg:w-96 bg-white border-r border-slate-200`}>
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#1e3a5f] to-[#0f2744]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            {totalUnreadCount > 0 && (
              <span className="bg-amber-400 text-slate-800 text-xs font-bold px-2 py-1 rounded-full">
                {totalUnreadCount}
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 bg-white/10 rounded-full text-white placeholder-slate-300 text-sm focus:outline-none focus:bg-white/20"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-slate-400">
              <MessageSquare className="w-8 h-8 mb-2" />
              <p className="text-sm">No conversations</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const unread = currentUser ? (conv.unreadCount?.[currentUser.id] || 0) : 0;
              const isSelected = selectedConversation?.id === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`flex items-center gap-3 p-4 cursor-pointer border-b border-slate-100 transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-semibold">
                      {other.name.charAt(0).toUpperCase()}
                    </div>
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium text-slate-800 truncate ${unread > 0 ? 'font-bold' : ''}`}>
                        {other.name}
                      </span>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${unread > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                      {conv.lastSenderId === currentUser?.id && <span className="text-blue-500">You: </span>}
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${showChat ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-slate-50`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-3 bg-white border-b border-slate-200 shadow-sm">
              <button
                onClick={() => setShowChat(false)}
                className="md:hidden p-2 hover:bg-slate-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-semibold">
                {getOtherParticipant(selectedConversation).name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-800 truncate">
                    {getOtherParticipant(selectedConversation).name}
                  </span>
                  {selectedConversation.employerInfo?.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  )}
                </div>
                {selectedConversation.employerInfo && (
                  <p className="text-xs text-slate-500 truncate">
                    <span className="text-amber-600">{selectedConversation.employerInfo.position}</span>
                    {selectedConversation.employerInfo.companyName && (
                      <> · {selectedConversation.employerInfo.companyName}</>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: '#e5ddd5' }}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === currentUser?.id;
                    const attachments = msg.attachments || [];

                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`relative py-2 px-3 rounded-lg shadow-sm ${
                            isOwn
                              ? 'bg-[#dcf8c6] rounded-tr-none ml-12'
                              : 'bg-white rounded-tl-none mr-12'
                          }`}
                          style={{ maxWidth: 'calc(100% - 48px)', minWidth: '80px' }}
                        >
                          {msg.content && msg.content !== '📎 Attachment' && (
                            <p className="text-[15px] text-slate-800 break-words whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          )}
                          {attachments.map((url, idx) => (
                            <div key={idx}>{renderAttachment(url)}</div>
                          ))}
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-slate-500' : 'text-slate-400'}`}>
                            <span className="text-[11px]">{formatMessageTime(msg.timestamp)}</span>
                            {isOwn && (
                              msg.isRead
                                ? <CheckCheck className="w-4 h-4 text-blue-500" />
                                : <Check className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="p-2 bg-slate-100 border-t border-slate-200">
                <div className="flex gap-2 overflow-x-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} alt="" className="w-16 h-16 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-2 bg-slate-100 border-t border-slate-200">
              <div className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-11 h-11 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-slate-600 hover:bg-slate-200"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <textarea
                    placeholder="Type a message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    className="w-full py-3 px-4 bg-white rounded-3xl text-sm resize-none focus:outline-none"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={(!messageInput.trim() && selectedFiles.length === 0) || sending}
                  className={`w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
                    (messageInput.trim() || selectedFiles.length > 0) && !sending
                      ? 'bg-[#00a884] text-white'
                      : 'bg-slate-300 text-slate-500'
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
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Select a conversation</h3>
              <p className="text-slate-400 text-sm">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
