import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Message {
  id: number;
  conversationId: string;
  senderId: number;
  senderName: string;
  senderAvatarUrl: string | null;
  recipientId: number;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'audio';
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  status: 'sent' | 'delivered' | 'read';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  otherUserId: number;
  otherUserName: string;
  otherUserEmail: string;
  lastMessage: string | null;
  lastMessageType: string | null;
  lastMessageSenderId: number | null;
  lastMessageAt: string | null;
  unreadCount: number;
  isOnline: boolean;
}

interface UseMessagingReturn {
  socket: Socket | null;
  isConnected: boolean;
  conversations: Conversation[];
  messages: Message[];
  currentConversation: Conversation | null;
  typingUsers: Set<number>;
  sendMessage: (recipientId: number, content: string, messageType?: string, fileUrl?: string, fileName?: string, fileSize?: number) => void;
  selectConversation: (conversation: Conversation) => void;
  startTyping: (recipientId: number) => void;
  stopTyping: (recipientId: number) => void;
  markAsRead: (conversationId: string) => void;
  refreshConversations: () => void;
  startNewConversation: (userId: number, userName: string, userEmail: string) => void;
}

export function useMessaging(): UseMessagingReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const typingTimeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('frontendToken') || localStorage.getItem('token');
    if (!token) {
      console.log('No token found, skipping WebSocket connection');
      return;
    }

    const socketUrl = window.location.origin;
    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      // Request conversations list on connect
      newSocket.emit('get_conversations');
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Handle conversations list
    newSocket.on('conversations_list', (convs: Conversation[]) => {
      setConversations(convs);
    });

    // Handle messages list
    newSocket.on('messages_list', ({ conversationId, messages: msgs }: { conversationId: string; messages: Message[] }) => {
      if (currentConversation?.id === conversationId) {
        setMessages(msgs);
      }
    });

    // Handle new message
    newSocket.on('new_message', (message: Message) => {
      // Add to messages if in current conversation
      if (currentConversation?.id === message.conversationId) {
        setMessages(prev => [...prev, message]);
        // Mark as read since we're viewing the conversation
        newSocket.emit('mark_read', { conversationId: message.conversationId });
      }
      
      // Update conversations list
      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: message.content,
              lastMessageType: message.messageType,
              lastMessageSenderId: message.senderId,
              lastMessageAt: message.createdAt,
              unreadCount: currentConversation?.id === message.conversationId ? 0 : conv.unreadCount + 1,
            };
          }
          return conv;
        });
        
        // Sort by last message time
        return updated.sort((a, b) => {
          const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return timeB - timeA;
        });
      });
    });

    // Handle message sent confirmation
    newSocket.on('message_sent', (message: Message) => {
      setMessages(prev => [...prev, message]);
      
      // Update conversations list
      setConversations(prev => {
        const exists = prev.some(conv => conv.id === message.conversationId);
        if (!exists) {
          // Refresh conversations to get the new one
          newSocket.emit('get_conversations');
          return prev;
        }
        
        return prev.map(conv => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: message.content,
              lastMessageType: message.messageType,
              lastMessageSenderId: message.senderId,
              lastMessageAt: message.createdAt,
            };
          }
          return conv;
        }).sort((a, b) => {
          const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return timeB - timeA;
        });
      });
    });

    // Handle message delivered
    newSocket.on('message_delivered', ({ messageId }: { messageId: number }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'delivered' } : msg
      ));
    });

    // Handle messages read
    newSocket.on('messages_read', ({ conversationId, readBy }: { conversationId: string; readBy: number }) => {
      setMessages(prev => prev.map(msg => 
        msg.conversationId === conversationId && msg.recipientId === readBy 
          ? { ...msg, status: 'read' } 
          : msg
      ));
    });

    // Handle typing indicators
    newSocket.on('user_typing', ({ conversationId, userId }: { conversationId: string; userId: number }) => {
      if (currentConversation?.id === conversationId) {
        setTypingUsers(prev => new Set(prev).add(userId));
        
        // Clear existing timeout
        const existingTimeout = typingTimeoutRef.current.get(userId);
        if (existingTimeout) clearTimeout(existingTimeout);
        
        // Set new timeout to remove typing indicator after 3 seconds
        const timeout = setTimeout(() => {
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.delete(userId);
            return next;
          });
        }, 3000);
        typingTimeoutRef.current.set(userId, timeout);
      }
    });

    newSocket.on('user_stopped_typing', ({ conversationId, userId }: { conversationId: string; userId: number }) => {
      if (currentConversation?.id === conversationId) {
        setTypingUsers(prev => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    });

    // Handle user online/offline
    newSocket.on('user_online', ({ userId }: { userId: number }) => {
      setConversations(prev => prev.map(conv => 
        conv.otherUserId === userId ? { ...conv, isOnline: true } : conv
      ));
    });

    newSocket.on('user_offline', ({ userId }: { userId: number }) => {
      setConversations(prev => prev.map(conv => 
        conv.otherUserId === userId ? { ...conv, isOnline: false } : conv
      ));
    });

    // Handle conversation updated
    newSocket.on('conversation_updated', (update: Partial<Conversation> & { id: string }) => {
      setConversations(prev => {
        const updated = prev.map(conv => 
          conv.id === update.id ? { ...conv, ...update } : conv
        );
        return updated.sort((a, b) => {
          const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return timeB - timeA;
        });
      });
    });

    // Handle errors
    newSocket.on('error', ({ message }: { message: string }) => {
      console.error('WebSocket error:', message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      // Clear all typing timeouts
      typingTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
      typingTimeoutRef.current.clear();
    };
  }, []);

  // Update messages when current conversation changes
  useEffect(() => {
    if (socket && currentConversation) {
      socket.emit('get_messages', { conversationId: currentConversation.id });
    }
  }, [socket, currentConversation?.id]);

  const sendMessage = useCallback((
    recipientId: number, 
    content: string, 
    messageType: string = 'text',
    fileUrl?: string,
    fileName?: string,
    fileSize?: number
  ) => {
    if (socket && isConnected) {
      socket.emit('send_message', { 
        recipientId, 
        content, 
        messageType,
        fileUrl,
        fileName,
        fileSize
      });
    }
  }, [socket, isConnected]);

  const selectConversation = useCallback((conversation: Conversation) => {
    setCurrentConversation(conversation);
    setMessages([]);
    setTypingUsers(new Set());
    
    if (socket) {
      socket.emit('get_messages', { conversationId: conversation.id });
      socket.emit('mark_read', { conversationId: conversation.id });
    }
    
    // Update unread count locally
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
    ));
  }, [socket]);

  const startTyping = useCallback((recipientId: number) => {
    if (socket && currentConversation) {
      socket.emit('typing_start', { 
        conversationId: currentConversation.id, 
        recipientId 
      });
    }
  }, [socket, currentConversation]);

  const stopTyping = useCallback((recipientId: number) => {
    if (socket && currentConversation) {
      socket.emit('typing_stop', { 
        conversationId: currentConversation.id, 
        recipientId 
      });
    }
  }, [socket, currentConversation]);

  const markAsRead = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('mark_read', { conversationId });
    }
  }, [socket]);

  const refreshConversations = useCallback(() => {
    if (socket) {
      socket.emit('get_conversations');
    }
  }, [socket]);

  const startNewConversation = useCallback((userId: number, userName: string, userEmail: string) => {
    // Get current user ID from token
    const token = localStorage.getItem('frontendToken') || localStorage.getItem('token');
    if (!token) return;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentUserId = payload.userId;
      const sorted = [currentUserId, userId].sort((a, b) => a - b);
      const conversationId = `conv_${sorted[0]}_${sorted[1]}`;
      
      const newConv: Conversation = {
        id: conversationId,
        otherUserId: userId,
        otherUserName: userName,
        otherUserEmail: userEmail,
        lastMessage: null,
        lastMessageType: null,
        lastMessageSenderId: null,
        lastMessageAt: null,
        unreadCount: 0,
        isOnline: false,
      };
      
      setCurrentConversation(newConv);
      setMessages([]);
      
      // Check if conversation already exists
      const existing = conversations.find(c => c.id === conversationId);
      if (existing) {
        selectConversation(existing);
      }
    } catch (error) {
      console.error('Error starting new conversation:', error);
    }
  }, [conversations, selectConversation]);

  return {
    socket,
    isConnected,
    conversations,
    messages,
    currentConversation,
    typingUsers,
    sendMessage,
    selectConversation,
    startTyping,
    stopTyping,
    markAsRead,
    refreshConversations,
    startNewConversation,
  };
}
