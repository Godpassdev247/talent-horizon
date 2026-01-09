/**
 * Real-time Messaging Interface for Users
 * WhatsApp/Telegram-style chat interface
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  MessageSquare, Send, ArrowLeft, Search, Phone, Video, MoreVertical,
  Check, CheckCheck, Paperclip, Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
  is_sent_by_me: boolean;
}

interface Conversation {
  id: number;
  display_name: string;
  sender_position?: string;
  metadata: any;
  other_user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  last_message?: {
    content: string;
    created_at: string;
  };
  unread_count: number;
}

export default function Messages() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Check authentication
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('frontendToken');
    
    if (!storedUser || !token) {
      setLocation('/login');
      return;
    }
    
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      setLocation('/login');
    }
  }, [setLocation]);

  // Fetch conversations
  const fetchConversations = async () => {
    const token = localStorage.getItem('frontendToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/admin-panel/api/messages/conversations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId: number) => {
    const token = localStorage.getItem('frontendToken');
    if (!token) return;

    try {
      setMessagesLoading(true);
      const response = await fetch(`http://localhost:8000/admin-panel/api/messages/conversations/${conversationId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    const token = localStorage.getItem('frontendToken');
    if (!token) return;

    try {
      setSending(true);
      const response = await fetch('http://localhost:8000/admin-panel/api/messages/send/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setNewMessage("");
        scrollToBottom();
        
        // Refresh conversations to update last message
        fetchConversations();
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Auto-refresh conversations every 5 seconds
  useEffect(() => {
    if (user) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Auto-refresh messages every 3 seconds when conversation is open
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      const interval = setInterval(() => {
        fetchMessages(selectedConversation.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/dashboard')}
          className="lg:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <div>
          <h1 className="font-semibold text-slate-900">Messages</h1>
          <p className="text-xs text-slate-500">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className={`${selectedConversation ? 'hidden lg:block' : 'block'} w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col`}>
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No messages yet</p>
                <p className="text-slate-400 text-sm mt-2">
                  When employers contact you, their messages will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {conversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedConversation?.id === conv.id
                        ? 'bg-blue-50 border-l-4 border-l-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {conv.display_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {conv.display_name}
                            </h3>
                            {conv.metadata?.verified && (
                              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {conv.last_message ? formatDate(conv.last_message.created_at) : ''}
                          </span>
                        </div>
                        {conv.sender_position && (
                          <p className="text-xs text-slate-500 mb-1">{conv.sender_position}</p>
                        )}
                        {conv.metadata?.company_name && (
                          <p className="text-xs text-slate-400 mb-1">{conv.metadata.company_name}</p>
                        )}
                        <p className="text-sm text-slate-600 truncate">
                          {conv.last_message?.content || 'No messages yet'}
                        </p>
                        {conv.unread_count > 0 && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                            {conv.unread_count} new
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Messages Area */}
        <div className={`${selectedConversation ? 'block' : 'hidden lg:block'} flex-1 flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-white`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {selectedConversation.display_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-slate-900">
                        {selectedConversation.display_name}
                      </h2>
                      {selectedConversation.metadata?.verified && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {selectedConversation.sender_position && (
                      <p className="text-xs text-slate-500">{selectedConversation.sender_position}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-4 py-6">
                {messagesLoading && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.is_sent_by_me ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            message.is_sent_by_me
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-black text-white rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <span className="text-xs opacity-70">
                              {formatTime(message.created_at)}
                            </span>
                            {message.is_sent_by_me && (
                              message.is_read ? (
                                <CheckCheck className="w-3 h-3 opacity-70" />
                              ) : (
                                <Check className="w-3 h-3 opacity-70" />
                              )
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="bg-white border-t border-slate-200 px-4 py-3">
                <div className="flex items-end gap-2 max-w-4xl mx-auto">
                  <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
                    <textarea
                      ref={messageInputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full bg-transparent resize-none outline-none text-sm max-h-32 min-h-[24px]"
                      rows={1}
                      style={{
                        height: 'auto',
                        minHeight: '24px',
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
                    />
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 p-0 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a conversation</h3>
                <p className="text-slate-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
