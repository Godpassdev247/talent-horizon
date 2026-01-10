/**
 * Bottom Tab Bar Component
 * 
 * Design: Liquid Glass - Neo-glassmorphism with organic, fluid shapes
 * WhatsApp-style bottom navigation with 3 tabs: Find Job, Finance, Message
 */

import { Briefcase, Wallet, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'find-job' | 'finance' | 'message';

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  messageCount?: number;
}

export default function BottomTabBar({ activeTab, onTabChange, messageCount = 0 }: BottomTabBarProps) {
  const tabs = [
    { id: 'find-job' as TabType, label: 'Find Job', icon: Briefcase },
    { id: 'finance' as TabType, label: 'Finance', icon: Wallet },
    { id: 'message' as TabType, label: 'Message', icon: MessageCircle, badge: messageCount },
  ];

  return (
    <nav className="glass-panel-strong border-t border-[oklch(1_0_0/0.1)] safe-area-bottom">
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
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive 
                      ? 'text-[oklch(0.7_0.15_200)]' 
                      : 'text-[oklch(0.5_0.02_260)]'
                  }`} 
                />
                {/* Badge for unread messages */}
                {tab.badge && tab.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-[oklch(0.65_0.25_25)] rounded-full"
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </motion.span>
                )}
              </div>
              <span 
                className={`text-[11px] mt-1 font-medium transition-colors ${
                  isActive 
                    ? 'text-[oklch(0.7_0.15_200)]' 
                    : 'text-[oklch(0.5_0.02_260)]'
                }`}
              >
                {tab.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[oklch(0.7_0.15_200)] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
