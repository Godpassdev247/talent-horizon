// Firebase configuration for Talent Horizon messaging system
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, query, where, orderBy, onSnapshot, updateDoc, serverTimestamp, Timestamp, getDocs, limit } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhzXlStDkh7tdWNyw_pFkhmoIqCRJq06g",
  authDomain: "recruiter-message.firebaseapp.com",
  projectId: "recruiter-message",
  storageBucket: "recruiter-message.firebasestorage.app",
  messagingSenderId: "274352254612",
  appId: "1:274352254612:web:3cf8700a6f605b8ec3ce81",
  measurementId: "G-9JF2LGX7FY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection references
export const conversationsRef = collection(db, 'conversations');
export const messagesRef = collection(db, 'messages');

// Types
export interface FirebaseMessage {
  id?: string;
  conversationId: string;
  senderId: number;
  senderName: string;
  senderEmail: string;
  senderRole: 'user' | 'admin';
  recipientId: number;
  recipientName: string;
  recipientEmail: string;
  content: string;
  timestamp: Timestamp;
  isRead: boolean;
  attachments?: string[];
}

export interface FirebaseConversation {
  id?: string;
  participantIds: number[];
  participants: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
  }[];
  lastMessage: string;
  lastMessageTime: Timestamp;
  lastSenderId: number;
  unreadCount: { [key: number]: number };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Helper functions

// Get or create a conversation between two users
export async function getOrCreateConversation(
  user1: { id: number; name: string; email: string; role: 'user' | 'admin' },
  user2: { id: number; name: string; email: string; role: 'user' | 'admin' }
): Promise<string> {
  // Check if conversation already exists
  const q = query(
    conversationsRef,
    where('participantIds', 'array-contains', user1.id)
  );
  
  const snapshot = await getDocs(q);
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data() as FirebaseConversation;
    if (data.participantIds.includes(user2.id)) {
      return docSnap.id;
    }
  }
  
  // Create new conversation
  const newConversation: Omit<FirebaseConversation, 'id'> = {
    participantIds: [user1.id, user2.id],
    participants: [user1, user2],
    lastMessage: '',
    lastMessageTime: serverTimestamp() as Timestamp,
    lastSenderId: 0,
    unreadCount: { [user1.id]: 0, [user2.id]: 0 },
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };
  
  const docRef = await addDoc(conversationsRef, newConversation);
  return docRef.id;
}

// Send a message
export async function sendMessage(
  conversationId: string,
  sender: { id: number; name: string; email: string; role: 'user' | 'admin' },
  recipient: { id: number; name: string; email: string },
  content: string,
  attachments?: string[]
): Promise<string> {
  const message: Omit<FirebaseMessage, 'id'> = {
    conversationId,
    senderId: sender.id,
    senderName: sender.name,
    senderEmail: sender.email,
    senderRole: sender.role,
    recipientId: recipient.id,
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    content,
    timestamp: serverTimestamp() as Timestamp,
    isRead: false,
    attachments: attachments || [],
  };
  
  const docRef = await addDoc(messagesRef, message);
  
  // Update conversation with last message
  const conversationRef = doc(db, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    lastMessage: content,
    lastMessageTime: serverTimestamp(),
    lastSenderId: sender.id,
    updatedAt: serverTimestamp(),
    [`unreadCount.${recipient.id}`]: (await getUnreadCount(conversationId, recipient.id)) + 1,
  });
  
  return docRef.id;
}

// Get unread count for a user in a conversation
async function getUnreadCount(conversationId: string, userId: number): Promise<number> {
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    where('recipientId', '==', userId),
    where('isRead', '==', false)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Mark messages as read
export async function markMessagesAsRead(conversationId: string, userId: number): Promise<void> {
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    where('recipientId', '==', userId),
    where('isRead', '==', false)
  );
  
  const snapshot = await getDocs(q);
  
  const updates = snapshot.docs.map(docSnap => 
    updateDoc(doc(db, 'messages', docSnap.id), { isRead: true })
  );
  
  await Promise.all(updates);
  
  // Reset unread count in conversation
  const conversationRef = doc(db, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    [`unreadCount.${userId}`]: 0,
  });
}

// Subscribe to conversations for a user
export function subscribeToConversations(
  userId: number,
  callback: (conversations: (FirebaseConversation & { id: string })[]) => void
): () => void {
  // Remove orderBy to avoid index requirement - sort client-side instead
  const q = query(
    conversationsRef,
    where('participantIds', 'array-contains', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    let conversations = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as (FirebaseConversation & { id: string })[];
    
    // Sort by updatedAt client-side
    conversations.sort((a, b) => {
      const timeA = a.updatedAt?.toMillis?.() || 0;
      const timeB = b.updatedAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    
    callback(conversations);
  }, (error) => {
    console.error('Error subscribing to conversations:', error);
    callback([]);
  });
}

// Subscribe to messages in a conversation
export function subscribeToMessages(
  conversationId: string,
  callback: (messages: (FirebaseMessage & { id: string })[]) => void
): () => void {
  // Remove orderBy to avoid index requirement - sort client-side instead
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId)
  );
  
  return onSnapshot(q, (snapshot) => {
    let messages = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as (FirebaseMessage & { id: string })[];
    
    // Sort by timestamp client-side
    messages.sort((a, b) => {
      const timeA = a.timestamp?.toMillis?.() || 0;
      const timeB = b.timestamp?.toMillis?.() || 0;
      return timeA - timeB;
    });
    
    callback(messages);
  }, (error) => {
    console.error('Error subscribing to messages:', error);
    callback([]);
  });
}

// Get all users (for starting new conversations) - this would typically come from your backend
export async function getAvailableUsers(): Promise<{ id: number; name: string; email: string; role: 'user' | 'admin' }[]> {
  // This is a placeholder - in production, you'd fetch this from your backend API
  return [];
}

export { db, app };
