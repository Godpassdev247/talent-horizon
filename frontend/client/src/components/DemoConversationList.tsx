/**
 * Demo Conversation List Component
 * 
 * Design: White & Navy Blue - Clean, professional messenger interface
 * Displays list of demo conversations with last message preview
 * 
 * RESPONSIVE DESIGN:
 * - Mobile: Full-width items with larger touch targets
 * - Tablet/Desktop: Standard sizing with hover states
 */

import { useDemo } from '@/contexts/FirebaseChatContext';
import { formatDistanceToNow } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DemoConversationListProps {
  onSelectConversation?: () => void;
}

export default function DemoConversationList({ onSelectConversation }: DemoConversationListProps) {
  const { currentUser, contacts, conversations, currentConversation, selectConversation } = useDemo();

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[oklch(0.95_0.01_250)] flex items-center justify-center mb-3 sm:mb-4">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[oklch(0.5_0.03_250)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-[oklch(0.5_0.03_250)] text-sm">
          No conversations yet
        </p>
        <p className="text-[oklch(0.6_0.02_250)] text-xs mt-1">
          Search for contacts to start chatting
        </p>
      </div>
    );
  }

  const handleSelect = (convId: string) => {
    selectConversation(convId);
    onSelectConversation?.();
  };

  return (
    <div className="overflow-y-auto h-full scrollbar-thin p-1.5 sm:p-2">
      <div className="space-y-0.5 sm:space-y-1">
        {conversations.map((conversation, index) => {
          const partnerId = conversation.participants.find(p => p !== currentUser?.uid);
          const partner = contacts.find(c => c.uid === partnerId);
          const unreadCount = currentUser ? conversation.unreadCount?.[currentUser.uid] || 0 : 0;
          const isSelected = currentConversation?.id === conversation.id;

          return (
            <motion.button
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => handleSelect(conversation.id)}
              className={`
                w-full p-2.5 sm:p-3 rounded-xl flex items-center gap-2.5 sm:gap-3 
                transition-all duration-200 text-left
                min-h-[64px] sm:min-h-[72px]
                active:scale-[0.98]
                hover:bg-[oklch(0.95_0.01_250)] border border-transparent
              `}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={partner?.photoURL || '/images/avatar-placeholder.png'}
                  alt={partner?.displayName || 'User'}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                {partner?.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 online-indicator" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                  <span className="font-medium truncate text-sm sm:text-base text-[oklch(0.2_0.05_250)]">
                    {partner?.displayName || 'Loading...'}
                  </span>
                  {conversation.lastMessageTime && (
                    <span className="text-[10px] sm:text-xs flex-shrink-0 ml-2 text-[oklch(0.5_0.03_250)]">
                      {formatDistanceToNow(conversation.lastMessageTime)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-xs sm:text-sm truncate ${unreadCount > 0 ? 'text-[oklch(0.3_0.05_250)] font-medium' : 'text-[oklch(0.5_0.03_250)]'}`}>
                    {conversation.lastMessageSenderId === currentUser?.uid && (
                      <span className="text-[oklch(0.5_0.03_250)]">You: </span>
                    )}
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                  {unreadCount > 0 && (
                    <span className="unread-badge ml-2 flex-shrink-0 text-[10px] sm:text-xs">
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
