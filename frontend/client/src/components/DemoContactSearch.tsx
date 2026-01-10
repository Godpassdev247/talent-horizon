/**
 * Demo Contact Search Component
 * 
 * Design: White & Navy Blue - Clean, professional messenger interface
 * Modal for searching and selecting contacts to start conversations
 * 
 * RESPONSIVE DESIGN:
 * - Mobile: Full-screen modal with safe areas
 * - Tablet/Desktop: Centered modal with max-width
 */

import { useState, useEffect, useRef } from 'react';
import { useDemo, ChatUser as DemoUser } from '@/contexts/FirebaseChatContext';
import { motion } from 'framer-motion';
import { X, Search, UserPlus } from 'lucide-react';

interface DemoContactSearchProps {
  onClose: () => void;
}

export default function DemoContactSearch({ onClose }: DemoContactSearchProps) {
  const { contacts, searchContacts, startConversation } = useDemo();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<DemoUser[]>(contacts);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter contacts based on search
  useEffect(() => {
    setFilteredContacts(searchContacts(searchTerm));
  }, [searchTerm, searchContacts]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleStartConversation = (contactId: string) => {
    startConversation(contactId);
    onClose();
  };

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
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden max-h-[90vh] sm:max-h-[80vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-[oklch(0.9_0.01_250)] bg-[oklch(0.25_0.08_250)] safe-area-top">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 
              className="text-base sm:text-lg font-semibold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Find Contacts
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[oklch(0.5_0.03_250)]" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 text-sm"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 bg-white">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[oklch(0.95_0.01_250)] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-[oklch(0.5_0.03_250)]" />
              </div>
              <p className="text-[oklch(0.4_0.03_250)] text-sm">
                No contacts found
              </p>
              <p className="text-[oklch(0.5_0.03_250)] text-xs mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="space-y-0.5 sm:space-y-1">
              {filteredContacts.map((contact, index) => (
                <motion.button
                  key={contact.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleStartConversation(contact.uid)}
                  className="w-full p-2.5 sm:p-3 rounded-xl flex items-center gap-2.5 sm:gap-3 hover:bg-[oklch(0.95_0.01_250)] transition-all duration-200 text-left active:scale-[0.98] min-h-[56px] sm:min-h-[64px]"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={contact.photoURL || '/images/avatar-placeholder.png'}
                      alt={contact.displayName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                    {contact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 online-indicator" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[oklch(0.2_0.05_250)] truncate text-sm sm:text-base">
                      {contact.displayName}
                    </p>
                    <p className="text-xs text-[oklch(0.5_0.03_250)]">
                      {contact.online ? 'Online' : 'Offline'}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="p-2 rounded-lg bg-[oklch(0.35_0.1_250)] flex-shrink-0">
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="p-3 sm:p-4 border-t border-[oklch(0.9_0.01_250)] safe-area-bottom bg-white">
          <p className="text-[10px] sm:text-xs text-[oklch(0.5_0.03_250)] text-center">
            Demo mode: These are simulated contacts for demonstration purposes.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
