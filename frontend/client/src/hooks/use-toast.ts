import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// Simple toast implementation using browser notifications or console
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    // Show as a simple alert for now (can be replaced with a proper toast component)
    // For better UX, we'll just log to console and use a simple notification
    console.log(`[Toast] ${title}: ${description || ''}`);
    
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 z-[9999] p-4 rounded-lg shadow-lg transition-all duration-300 ${
      variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-[#1e3a5f] text-white'
    }`;
    notification.innerHTML = `
      <div class="font-semibold">${title}</div>
      ${description ? `<div class="text-sm opacity-90 mt-1">${description}</div>` : ''}
    `;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);

    const newToast: Toast = { id, title, description, variant };
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove from state after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toast, toasts, dismiss };
}
