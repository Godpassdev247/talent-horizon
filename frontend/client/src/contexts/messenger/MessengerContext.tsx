/**
 * Messenger Context for Talent Horizon
 * 
 * Manages chat state including conversations, messages, and real-time updates
 * Integrated with Talent Horizon user system
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
  subscribeToTypingStatus,
  setupPresence,
  createOrUpdateUserProfile
} from '@/lib/messenger-firebase';

// User type from Talent Horizon
interface TalentHorizonUser {
  id: number | string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'employer';
  photoURL?: string;
  position?: string;
  companyName?: string;
  isVerified?: boolean;
}

interface MessengerContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  currentMessages: Message[];
  currentChatPartner: UserProfile | null;
  isPartnerTyping: boolean;
  loading: boolean;
  selectConversation: (conversationId: string) => void;
  startConversation: (partnerId: string, partnerDetails: { name: string; email: string; role: string }) => Promise<void>;
  sendMessage: (text: string, attachments?: string[]) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  clearCurrentConversation: () => void;
}

const MessengerContext = createContext<MessengerContextType | undefined>(undefined);

export const useMessenger = () => {
  const context = useContext(MessengerContext);
  if (context === undefined) {
    throw new Error('useMessenger must be used within a MessengerProvider');
  }
  return context;
};

interface MessengerProviderProps {
  children: React.ReactNode;
  currentUser: TalentHorizonUser | null;
}

export const MessengerProvider: React.FC<MessengerProviderProps> = ({ children, currentUser }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [currentChatPartner, setCurrentChatPartner] = useState<UserProfile | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = currentUser ? String(currentUser.id) : null;

  // Set up user presence and profile when user logs in
  useEffect(() => {
    if (!currentUser || !userId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Create/update user profile in Firebase
    createOrUpdateUserProfile({
      id: userId,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      photoURL: currentUser.photoURL,
      position: currentUser.position,
      companyName: currentUser.companyName,
      isVerified: currentUser.isVerified
    });

    // Set up presence tracking
    const cleanupPresence = setupPresence(userId);

    return () => {
      cleanupPresence();
    };
  }, [currentUser, userId]);

  // Subscribe to conversations
  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToConversations(userId, (convs) => {
      setConversations(convs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

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
    if (currentConversation && userId) {
      markMessagesAsRead(currentConversation.id, userId);
    }
  }, [currentConversation, userId, currentMessages]);

  const selectConversation = useCallback(async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation && userId) {
      setCurrentConversation(conversation);
      
      // Get chat partner from participant details
      const partnerId = conversation.participants.find(p => p !== userId);
      if (partnerId) {
        const partnerDetails = conversation.participantDetails?.[partnerId];
        if (partnerDetails) {
          setCurrentChatPartner({
            uid: partnerId,
            displayName: partnerDetails.name,
            email: partnerDetails.email,
            photoURL: partnerDetails.photoURL || '',
            online: false,
            lastSeen: null as any,
            role: partnerDetails.role as any,
            position: partnerDetails.position,
            companyName: partnerDetails.companyName,
            isVerified: partnerDetails.isVerified
          });
        } else {
          // Fallback to fetching from users collection
          const partner = await getUserProfile(partnerId);
          setCurrentChatPartner(partner);
        }
      }
    }
  }, [conversations, userId]);

  const startConversation = useCallback(async (
    partnerId: string, 
    partnerDetails: { name: string; email: string; role: string; photoURL?: string; position?: string; companyName?: string; isVerified?: boolean }
  ) => {
    if (!currentUser || !userId) return;
    
    const conversationId = await getOrCreateConversation(
      {
        id: userId,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        photoURL: currentUser.photoURL,
        position: currentUser.position,
        companyName: currentUser.companyName,
        isVerified: currentUser.isVerified
      },
      {
        id: partnerId,
        name: partnerDetails.name,
        email: partnerDetails.email,
        role: partnerDetails.role,
        photoURL: partnerDetails.photoURL,
        position: partnerDetails.position,
        companyName: partnerDetails.companyName,
        isVerified: partnerDetails.isVerified
      }
    );
    
    // Find or create the conversation object
    const existingConv = conversations.find(c => c.id === conversationId);
    if (existingConv) {
      setCurrentConversation(existingConv);
    } else {
      // Create a temporary conversation object
      setCurrentConversation({
        id: conversationId,
        participants: [userId, partnerId],
        participantDetails: {
          [userId]: {
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            photoURL: currentUser.photoURL,
            position: currentUser.position,
            companyName: currentUser.companyName,
            isVerified: currentUser.isVerified
          },
          [partnerId]: partnerDetails
        },
        lastMessage: '',
        lastMessageTime: null as any,
        lastMessageSenderId: '',
        unreadCount: {},
        createdAt: null as any
      } as Conversation);
    }
    
    setCurrentChatPartner({
      uid: partnerId,
      displayName: partnerDetails.name,
      email: partnerDetails.email,
      photoURL: partnerDetails.photoURL || '',
      online: false,
      lastSeen: null as any,
      role: partnerDetails.role as any,
      position: partnerDetails.position,
      companyName: partnerDetails.companyName,
      isVerified: partnerDetails.isVerified
    });
  }, [currentUser, userId, conversations]);

  const sendMessage = useCallback(async (text: string, attachments?: string[]) => {
    if (!userId || !currentConversation || !currentChatPartner) return;
    
    await firebaseSendMessage(
      currentConversation.id,
      userId,
      currentChatPartner.uid,
      text,
      attachments
    );
    
    // Clear typing status after sending
    setTypingStatus(currentConversation.id, userId, false);
  }, [userId, currentConversation, currentChatPartner]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!userId || !currentConversation) return;
    setTypingStatus(currentConversation.id, userId, isTyping);
  }, [userId, currentConversation]);

  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
    setCurrentChatPartner(null);
    setCurrentMessages([]);
    setIsPartnerTyping(false);
  }, []);

  const value: MessengerContextType = {
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
    <MessengerContext.Provider value={value}>
      {children}
    </MessengerContext.Provider>
  );
};

export default MessengerContext;
