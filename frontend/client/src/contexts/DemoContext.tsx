/**
 * Demo Context
 * 
 * Design: Liquid Glass - Neo-glassmorphism with organic, fluid shapes
 * Provides simulated data and functionality for demo mode without Firebase
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

// Demo user data
export interface DemoUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  online: boolean;
  lastSeen: Date;
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

export interface DemoMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachment?: FileAttachment;
}

export interface DemoConversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  lastMessageSenderId: string;
  unreadCount: { [userId: string]: number };
}

// Demo contacts
const demoContacts: DemoUser[] = [
  {
    uid: 'contact-1',
    displayName: 'Sarah Johnson',
    email: 'sarah@example.com',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    online: true,
    lastSeen: new Date()
  },
  {
    uid: 'contact-2',
    displayName: 'Michael Chen',
    email: 'michael@example.com',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    online: true,
    lastSeen: new Date()
  },
  {
    uid: 'contact-3',
    displayName: 'Emily Davis',
    email: 'emily@example.com',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    online: false,
    lastSeen: new Date(Date.now() - 3600000)
  },
  {
    uid: 'contact-4',
    displayName: 'James Wilson',
    email: 'james@example.com',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    online: false,
    lastSeen: new Date(Date.now() - 7200000)
  },
  {
    uid: 'contact-5',
    displayName: 'Lisa Anderson',
    email: 'lisa@example.com',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    online: true,
    lastSeen: new Date()
  }
];

// Demo current user
const demoCurrentUser: DemoUser = {
  uid: 'demo-user',
  displayName: 'Demo User',
  email: 'demo@messenger.app',
  photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  online: true,
  lastSeen: new Date()
};

// Initial demo conversations
const initialConversations: DemoConversation[] = [
  {
    id: 'conv-1',
    participants: ['demo-user', 'contact-1'],
    lastMessage: 'Hey! How are you doing?',
    lastMessageTime: new Date(Date.now() - 300000),
    lastMessageSenderId: 'contact-1',
    unreadCount: { 'demo-user': 2, 'contact-1': 0 }
  },
  {
    id: 'conv-2',
    participants: ['demo-user', 'contact-2'],
    lastMessage: 'The meeting is at 3pm tomorrow',
    lastMessageTime: new Date(Date.now() - 3600000),
    lastMessageSenderId: 'demo-user',
    unreadCount: { 'demo-user': 0, 'contact-2': 0 }
  },
  {
    id: 'conv-3',
    participants: ['demo-user', 'contact-5'],
    lastMessage: 'Thanks for your help! 🙏',
    lastMessageTime: new Date(Date.now() - 86400000),
    lastMessageSenderId: 'contact-5',
    unreadCount: { 'demo-user': 1, 'contact-5': 0 }
  }
];

// Initial demo messages
const initialMessages: { [convId: string]: DemoMessage[] } = {
  'conv-1': [
    {
      id: 'msg-1-1',
      senderId: 'contact-1',
      receiverId: 'demo-user',
      text: 'Hi there! 👋',
      timestamp: new Date(Date.now() - 600000),
      status: 'read'
    },
    {
      id: 'msg-1-2',
      senderId: 'demo-user',
      receiverId: 'contact-1',
      text: 'Hey Sarah! Good to hear from you!',
      timestamp: new Date(Date.now() - 540000),
      status: 'read'
    },
    {
      id: 'msg-1-3',
      senderId: 'contact-1',
      receiverId: 'demo-user',
      text: 'Hey! How are you doing?',
      timestamp: new Date(Date.now() - 300000),
      status: 'delivered'
    }
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      senderId: 'contact-2',
      receiverId: 'demo-user',
      text: 'Can we schedule a meeting?',
      timestamp: new Date(Date.now() - 7200000),
      status: 'read'
    },
    {
      id: 'msg-2-2',
      senderId: 'demo-user',
      receiverId: 'contact-2',
      text: 'Sure! What time works for you?',
      timestamp: new Date(Date.now() - 7000000),
      status: 'read'
    },
    {
      id: 'msg-2-3',
      senderId: 'contact-2',
      receiverId: 'demo-user',
      text: 'How about tomorrow afternoon?',
      timestamp: new Date(Date.now() - 3700000),
      status: 'read'
    },
    {
      id: 'msg-2-4',
      senderId: 'demo-user',
      receiverId: 'contact-2',
      text: 'The meeting is at 3pm tomorrow',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    }
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      senderId: 'demo-user',
      receiverId: 'contact-5',
      text: 'I sent you the files',
      timestamp: new Date(Date.now() - 90000000),
      status: 'read'
    },
    {
      id: 'msg-3-2',
      senderId: 'contact-5',
      receiverId: 'demo-user',
      text: 'Thanks for your help! 🙏',
      timestamp: new Date(Date.now() - 86400000),
      status: 'delivered'
    }
  ]
};

// Auto-reply messages
const autoReplies = [
  "That's great! 😊",
  "I'll get back to you on that.",
  "Sounds good to me!",
  "Let me think about it...",
  "Thanks for letting me know!",
  "Perfect! 👍",
  "I agree with you.",
  "That makes sense.",
  "Can you tell me more?",
  "Interesting! 🤔"
];

interface DemoContextType {
  isDemo: boolean;
  currentUser: DemoUser | null;
  contacts: DemoUser[];
  conversations: DemoConversation[];
  messages: { [convId: string]: DemoMessage[] };
  currentConversation: DemoConversation | null;
  currentChatPartner: DemoUser | null;
  isPartnerTyping: boolean;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
  selectConversation: (convId: string) => void;
  startConversation: (contactId: string) => void;
  sendMessage: (text: string, attachment?: FileAttachment) => void;
  clearCurrentConversation: () => void;
  searchContacts: (term: string) => DemoUser[];
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

interface DemoProviderProps {
  children: React.ReactNode;
}

export const DemoProvider: React.FC<DemoProviderProps> = ({ children }) => {
  // Auto-login: initialize with demo user directly (no login page)
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(demoCurrentUser);
  const [conversations, setConversations] = useState<DemoConversation[]>(initialConversations);
  const [messages, setMessages] = useState<{ [convId: string]: DemoMessage[] }>(initialMessages);
  const [currentConversation, setCurrentConversation] = useState<DemoConversation | null>(null);
  const [currentChatPartner, setCurrentChatPartner] = useState<DemoUser | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setCurrentUser(demoCurrentUser);
      setLoading(false);
    }, 1000);
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
      const partner = demoContacts.find(c => c.uid === partnerId);
      setCurrentChatPartner(partner || null);
      
      // Clear unread count
      setConversations(prev => prev.map(c => 
        c.id === convId 
          ? { ...c, unreadCount: { ...c.unreadCount, [currentUser.uid]: 0 } }
          : c
      ));
      
      // Mark messages as read
      setMessages(prev => ({
        ...prev,
        [convId]: prev[convId]?.map(msg => 
          msg.receiverId === currentUser.uid ? { ...msg, status: 'read' as const } : msg
        ) || []
      }));
    }
  }, [conversations, currentUser]);

  const startConversation = useCallback((contactId: string) => {
    if (!currentUser) return;
    
    // Check if conversation exists
    const existingConv = conversations.find(c => 
      c.participants.includes(contactId) && c.participants.includes(currentUser.uid)
    );
    
    if (existingConv) {
      selectConversation(existingConv.id);
      return;
    }
    
    // Create new conversation
    const newConvId = `conv-${Date.now()}`;
    const newConv: DemoConversation = {
      id: newConvId,
      participants: [currentUser.uid, contactId],
      lastMessage: '',
      lastMessageTime: new Date(),
      lastMessageSenderId: '',
      unreadCount: { [currentUser.uid]: 0, [contactId]: 0 }
    };
    
    setConversations(prev => [newConv, ...prev]);
    setMessages(prev => ({ ...prev, [newConvId]: [] }));
    
    const partner = demoContacts.find(c => c.uid === contactId);
    setCurrentConversation(newConv);
    setCurrentChatPartner(partner || null);
  }, [currentUser, conversations, selectConversation]);

  const sendMessage = useCallback((text: string, attachment?: FileAttachment) => {
    if (!currentUser || !currentConversation || !currentChatPartner) return;
    
    const displayText = attachment ? (text || `Sent ${attachment.type}`) : text;
    
    const newMessage: DemoMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.uid,
      receiverId: currentChatPartner.uid,
      text,
      timestamp: new Date(),
      status: 'sent',
      attachment
    };
    
    // Add message
    setMessages(prev => ({
      ...prev,
      [currentConversation.id]: [...(prev[currentConversation.id] || []), newMessage]
    }));
    
    // Update conversation
    setConversations(prev => prev.map(c => 
      c.id === currentConversation.id
        ? { ...c, lastMessage: displayText, lastMessageTime: new Date(), lastMessageSenderId: currentUser.uid }
        : c
    ).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()));
    
    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [currentConversation.id]: prev[currentConversation.id]?.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
        ) || []
      }));
    }, 500);
    
    // Simulate auto-reply if partner is online (only for text messages)
    if (currentChatPartner.online && !attachment) {
      // Show typing indicator
      setTimeout(() => setIsPartnerTyping(true), 1000);
      
      // Send reply
      setTimeout(() => {
        setIsPartnerTyping(false);
        
        const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const replyMessage: DemoMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentChatPartner.uid,
          receiverId: currentUser.uid,
          text: replyText,
          timestamp: new Date(),
          status: 'delivered'
        };
        
        setMessages(prev => ({
          ...prev,
          [currentConversation.id]: [...(prev[currentConversation.id] || []), replyMessage]
        }));
        
        setConversations(prev => prev.map(c => 
          c.id === currentConversation.id
            ? { ...c, lastMessage: replyText, lastMessageTime: new Date(), lastMessageSenderId: currentChatPartner.uid }
            : c
        ).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()));
        
        // Mark user's message as read
        setMessages(prev => ({
          ...prev,
          [currentConversation.id]: prev[currentConversation.id]?.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
          ) || []
        }));
      }, 2500 + Math.random() * 1500);
    }
  }, [currentUser, currentConversation, currentChatPartner]);

  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
    setCurrentChatPartner(null);
    setIsPartnerTyping(false);
  }, []);

  const searchContacts = useCallback((term: string): DemoUser[] => {
    if (!term.trim()) return demoContacts;
    return demoContacts.filter(c => 
      c.displayName.toLowerCase().includes(term.toLowerCase())
    );
  }, []);

  const value: DemoContextType = {
    isDemo: true,
    currentUser,
    contacts: demoContacts,
    conversations,
    messages,
    currentConversation,
    currentChatPartner,
    isPartnerTyping,
    loading,
    signIn,
    signOut,
    selectConversation,
    startConversation,
    sendMessage,
    clearCurrentConversation,
    searchContacts
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

export default DemoContext;
