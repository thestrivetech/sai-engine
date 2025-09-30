// app/hooks/useAdvancedChat.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Keyboard shortcuts hook
export const useKeyboardShortcuts = ({ 
  onSearch, 
  onShowShortcuts, 
  onClear 
}: { 
  onSearch?: () => void; 
  onShowShortcuts?: () => void; 
  onClear?: () => void; 
}) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K - Quick search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearch?.();
      }
      // Cmd/Ctrl + / - Show shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        onShowShortcuts?.();
      }
      // Escape - Clear input
      if (e.key === 'Escape') onClear?.();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [onSearch, onShowShortcuts, onClear]);
};

// Time-based greeting hook
export const useTimeBasedGreeting = () => {
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('day');
  
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon');
      setTimeOfDay('afternoon');
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good evening');
      setTimeOfDay('evening');
    } else {
      setGreeting('Welcome');
      setTimeOfDay('night');
    }
  }, []);
  
  return { greeting, timeOfDay };
};

// Network status hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionSpeed, setConnectionSpeed] = useState('4g');
  
  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection speed if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionSpeed(connection?.effectiveType || '4g');
      
      const handleConnectionChange = () => setConnectionSpeed(connection?.effectiveType || '4g');
      connection?.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection?.removeEventListener('change', handleConnectionChange);
      };
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return { isOnline, connectionSpeed };
};

// Idle detection hook
export const useIdleDetection = (timeout: number = 60000) => {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const resetTimer = useCallback(() => {
    setIsIdle(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsIdle(true), timeout);
  }, [timeout]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => document.addEventListener(event, resetTimer, true));
    resetTimer();
    
    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer, true));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);
  
  return isIdle;
};