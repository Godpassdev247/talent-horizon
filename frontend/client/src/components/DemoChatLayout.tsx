/**
 * Demo Chat Layout Component
 * 
 * Design: White & Navy Blue - Clean, professional messenger interface
 * Main layout for the demo messenger with sidebar and chat area
 * 
 * RESPONSIVE BREAKPOINTS:
 * - Mobile: < 640px (sm) - Full-screen views, swipe navigation
 * - Tablet: 640px - 1024px (sm-lg) - Collapsible sidebar
 * - Desktop: > 1024px (lg+) - Side-by-side layout
 * 
 * BOTTOM TAB BAR:
 * - Application, Finance, Message tabs (WhatsApp style)
 * - Only visible on conversation list view (not in chat view)
 */

import { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import DemoConversationList from './DemoConversationList';
import DemoChatArea from './DemoChatArea';
import DemoContactSearch from './DemoContactSearch';
import DemoUserProfile from './DemoUserProfile';
import { Menu, Search, User, MessageCircle, FileText, Wallet, PanelLeftClose, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type TabType = 'application' | 'finance' | 'message';

export default function DemoChatLayout() {
  const { currentUser, currentConversation, clearCurrentConversation, conversations } = useDemo();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('message');

  // Calculate total unread messages
  const totalUnread = conversations.reduce((sum, conv) => {
    return sum + (conv.unreadCount[currentUser?.uid || ''] || 0);
  }, 0);

  // Handle responsive breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
      
      // On desktop, keep sidebar state (don't force show)
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // On mobile, when a conversation is selected, hide sidebar
  useEffect(() => {
    if (isMobile && currentConversation) {
      setShowSidebar(false);
    }
  }, [currentConversation, isMobile]);

  const handleSelectConversation = () => {
    if (isMobile || isTablet) {
      setShowSidebar(false);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      clearCurrentConversation();
    }
    setShowSidebar(true);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== 'message') {
      toast.info(`${tab === 'application' ? 'Application' : 'Finance'} feature coming soon!`);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 50%, #e6f0ff 100%)' }}>
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {showSidebar && (
            <motion.aside
              initial={isMobile ? { x: -320, opacity: 0 } : { opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={isMobile ? { x: -320, opacity: 0 } : { opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`
                ${isMobile ? 'fixed inset-0 z-40' : 'relative z-40 bg-white'}
                ${isTablet ? 'w-80' : 'w-full sm:w-80 lg:w-96'}
                h-full flex flex-col
                ${!isMobile && 'border-r border-[oklch(0.92_0.01_250)]'}
                transition-all duration-300
              `}
            >
              {/* Sidebar Header */}
              <div className="p-3 sm:p-4 border-b safe-area-top border-[oklch(0.92_0.01_250)] bg-[oklch(0.97_0.01_240)]">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[oklch(0.35_0.1_250)] flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h1 
                      className="text-lg sm:text-xl font-bold text-[oklch(0.25_0.08_250)]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Messenger
                    </h1>
                  </div>
                  <div className="flex gap-1 sm:gap-2 items-center">
                    <button
                      onClick={() => setShowSearch(true)}
                      className="p-2 sm:p-2.5 hover:opacity-80 transition-opacity"
                      title="Find contacts"
                    >
                      <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[oklch(0.35_0.08_250)]" />
                    </button>
                    <button
                      onClick={() => setShowProfile(true)}
                      className="hover:opacity-80 transition-opacity"
                      title="Your profile"
                    >
                      {currentUser ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-[oklch(0.35_0.08_250)]/30"
                        />
                      ) : (
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-[oklch(0.35_0.08_250)]" />
                      )}
                    </button>
                    {/* Sidebar close button - Desktop/Tablet only */}
                    {!isMobile && (
                      <button
                        onClick={() => setShowSidebar(false)}
                        className="p-2 sm:p-2.5 hover:bg-[oklch(0.92_0.01_250)] rounded-lg transition-colors ml-1"
                        title="Hide sidebar"
                      >
                        <PanelLeftClose className="w-5 h-5 sm:w-6 sm:h-6 text-[oklch(0.35_0.08_250)]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-hidden" style={isMobile ? { background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 50%, #e6f0ff 100%)' } : {}}>
                <DemoConversationList onSelectConversation={handleSelectConversation} />
              </div>

              {/* Bottom Tab Bar - Mobile only when showing sidebar */}
              {isMobile && (
                <BottomTabBar 
                  activeTab={activeTab} 
                  onTabChange={handleTabChange}
                  messageCount={totalUnread}
                />
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Tablet Overlay - when sidebar is shown on tablet */}
        {isTablet && showSidebar && currentConversation && (
          <div 
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Chat Area */}
        <main className={`
          flex-1 flex flex-col relative z-10
          ${isMobile && showSidebar ? 'hidden' : 'flex'}
        `}>
          {currentConversation ? (
            <DemoChatArea 
              onBack={handleBackToList}
              showBackButton={isMobile || isTablet}
            />
          ) : (
            <div className="flex-1 flex flex-col">
              <EmptyState 
                isMobile={isMobile}
                onOpenSidebar={() => setShowSidebar(true)}
              />
            </div>
          )}
        </main>

        {/* Sidebar Toggle Button - Desktop and Tablet (when sidebar is hidden) */}
        {!isMobile && !showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="fixed top-4 left-4 z-50 p-2 hover:bg-[oklch(0.95_0.01_250)] rounded-lg transition-colors"
            title="Show sidebar"
          >
            <PanelLeft className="w-5 h-5 text-[oklch(0.35_0.08_250)]" />
          </button>
        )}

        {/* Contact Search Modal */}
        <AnimatePresence>
          {showSearch && (
            <DemoContactSearch onClose={() => setShowSearch(false)} />
          )}
        </AnimatePresence>

        {/* User Profile Modal */}
        <AnimatePresence>
          {showProfile && (
            <DemoUserProfile onClose={() => setShowProfile(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  isMobile: boolean;
  onOpenSidebar: () => void;
}

function EmptyState({ isMobile, onOpenSidebar }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-4 sm:mb-6">
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full bg-[oklch(0.95_0.01_250)] flex items-center justify-center">
            <MessageCircle className="w-16 h-16 sm:w-20 sm:h-20 text-[oklch(0.35_0.1_250)]" />
          </div>
        </div>
        <h2 
          className="text-xl sm:text-2xl font-bold text-[oklch(0.2_0.05_250)] mb-2 sm:mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Select a conversation
        </h2>
        <p className="text-sm sm:text-base text-[oklch(0.5_0.03_250)] leading-relaxed mb-4">
          Choose a friend from the sidebar to start chatting, or search for contacts to begin a new conversation.
        </p>
        {isMobile && (
          <button
            onClick={onOpenSidebar}
            className="px-6 py-3 rounded-xl bg-[oklch(0.35_0.1_250)] text-white font-medium hover:bg-[oklch(0.4_0.1_250)] transition-colors"
          >
            View Conversations
          </button>
        )}
      </motion.div>
    </div>
  );
}

// Bottom Tab Bar Component
interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  messageCount?: number;
}

function BottomTabBar({ activeTab, onTabChange, messageCount = 0 }: BottomTabBarProps) {
  const tabs = [
    { id: 'application' as TabType, label: 'Application', icon: FileText },
    { id: 'finance' as TabType, label: 'Finance', icon: Wallet },
    { id: 'message' as TabType, label: 'Message', icon: MessageCircle, badge: messageCount },
  ];

  return (
    <nav className="bg-[oklch(0.97_0.01_240)] border-t border-[oklch(0.92_0.01_250)] safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[oklch(0.35_0.1_250)] rounded-b-full"
                />
              )}
              
              {/* Icon with badge */}
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'text-[oklch(0.35_0.1_250)]' : 'text-[oklch(0.5_0.03_250)]'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full px-1">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs mt-1 ${isActive ? 'text-[oklch(0.35_0.1_250)] font-medium' : 'text-[oklch(0.5_0.03_250)]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
