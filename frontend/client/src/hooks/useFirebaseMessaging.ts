// Custom hook for Firebase Firestore messaging
import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToConversations,
  subscribeToMessages,
  sendMessage,
  markMessagesAsRead,
  getOrCreateConversation,
  FirebaseConversation,
  FirebaseMessage,
} from '../lib/firebase';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface UseFirebaseMessagingReturn {
  conversations: (FirebaseConversation & { id: string })[];
  messages: (FirebaseMessage & { id: string })[];
  selectedConversation: (FirebaseConversation & { id: string }) | null;
  loading: boolean;
  error: string | null;
  totalUnreadCount: number;
  selectConversation: (conversationId: string) => void;
  sendNewMessage: (content: string, attachments?: string[]) => Promise<void>;
  startNewConversation: (recipient: User, initialMessage: string) => Promise<string>;
  markAsRead: () => Promise<void>;
}

export function useFirebaseMessaging(currentUser: User | null): UseFirebaseMessagingReturn {
  const [conversations, setConversations] = useState<(FirebaseConversation & { id: string })[]>([]);
  const [messages, setMessages] = useState<(FirebaseMessage & { id: string })[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to conversations
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToConversations(currentUser.id, (convs) => {
        setConversations(convs);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError('Failed to load conversations');
      setLoading(false);
    }
  }, [currentUser?.id]);

  // Subscribe to messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(selectedConversationId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedConversationId]);

  // Get selected conversation object
  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  // Calculate total unread count
  const totalUnreadCount = conversations.reduce((total, conv) => {
    if (currentUser && conv.unreadCount) {
      return total + (conv.unreadCount[currentUser.id] || 0);
    }
    return total;
  }, 0);

  // Select a conversation
  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
  }, []);

  // Send a new message
  const sendNewMessage = useCallback(async (content: string, attachments?: string[]) => {
    if (!currentUser || !selectedConversation) {
      throw new Error('No user or conversation selected');
    }

    // Find the recipient (the other participant)
    const recipient = selectedConversation.participants.find(p => p.id !== currentUser.id);
    if (!recipient) {
      throw new Error('Recipient not found');
    }

    await sendMessage(
      selectedConversation.id,
      currentUser,
      recipient,
      content,
      attachments
    );
  }, [currentUser, selectedConversation]);

  // Start a new conversation
  const startNewConversation = useCallback(async (recipient: User, initialMessage: string): Promise<string> => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const conversationId = await getOrCreateConversation(currentUser, recipient);
    
    await sendMessage(
      conversationId,
      currentUser,
      recipient,
      initialMessage
    );

    setSelectedConversationId(conversationId);
    return conversationId;
  }, [currentUser]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!currentUser || !selectedConversationId) return;
    
    await markMessagesAsRead(selectedConversationId, currentUser.id);
  }, [currentUser, selectedConversationId]);

  // Auto-mark as read when viewing messages
  useEffect(() => {
    if (selectedConversationId && currentUser && messages.length > 0) {
      const hasUnread = messages.some(m => m.recipientId === currentUser.id && !m.isRead);
      if (hasUnread) {
        markAsRead();
      }
    }
  }, [selectedConversationId, currentUser, messages, markAsRead]);

  return {
    conversations,
    messages,
    selectedConversation,
    loading,
    error,
    totalUnreadCount,
    selectConversation,
    sendNewMessage,
    startNewConversation,
    markAsRead,
  };
}

export default useFirebaseMessaging;
