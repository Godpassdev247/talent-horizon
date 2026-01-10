/**
 * User Profile Component
 * 
 * Design: Liquid Glass - Neo-glassmorphism with organic, fluid shapes
 * Modal for viewing user profile and logout functionality
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { X, LogOut, Loader2, Settings, Bell, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserProfileProps {
  onClose: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { userProfile, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => toast.info('Settings coming soon') },
    { icon: Bell, label: 'Notifications', action: () => toast.info('Notifications settings coming soon') },
    { icon: Shield, label: 'Privacy', action: () => toast.info('Privacy settings coming soon') },
    { icon: HelpCircle, label: 'Help & Support', action: () => toast.info('Help center coming soon') },
  ];

  if (!userProfile) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-sm glass-panel-strong rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[oklch(1_0_0/0.1)] flex items-center justify-between">
          <h2 
            className="text-lg font-semibold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl btn-glass"
          >
            <X className="w-5 h-5 text-[oklch(0.7_0.02_260)]" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-6 text-center">
          <div className="relative inline-block mb-4">
            <img
              src={userProfile.photoURL || '/images/avatar-placeholder.png'}
              alt={userProfile.displayName}
              className="w-24 h-24 rounded-full object-cover border-4 border-[oklch(0.7_0.15_200/0.3)]"
            />
            <div className="absolute bottom-1 right-1 online-indicator" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-1">
            {userProfile.displayName}
          </h3>
          <p className="text-sm text-[oklch(0.6_0.02_260)]">
            {userProfile.email}
          </p>
          
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.75_0.2_145/0.15)] border border-[oklch(0.75_0.2_145/0.3)]">
            <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.2_145)]" />
            <span className="text-xs text-[oklch(0.75_0.2_145)] font-medium">Online</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 pb-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={item.action}
              className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-[oklch(1_0_0/0.05)] transition-all duration-200 text-left"
            >
              <div className="p-2 rounded-lg bg-[oklch(1_0_0/0.05)]">
                <item.icon className="w-5 h-5 text-[oklch(0.7_0.02_260)]" />
              </div>
              <span className="text-sm text-[oklch(0.85_0.01_260)]">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-[oklch(1_0_0/0.1)]">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-12 rounded-xl bg-[oklch(0.6_0.2_25/0.2)] hover:bg-[oklch(0.6_0.2_25/0.3)] border border-[oklch(0.6_0.2_25/0.3)] text-[oklch(0.85_0.15_25)] font-medium transition-all duration-200"
          >
            {isLoggingOut ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <LogOut className="w-5 h-5 mr-2" />
            )}
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>

        {/* App Version */}
        <div className="pb-4 text-center">
          <p className="text-xs text-[oklch(0.4_0.02_260)]">
            Messenger v1.0.0 • Demo Mode
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
