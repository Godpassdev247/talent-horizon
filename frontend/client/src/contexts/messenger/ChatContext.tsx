/**
 * Chat Context
 * 
 * Design: Liquid Glass - Neo-glassmorphism with organic, fluid shapes
 * Manages chat state including conversations, messages, and real-time updates
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  Conversation, 
  Message, 
  UserProfile,
  subscribeToConversations,
  subscribeToMessages,
  sendMessage as firebaseSendMessage,
  getOrCreateConversation,
  getUserProfile,
  markMessagesAsRead,
  setTypingStatus,
  subscribeToTypingStatus
} from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  currentMessages: Message[];
  currentChatPartner: UserProfile | null;
  isPartnerTyping: boolean;
  loading: boolean;
  selectConversation: (conversationId: string) => void;
  startConversation: (userId: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  clearCurrentConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [currentChatPartner, setCurrentChatPartner] = useState<UserProfile | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  // Subscribe to conversations
  useEffect(() => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToConversations(user.uid, (convs) => {
      setConversations(convs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Subscribe to messages when conversation is selected
  useEffect(() => {
    if (!currentConversation) {
      setCurrentMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(currentConversation.id, (msgs) => {
      setCurrentMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentConversation]);

  // Subscribe to typing status
  useEffect(() => {
    if (!currentConversation || !currentChatPartner) {
      setIsPartnerTyping(false);
      return;
    }

    const unsubscribe = subscribeToTypingStatus(
      currentConversation.id,
      currentChatPartner.uid,
      setIsPartnerTyping
    );

    return () => unsubscribe();
  }, [currentConversation, currentChatPartner]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (currentConversation && user) {
      markMessagesAsRead(currentConversation.id, user.uid);
    }
  }, [currentConversation, user, currentMessages]);

  const selectConversation = useCallback(async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation && user) {
      setCurrentConversation(conversation);
      
      // Get chat partner profile
      const partnerId = conversation.participants.find(p => p !== user.uid);
      if (partnerId) {
        const partner = await getUserProfile(partnerId);
        setCurrentChatPartner(partner);
      }
    }
  }, [conversations, user]);

  const startConversation = useCallback(async (userId: string) => {
    if (!user) return;
    
    const conversationId = await getOrCreateConversation(user.uid, userId);
    const partner = await getUserProfile(userId);
    
    // Find or wait for the conversation to appear
    const existingConv = conversations.find(c => c.id === conversationId);
    if (existingConv) {
      setCurrentConversation(existingConv);
    } else {
      // Create a temporary conversation object
      setCurrentConversation({
        id: conversationId,
        participants: [user.uid, userId],
        lastMessage: '',
        lastMessageTime: null as any,
        lastMessageSenderId: '',
        unreadCount: {}
      });
    }
    
    setCurrentChatPartner(partner);
  }, [user, conversations]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user || !currentConversation || !currentChatPartner) return;
    
    await firebaseSendMessage(
      currentConversation.id,
      user.uid,
      currentChatPartner.uid,
      text
    );
    
    // Clear typing status after sending
    setTypingStatus(currentConversation.id, user.uid, false);
  }, [user, currentConversation, currentChatPartner]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!user || !currentConversation) return;
    setTypingStatus(currentConversation.id, user.uid, isTyping);
  }, [user, currentConversation]);

  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
    setCurrentChatPartner(null);
    setCurrentMessages([]);
    setIsPartnerTyping(false);
  }, []);

  const value: ChatContextType = {
    conversations,
    currentConversation,
    currentMessages,
    currentChatPartner,
    isPartnerTyping,
    loading,
    selectConversation,
    startConversation,
    sendMessage,
    setTyping,
    clearCurrentConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
