/**
 * Chat Layout Component
 * 
 * Design: Liquid Glass - Neo-glassmorphism with organic, fluid shapes
 * Main layout for the messenger with sidebar and chat area
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import ConversationList from './ConversationList';
import ChatArea from './ChatArea';
import ContactSearch from './ContactSearch';
import UserProfile from './UserProfile';
import { Menu, X, Search, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatLayout() {
  const { user, userProfile } = useAuth();
  const { currentConversation } = useChat();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: 'url(/images/hero-bg.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.02_260/0.95)] via-[oklch(0.15_0.025_250/0.9)] to-[oklch(0.14_0.02_270/0.95)]" />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass-panel"
      >
        {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(showSidebar || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed md:relative z-40 w-80 h-full flex flex-col glass-panel-strong border-r border-[oklch(1_0_0/0.1)]"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-[oklch(1_0_0/0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h1 
                  className="text-xl font-bold gradient-text"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Messenger
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 rounded-xl btn-glass"
                    title="Find contacts"
                  >
                    <Search className="w-5 h-5 text-[oklch(0.7_0.02_260)]" />
                  </button>
                  <button
                    onClick={() => setShowProfile(true)}
                    className="p-2 rounded-xl btn-glass"
                    title="Your profile"
                  >
                    <Users className="w-5 h-5 text-[oklch(0.7_0.02_260)]" />
                  </button>
                </div>
              </div>

              {/* Current User Info */}
              {userProfile && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[oklch(1_0_0/0.05)]">
                  <div className="relative">
                    <img
                      src={userProfile.photoURL || '/images/avatar-placeholder.png'}
                      alt={userProfile.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 online-indicator" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate text-sm">
                      {userProfile.displayName}
                    </p>
                    <p className="text-xs text-[oklch(0.6_0.02_260)]">Online</p>
                  </div>
                </div>
              )}
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-hidden">
              <ConversationList />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {showSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative z-10">
        {currentConversation ? (
          <ChatArea onBack={() => setShowSidebar(true)} />
        ) : (
          <EmptyState />
        )}
      </main>

      {/* Contact Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <ContactSearch onClose={() => setShowSearch(false)} />
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <UserProfile onClose={() => setShowProfile(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-6">
          <img
            src="/images/empty-chat.png"
            alt="No conversation selected"
            className="w-64 h-64 mx-auto object-contain"
          />
        </div>
        <h2 
          className="text-2xl font-bold text-white mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Select a conversation
        </h2>
        <p className="text-[oklch(0.6_0.02_260)] leading-relaxed">
          Choose a friend from the sidebar to start chatting, or search for contacts to begin a new conversation.
        </p>
      </motion.div>
    </div>
  );
}
