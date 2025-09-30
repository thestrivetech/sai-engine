// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ChatContainer from '@/components/chat/ChatContainer';
import parentComm from '@/app/utils/parentCommunication';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('dark');
    document.body.classList.add('fullpage-mode');
    
    // Initialize parent communication
    if (typeof window !== 'undefined') {
      parentComm.initializeWhenReady();
      
      // Backup messages
      const timer1 = setTimeout(() => {
        parentComm.initializeWhenReady();
      }, 1000);

      const timer3 = setTimeout(() => {
        parentComm.initializeWhenReady();
      }, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer3);
      };
    }
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img 
              src="/images/strive-triangle.svg"
              alt="Loading"
              className="w-full h-full animate-spin"
              style={{ 
                filter: 'drop-shadow(0 8px 20px rgba(245, 104, 52, 0.5))'
              }}
            />
          </div>
          <p className="text-gray-200 font-medium text-lg">Loading AI Solutions Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col py-6 px-4">
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
          <motion.div
            className="flex-1 min-h-0"
            initial={{ opacity: 0, scale: 0.9, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              delay: 0.2
            }}
          >
            <ChatContainer mode="full" />
          </motion.div>
        </div>
      </div>

      {/* Dev indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 text-xs text-gray-400 bg-gray-800 bg-opacity-80 px-3 py-2 rounded-lg backdrop-blur-sm shadow-lg border border-gray-600">
          Dev Mode • Next.js
        </div>
      )}
    </div>
  );
}