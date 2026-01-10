/**
 * Contact Search Component
 * 
 * Design: Liquid Glass - Neo-glassmorphism with organic, fluid shapes
 * Modal for searching and selecting contacts to start conversations
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { searchUsers, getAllUsers, UserProfile } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { X, Search, Loader2, UserPlus } from 'lucide-react';

interface ContactSearchProps {
  onClose: () => void;
}

export default function ContactSearch({ onClose }: ContactSearchProps) {
  const { user } = useAuth();
  const { startConversation } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);

  // Load all users on mount
  useEffect(() => {
    const loadContacts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const users = await getAllUsers(user.uid);
        setContacts(users);
      } catch (error) {
        console.error('Failed to load contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [user]);

  // Search users
  useEffect(() => {
    const search = async () => {
      if (!user || !searchTerm.trim()) {
        // Reset to all users
        const users = await getAllUsers(user?.uid || '');
        setContacts(users);
        return;
      }

      setLoading(true);
      try {
        const results = await searchUsers(searchTerm, user.uid);
        setContacts(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, user]);

  const handleStartConversation = async (contactId: string) => {
    setStarting(contactId);
    try {
      await startConversation(contactId);
      onClose();
    } catch (error) {
      console.error('Failed to start conversation:', error);
    } finally {
      setStarting(null);
    }
  };

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
        className="w-full max-w-md glass-panel-strong rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[oklch(1_0_0/0.1)]">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-lg font-semibold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Find Contacts
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl btn-glass"
            >
              <X className="w-5 h-5 text-[oklch(0.7_0.02_260)]" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.5_0.02_260)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-3 rounded-xl input-glass text-white placeholder-[oklch(0.5_0.02_260)] focus:outline-none text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar p-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.7_0.15_200)]" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[oklch(1_0_0/0.05)] flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-[oklch(0.5_0.02_260)]" />
              </div>
              <p className="text-[oklch(0.6_0.02_260)] text-sm">
                {searchTerm ? 'No contacts found' : 'No contacts available'}
              </p>
              <p className="text-[oklch(0.5_0.02_260)] text-xs mt-1">
                {searchTerm ? 'Try a different search term' : 'Invite friends to start chatting'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {contacts.map((contact, index) => (
                <motion.button
                  key={contact.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleStartConversation(contact.uid)}
                  disabled={starting === contact.uid}
                  className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-[oklch(1_0_0/0.05)] transition-all duration-200 text-left disabled:opacity-50"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={contact.photoURL || '/images/avatar-placeholder.png'}
                      alt={contact.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {contact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 online-indicator" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {contact.displayName}
                    </p>
                    <p className="text-xs text-[oklch(0.5_0.02_260)]">
                      {contact.online ? 'Online' : 'Offline'}
                    </p>
                  </div>

                  {/* Action */}
                  {starting === contact.uid ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[oklch(0.7_0.15_200)]" />
                  ) : (
                    <div className="p-2 rounded-lg bg-[oklch(0.7_0.15_200/0.2)]">
                      <UserPlus className="w-4 h-4 text-[oklch(0.7_0.15_200)]" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="p-4 border-t border-[oklch(1_0_0/0.1)]">
          <p className="text-xs text-[oklch(0.5_0.02_260)] text-center">
            In production, this would show your Facebook friends who also use the app.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
