/**
 * Firebase Chat Context
 * 
 * Real-time chat functionality using Firebase Firestore
 * Replaces DemoContext with live Firebase data
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  subscribeToConversations, 
  subscribeToMessages, 
  sendMessage as firebaseSendMessage,
  markMessagesAsRead,
  getOrCreateConversation,
  FirebaseConversation,
  FirebaseMessage
} from '@/lib/firebase';

// User interface matching the app's user structure
export interface ChatUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  online: boolean;
  lastSeen: Date;
  role?: 'user' | 'admin';
  position?: string;
  companyName?: string;
  companyAddress?: string;
  isVerified?: boolean;
}

// File attachment interface
export interface FileAttachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'document' | 'other';
  url: string;
  size: number;
  mimeType: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachment?: FileAttachment;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  lastMessageSenderId: string;
  unreadCount: { [userId: string]: number };
  participantDetails?: ChatUser[];
}

interface FirebaseChatContextType {
  isDemo: boolean;
  currentUser: ChatUser | null;
  contacts: ChatUser[];
  conversations: ChatConversation[];
  messages: { [convId: string]: ChatMessage[] };
  currentMessages: ChatMessage[];
  currentConversation: ChatConversation | null;
  currentChatPartner: ChatUser | null;
  isPartnerTyping: boolean;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
  selectConversation: (convId: string) => void;
  startConversation: (contactId: string) => void;
  sendMessage: (text: string, attachment?: FileAttachment) => void;
  clearCurrentConversation: () => void;
  searchContacts: (term: string) => ChatUser[];
  setCurrentUser: (user: ChatUser | null) => void;
}

const FirebaseChatContext = createContext<FirebaseChatContextType | undefined>(undefined);

export const useFirebaseChat = () => {
  const context = useContext(FirebaseChatContext);
  if (context === undefined) {
    throw new Error('useFirebaseChat must be used within a FirebaseChatProvider');
  }
  return context;
};

interface FirebaseChatProviderProps {
  children: React.ReactNode;
  initialUser?: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    photoURL?: string;
  };
}

export const FirebaseChatProvider: React.FC<FirebaseChatProviderProps> = ({ children, initialUser }) => {
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(
    initialUser ? {
      uid: String(initialUser.id),
      displayName: initialUser.name,
      email: initialUser.email,
      photoURL: initialUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(initialUser.name)}&background=1e3a5f&color=fff`,
      online: true,
      lastSeen: new Date(),
      role: initialUser.role
    } : null
  );
  
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<{ [convId: string]: ChatMessage[] }>({});
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [currentChatPartner, setCurrentChatPartner] = useState<ChatUser | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ChatUser[]>([]);

  // Subscribe to conversations when user is set
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const userId = parseInt(currentUser.uid);
    
    const unsubscribe = subscribeToConversations(userId, (firebaseConvs) => {
      const mappedConvs: ChatConversation[] = firebaseConvs.map(conv => {
        // Extract participant details
        const participantDetails = conv.participants?.map(p => ({
          uid: String(p.id),
          displayName: p.name,
          email: p.email,
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1e3a5f&color=fff`,
          online: true,
          lastSeen: new Date(),
          role: p.role,
          position: p.position,
          companyName: p.companyName,
          companyAddress: p.companyAddress,
          isVerified: p.isVerified
        })) || [];

        // Build unread count with string keys
        const unreadCount: { [key: string]: number } = {};
        if (conv.unreadCount) {
          Object.entries(conv.unreadCount).forEach(([key, value]) => {
            unreadCount[key] = value as number;
          });
        }

        return {
          id: conv.id,
          participants: conv.participantIds.map(String),
          lastMessage: conv.lastMessage || '',
          lastMessageTime: conv.lastMessageTime?.toDate?.() || new Date(),
          lastMessageSenderId: String(conv.lastSenderId || ''),
          unreadCount,
          participantDetails
        };
      });

      setConversations(mappedConvs);
      
      // Extract unique contacts from conversations
      const contactsMap = new Map<string, ChatUser>();
      mappedConvs.forEach(conv => {
        conv.participantDetails?.forEach(p => {
          if (p.uid !== currentUser.uid) {
            contactsMap.set(p.uid, p);
          }
        });
      });
      setContacts(Array.from(contactsMap.values()));
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Subscribe to messages when conversation is selected
  useEffect(() => {
    if (!currentConversation) return;

    const unsubscribe = subscribeToMessages(currentConversation.id, (firebaseMsgs) => {
      const mappedMsgs: ChatMessage[] = firebaseMsgs.map(msg => ({
        id: msg.id,
        senderId: String(msg.senderId),
        receiverId: String(msg.recipientId),
        text: msg.content,
        timestamp: msg.timestamp?.toDate?.() || new Date(),
        status: msg.isRead ? 'read' : 'delivered'
      }));

      setMessages(prev => ({
        ...prev,
        [currentConversation.id]: mappedMsgs
      }));
    });

    return () => unsubscribe();
  }, [currentConversation?.id]);

  const signIn = useCallback(() => {
    // Already signed in via initialUser
  }, []);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    setCurrentConversation(null);
    setCurrentChatPartner(null);
  }, []);

  const selectConversation = useCallback((convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv && currentUser) {
      setCurrentConversation(conv);
      
      // Find chat partner
      const partnerId = conv.participants.find(p => p !== currentUser.uid);
      const partner = conv.participantDetails?.find(p => p.uid === partnerId) || 
        contacts.find(c => c.uid === partnerId);
      setCurrentChatPartner(partner || null);
      
      // Mark messages as read
      markMessagesAsRead(convId, parseInt(currentUser.uid)).catch(console.error);
    }
  }, [conversations, currentUser, contacts]);

  const startConversation = useCallback(async (contactId: string) => {
    if (!currentUser) return;
    
    // Check if conversation exists
    const existingConv = conversations.find(c => 
      c.participants.includes(contactId) && c.participants.includes(currentUser.uid)
    );
    
    if (existingConv) {
      selectConversation(existingConv.id);
      return;
    }
    
    // Create new conversation via Firebase
    const contact = contacts.find(c => c.uid === contactId);
    if (!contact) return;

    try {
      const convId = await getOrCreateConversation(
        { 
          id: parseInt(currentUser.uid), 
          name: currentUser.displayName, 
          email: currentUser.email, 
          role: currentUser.role || 'user' 
        },
        { 
          id: parseInt(contactId), 
          name: contact.displayName, 
          email: contact.email, 
          role: contact.role || 'user' 
        }
      );
      
      // The subscription will pick up the new conversation
      setTimeout(() => selectConversation(convId), 500);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  }, [currentUser, conversations, contacts, selectConversation]);

  const sendMessageHandler = useCallback(async (text: string, attachment?: FileAttachment) => {
    if (!currentUser || !currentConversation || !currentChatPartner) return;
    
    try {
      await firebaseSendMessage(
        currentConversation.id,
        { 
          id: parseInt(currentUser.uid), 
          name: currentUser.displayName, 
          email: currentUser.email, 
          role: currentUser.role || 'user' 
        },
        { 
          id: parseInt(currentChatPartner.uid), 
          name: currentChatPartner.displayName, 
          email: currentChatPartner.email 
        },
        text,
        attachment ? [attachment.url] : undefined
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [currentUser, currentConversation, currentChatPartner]);

  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
    setCurrentChatPartner(null);
  }, []);

  const searchContacts = useCallback((term: string): ChatUser[] => {
    if (!term.trim()) return contacts;
    const lowerTerm = term.toLowerCase();
    return contacts.filter(c => 
      c.displayName.toLowerCase().includes(lowerTerm) ||
      c.email.toLowerCase().includes(lowerTerm)
    );
  }, [contacts]);

  // Compute currentMessages from the messages object
  const currentMessages = currentConversation ? (messages[currentConversation.id] || []) : [];

  const value: FirebaseChatContextType = {
    isDemo: false,
    currentUser,
    contacts,
    conversations,
    messages,
    currentMessages,
    currentConversation,
    currentChatPartner,
    isPartnerTyping,
    loading,
    signIn,
    signOut,
    selectConversation,
    startConversation,
    sendMessage: sendMessageHandler,
    clearCurrentConversation,
    searchContacts,
    setCurrentUser
  };

  return (
    <FirebaseChatContext.Provider value={value}>
      {children}
    </FirebaseChatContext.Provider>
  );
};

// Also export as useDemo for compatibility with existing components
export const useDemo = useFirebaseChat;
export const DemoProvider = FirebaseChatProvider;
