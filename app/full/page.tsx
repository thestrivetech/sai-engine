// app/full/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ChatContainer from '@/components/chat/ChatContainer';
import parentComm from '@/app/utils/parentCommunication';

export default function FullPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('dark');
    document.body.classList.add('fullpage-mode');
    
    if (typeof window !== 'undefined') {
      parentComm.initializeWhenReady();
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
          <p className="text-gray-200 font-medium text-lg">Loading...</p>
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
    </div>
  );
}