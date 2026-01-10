/**
 * Conversation List Component
 * 
 * Design: Liquid Glass - Neo-glassmorphism with organic, fluid shapes
 * Displays list of conversations with last message preview and unread indicators
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { getUserProfile, UserProfile } from '@/lib/firebase';
import { formatDistanceToNow } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function ConversationList() {
  const { user } = useAuth();
  const { conversations, currentConversation, selectConversation, loading } = useChat();
  const [participantProfiles, setParticipantProfiles] = useState<Record<string, UserProfile>>({});

  // Fetch participant profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      
      const profilePromises = conversations.map(async (conv) => {
        const partnerId = conv.participants.find(p => p !== user.uid);
        if (partnerId && !participantProfiles[partnerId]) {
          const profile = await getUserProfile(partnerId);
          return { id: partnerId, profile };
        }
        return null;
      });

      const results = await Promise.all(profilePromises);
      const newProfiles: Record<string, UserProfile> = {};
      
      results.forEach((result) => {
        if (result?.profile) {
          newProfiles[result.id] = result.profile;
        }
      });

      if (Object.keys(newProfiles).length > 0) {
        setParticipantProfiles(prev => ({ ...prev, ...newProfiles }));
      }
    };

    fetchProfiles();
  }, [conversations, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.7_0.15_200)]" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[oklch(1_0_0/0.05)] flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[oklch(0.5_0.02_260)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-[oklch(0.6_0.02_260)] text-sm">
          No conversations yet
        </p>
        <p className="text-[oklch(0.5_0.02_260)] text-xs mt-1">
          Search for contacts to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full custom-scrollbar p-2">
      <div className="space-y-1">
        {conversations.map((conversation, index) => {
          const partnerId = conversation.participants.find(p => p !== user?.uid);
          const partner = partnerId ? participantProfiles[partnerId] : null;
          const unreadCount = user ? conversation.unreadCount?.[user.uid] || 0 : 0;
          const isSelected = currentConversation?.id === conversation.id;

          return (
            <motion.button
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => selectConversation(conversation.id)}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200 text-left ${
                isSelected 
                  ? 'bg-[oklch(0.7_0.15_200/0.2)] border border-[oklch(0.7_0.15_200/0.3)]' 
                  : 'hover:bg-[oklch(1_0_0/0.05)] border border-transparent'
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={partner?.photoURL || '/images/avatar-placeholder.png'}
                  alt={partner?.displayName || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {partner?.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 online-indicator" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium truncate ${isSelected ? 'text-white' : 'text-[oklch(0.9_0.01_260)]'}`}>
                    {partner?.displayName || 'Loading...'}
                  </span>
                  {conversation.lastMessageTime && (
                    <span className="text-xs text-[oklch(0.5_0.02_260)] flex-shrink-0 ml-2">
                      {formatDistanceToNow(conversation.lastMessageTime.toDate())}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${
                    unreadCount > 0 
                      ? 'text-[oklch(0.8_0.02_260)] font-medium' 
                      : 'text-[oklch(0.5_0.02_260)]'
                  }`}>
                    {conversation.lastMessageSenderId === user?.uid && (
                      <span className="text-[oklch(0.5_0.02_260)]">You: </span>
                    )}
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                  {unreadCount > 0 && (
                    <span className="unread-badge ml-2 flex-shrink-0">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
