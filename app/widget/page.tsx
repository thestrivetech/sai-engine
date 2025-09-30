// app/widget/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ChatContainer from '@/components/chat/ChatContainer';
import parentComm from '@/app/utils/parentCommunication';

export default function WidgetPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('dark');
    document.body.classList.add('widget-mode');
    
    if (typeof window !== 'undefined') {
      parentComm.initializeWhenReady();
    }
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3">
            <img 
              src="/images/strive-triangle.svg"
              alt="Loading"
              className="w-full h-full animate-spin"
            />
          </div>
          <p className="text-gray-200 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-wrapper">
      <ChatContainer mode="widget" />
    </div>
  );
}