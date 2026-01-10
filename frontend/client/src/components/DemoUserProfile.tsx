/**
 * Demo User Profile Component
 * 
 * Design: White & Navy Blue - Clean, professional messenger interface
 * Modal for viewing user profile and logout functionality
 * 
 * RESPONSIVE DESIGN:
 * - Mobile: Full-width modal with safe areas
 * - Tablet/Desktop: Centered modal with max-width
 */

import { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/FirebaseChatContext';
import { motion } from 'framer-motion';
import { X, LogOut, Loader2, Settings, Bell, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DemoUserProfileProps {
  onClose: () => void;
}

export default function DemoUserProfile({ onClose }: DemoUserProfileProps) {
  const { currentUser, signOut } = useDemo();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      signOut();
      onClose();
      setIsLoggingOut(false);
    }, 500);
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => toast.info('Settings coming soon') },
    { icon: Bell, label: 'Notifications', action: () => toast.info('Notifications settings coming soon') },
    { icon: Shield, label: 'Privacy', action: () => toast.info('Privacy settings coming soon') },
    { icon: HelpCircle, label: 'Help & Support', action: () => toast.info('Help center coming soon') },
  ];

  if (!currentUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-[oklch(0.35_0.06_250)] bg-[oklch(0.25_0.08_250)] flex items-center justify-between safe-area-top">
          <h2 
            className="text-base sm:text-lg font-semibold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-4 sm:p-6 text-center bg-white">
          <div className="relative inline-block mb-3 sm:mb-4">
            <img
              src={currentUser.photoURL || '/images/avatar-placeholder.png'}
              alt={currentUser.displayName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[oklch(0.35_0.1_250)]"
            />
            <div className="absolute bottom-1 right-1 online-indicator" />
          </div>
          
          <h3 className="text-lg sm:text-xl font-semibold text-[oklch(0.2_0.05_250)] mb-1">
            {currentUser.displayName}
          </h3>
          <p className="text-xs sm:text-sm text-[oklch(0.5_0.03_250)]">
            {currentUser.email}
          </p>
          
          <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.7_0.2_145/0.15)] border border-[oklch(0.7_0.2_145/0.3)]">
            <div className="w-2 h-2 rounded-full bg-[oklch(0.7_0.2_145)]" />
            <span className="text-xs text-[oklch(0.5_0.15_145)] font-medium">Online</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-3 sm:px-4 pb-2 flex-1 overflow-y-auto bg-white">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={item.action}
              className="w-full p-2.5 sm:p-3 rounded-xl flex items-center gap-2.5 sm:gap-3 hover:bg-[oklch(0.95_0.01_250)] transition-all duration-200 text-left active:scale-[0.98] min-h-[48px] sm:min-h-[52px]"
            >
              <div className="p-1.5 sm:p-2 rounded-lg bg-[oklch(0.95_0.01_250)] flex-shrink-0">
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[oklch(0.35_0.1_250)]" />
              </div>
              <span className="text-sm text-[oklch(0.3_0.05_250)]">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="p-3 sm:p-4 border-t border-[oklch(0.9_0.01_250)] bg-white">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-11 sm:h-12 rounded-xl bg-[oklch(0.55_0.22_25)] hover:bg-[oklch(0.5_0.22_25)] text-white font-medium transition-all duration-200"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
            ) : (
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            )}
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>

        {/* App Version */}
        <div className="pb-3 sm:pb-4 text-center safe-area-bottom bg-white">
          <p className="text-[10px] sm:text-xs text-[oklch(0.6_0.03_250)]">
            Messenger v1.0.0 • Demo Mode
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
