/**
 * Firebase Messenger Configuration for Talent Horizon
 * 
 * Integrated messaging system using existing Firebase credentials
 * Supports real-time messaging, presence, and typing indicators
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { 
  getDatabase, 
  ref, 
  set, 
  onValue, 
  onDisconnect,
  serverTimestamp as rtdbServerTimestamp
} from 'firebase/database';

// Firebase configuration - using existing Talent Horizon credentials
const firebaseConfig = {
  apiKey: "AIzaSyDhzXlStDkh7tdWNyw_pFkhmoIqCRJq06g",
  authDomain: "recruiter-message.firebaseapp.com",
  projectId: "recruiter-message",
  storageBucket: "recruiter-message.firebasestorage.app",
  messagingSenderId: "274352254612",
  appId: "1:274352254612:web:3cf8700a6f605b8ec3ce81",
  measurementId: "G-9JF2LGX7FY",
  databaseURL: "https://recruiter-message-default-rtdb.firebaseio.com"
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Message types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Timestamp;
  status: 'sent' | 'delivered' | 'read';
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: {
    [key: string]: {
      name: string;
      email: string;
      role: 'user' | 'admin' | 'employer';
      photoURL?: string;
      position?: string;
      companyName?: string;
      isVerified?: boolean;
    }
  };
  lastMessage: string;
  lastMessageTime: Timestamp;
  lastMessageSenderId: string;
  unreadCount: { [userId: string]: number };
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  online: boolean;
  lastSeen: Timestamp;
  role?: 'user' | 'admin' | 'employer';
  position?: string;
  companyName?: string;
  isVerified?: boolean;
}

// User presence management
export const setupPresence = (userId: string) => {
  const userStatusRef = ref(rtdb, `/status/${userId}`);
  const userStatusFirestoreRef = doc(db, 'users', userId);
  
  const isOfflineForRTDB = {
    state: 'offline',
    lastChanged: rtdbServerTimestamp()
  };
  
  const isOnlineForRTDB = {
    state: 'online',
    lastChanged: rtdbServerTimestamp()
  };
  
  // Monitor connection state
  const connectedRef = ref(rtdb, '.info/connected');
  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) {
      return;
    }
    
    onDisconnect(userStatusRef).set(isOfflineForRTDB).then(() => {
      set(userStatusRef, isOnlineForRTDB);
      updateDoc(userStatusFirestoreRef, {
        online: true,
        lastSeen: serverTimestamp()
      }).catch(() => {
        // User doc might not exist yet, create it
        setDoc(userStatusFirestoreRef, {
          online: true,
          lastSeen: serverTimestamp()
        }, { merge: true });
      });
    });
  });
  
  // Return cleanup function
  return () => {
    set(userStatusRef, isOfflineForRTDB);
    updateDoc(userStatusFirestoreRef, {
      online: false,
      lastSeen: serverTimestamp()
    }).catch(() => {});
  };
};

// Create or update user profile
export const createOrUpdateUserProfile = async (user: {
  id: string | number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'employer';
  photoURL?: string;
  position?: string;
  companyName?: string;
  isVerified?: boolean;
}) => {
  const userId = String(user.id);
  await setDoc(doc(db, 'users', userId), {
    uid: userId,
    displayName: user.name,
    email: user.email,
    photoURL: user.photoURL || '',
    role: user.role,
    position: user.position || '',
    companyName: user.companyName || '',
    isVerified: user.isVerified || false,
    lastSeen: serverTimestamp(),
    online: true
  }, { merge: true });
};

// Get or create conversation between two users
export const getOrCreateConversation = async (
  user1: { id: string; name: string; email: string; role: string; photoURL?: string; position?: string; companyName?: string; isVerified?: boolean },
  user2: { id: string; name: string; email: string; role: string; photoURL?: string; position?: string; companyName?: string; isVerified?: boolean }
): Promise<string> => {
  const conversationsRef = collection(db, 'messenger_conversations');
  
  // Check if conversation exists
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', user1.id)
  );
  
  const querySnapshot = await getDocs(q);
  let conversationId: string | null = null;
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.participants.includes(user2.id)) {
      conversationId = doc.id;
    }
  });
  
  if (conversationId) {
    return conversationId;
  }
  
  // Create new conversation
  const newConversation = await addDoc(conversationsRef, {
    participants: [user1.id, user2.id],
    participantDetails: {
      [user1.id]: {
        name: user1.name,
        email: user1.email,
        role: user1.role,
        photoURL: user1.photoURL || '',
        position: user1.position || '',
        companyName: user1.companyName || '',
        isVerified: user1.isVerified || false
      },
      [user2.id]: {
        name: user2.name,
        email: user2.email,
        role: user2.role,
        photoURL: user2.photoURL || '',
        position: user2.position || '',
        companyName: user2.companyName || '',
        isVerified: user2.isVerified || false
      }
    },
    lastMessage: '',
    lastMessageTime: serverTimestamp(),
    lastMessageSenderId: '',
    unreadCount: { [user1.id]: 0, [user2.id]: 0 },
    createdAt: serverTimestamp()
  });
  
  return newConversation.id;
};

// Send a message
export const sendMessage = async (
  conversationId: string, 
  senderId: string, 
  receiverId: string, 
  text: string,
  attachments?: string[]
) => {
  const messagesRef = collection(db, 'messenger_conversations', conversationId, 'messages');
  const conversationRef = doc(db, 'messenger_conversations', conversationId);
  
  // Add message
  const messageDoc = await addDoc(messagesRef, {
    senderId,
    receiverId,
    text,
    timestamp: serverTimestamp(),
    status: 'sent',
    attachments: attachments || []
  });
  
  // Get current unread count
  const convDoc = await getDoc(conversationRef);
  const currentUnread = convDoc.data()?.unreadCount?.[receiverId] || 0;
  
  // Update conversation
  await updateDoc(conversationRef, {
    lastMessage: text,
    lastMessageTime: serverTimestamp(),
    lastMessageSenderId: senderId,
    [`unreadCount.${receiverId}`]: currentUnread + 1
  });
  
  return messageDoc.id;
};

// Subscribe to messages in a conversation
export const subscribeToMessages = (
  conversationId: string, 
  callback: (messages: Message[]) => void
) => {
  const messagesRef = collection(db, 'messenger_conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    callback(messages);
  }, (error) => {
    console.error('Error subscribing to messages:', error);
    callback([]);
  });
};

// Subscribe to conversations for a user
export const subscribeToConversations = (
  userId: string, 
  callback: (conversations: Conversation[]) => void
) => {
  const conversationsRef = collection(db, 'messenger_conversations');
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    let conversations: Conversation[] = [];
    snapshot.forEach((doc) => {
      conversations.push({ id: doc.id, ...doc.data() } as Conversation);
    });
    
    // Sort by lastMessageTime client-side
    conversations.sort((a, b) => {
      const timeA = a.lastMessageTime?.toMillis?.() || 0;
      const timeB = b.lastMessageTime?.toMillis?.() || 0;
      return timeB - timeA;
    });
    
    callback(conversations);
  }, (error) => {
    console.error('Error subscribing to conversations:', error);
    callback([]);
  });
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
};

// Subscribe to user presence
export const subscribeToUserPresence = (
  userId: string, 
  callback: (online: boolean, lastSeen: Timestamp | null) => void
) => {
  const userStatusRef = ref(rtdb, `/status/${userId}`);
  
  return onValue(userStatusRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data.state === 'online', data.lastChanged);
    } else {
      callback(false, null);
    }
  });
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string, userId: string) => {
  const conversationRef = doc(db, 'messenger_conversations', conversationId);
  
  await updateDoc(conversationRef, {
    [`unreadCount.${userId}`]: 0
  });
  
  // Update message statuses
  const messagesRef = collection(db, 'messenger_conversations', conversationId, 'messages');
  const q = query(
    messagesRef,
    where('receiverId', '==', userId),
    where('status', '!=', 'read')
  );
  
  const snapshot = await getDocs(q);
  const updates = snapshot.docs.map(docSnap => 
    updateDoc(doc(messagesRef, docSnap.id), { status: 'read' })
  );
  
  await Promise.all(updates);
};

// Set typing status
export const setTypingStatus = (conversationId: string, userId: string, isTyping: boolean) => {
  const typingRef = ref(rtdb, `/typing/${conversationId}/${userId}`);
  set(typingRef, isTyping ? { typing: true, timestamp: rtdbServerTimestamp() } : null);
};

// Subscribe to typing status
export const subscribeToTypingStatus = (
  conversationId: string, 
  userId: string, 
  callback: (isTyping: boolean) => void
) => {
  const typingRef = ref(rtdb, `/typing/${conversationId}/${userId}`);
  
  return onValue(typingRef, (snapshot) => {
    const data = snapshot.val();
    callback(data?.typing || false);
  });
};

// Search users
export const searchUsers = async (searchTerm: string, currentUserId: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, limit(20));
  
  const snapshot = await getDocs(q);
  const users: UserProfile[] = [];
  
  snapshot.forEach((doc) => {
    const userData = doc.data() as UserProfile;
    if (
      userData.uid !== currentUserId &&
      userData.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      users.push(userData);
    }
  });
  
  return users;
};

// Get all users
export const getAllUsers = async (currentUserId: string) => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  const users: UserProfile[] = [];
  
  snapshot.forEach((doc) => {
    const userData = doc.data() as UserProfile;
    if (userData.uid !== currentUserId) {
      users.push(userData);
    }
  });
  
  return users;
};
