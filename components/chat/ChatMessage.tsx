// app/components/Chat/ChatMessage.tsx
'use client';

import React, { memo } from 'react';
import { User, AlertCircle, Clock, ExternalLink, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { MessageSaiAvatar, UserAvatar } from '../Shared/Avatars';
import { URLS } from '@/app/constants/chatConstants';
import { buttonAnimation } from '@/app/utils/animationUtils';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    isThinking?: boolean;
    isPartial?: boolean;
    isError?: boolean;
    isWelcome?: boolean;
    showCalendlyButton?: boolean;
  };
  isStreaming?: boolean;
  mode?: 'full' | 'widget';
  isFirst?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = memo(({ message, isStreaming = false, mode = 'full', isFirst = false }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const isPartial = message.isPartial;
  const isWelcome = message.isWelcome;
  const isThinking = message.isThinking;
  
  const actuallyStreaming = message.isStreaming !== undefined ? message.isStreaming : isStreaming;
  
  const handleScheduleClick = () => {
    if (typeof window !== 'undefined') {
      window.open(URLS.CALENDLY, '_blank');
    }
  };
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Evening';
    }
  };
  
  const formatContent = (content: string) => {
    if (!content) return '';
    
    return content.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        return <div key={index} className="h-2" />;
      }
      
      // Bold text formatting
      if (trimmedLine.includes('**')) {
        const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={index} className="mb-2">
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return (
                  <span key={partIndex} className="font-bold text-gray-100">
                    {boldText}
                  </span>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </div>
        );
      }
      
      // Bullet points
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        const bulletContent = trimmedLine.substring(1).trim();
        return (
          <motion.div 
            key={index} 
            className="flex items-start space-x-3 my-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">•</span>
            </div>
            <span className="flex-1 text-sm leading-relaxed font-medium">{bulletContent}</span>
          </motion.div>
        );
      }
      
      // URL formatting - handle Calendly links properly
      if (trimmedLine.includes('calendly.com') || trimmedLine.includes('strivetech.ai') || trimmedLine.includes('http')) {
        if (trimmedLine.includes('calendly.com')) {
          const urlRegex = /(https?:\/\/)?calendly\.com\/[^\s]+/g;
          
          return (
            <div key={index} className="mb-2">
              {trimmedLine.split(urlRegex).map((part, partIndex) => {
                if (part && part.includes('calendly.com')) {
                  const fullUrl = part.startsWith('http') ? part : `https://${part}`;
                  return (
                    <motion.a
                      key={partIndex}
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 font-semibold underline decoration-2 underline-offset-2 transition-all duration-200 mx-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {part}
                      <ExternalLink size={12} className="inline ml-1" />
                    </motion.a>
                  );
                }
                return <span key={partIndex}>{part}</span>;
              })}
            </div>
          );
        }
        
        const urlRegex = /(https?:\/\/[^\s]+|strivetech\.ai|[\w-]+\.[\w-]+(?:\.[\w-]+)*)/g;
        const parts = trimmedLine.split(urlRegex);
        
        return (
          <div key={index} className="mb-2">
            {parts.map((part, partIndex) => {
              if (part && part.match(urlRegex) && !part.includes('calendly')) {
                let url = part;
                const isStrive = part.includes('strivetech.ai');
                
                if (!part.startsWith('http')) {
                  url = `https://${part}`;
                }
                
                return (
                  <motion.a
                    key={partIndex}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 font-semibold underline decoration-2 underline-offset-2 transition-all duration-200 mx-1 ${
                      isStrive 
                        ? 'text-primary-400 hover:text-primary-300 hover:bg-primary-900/20 px-2 py-1 rounded-md' 
                        : 'text-blue-400 hover:text-blue-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {part}
                    <ExternalLink size={12} className="inline" />
                  </motion.a>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-2 leading-relaxed">
          {trimmedLine}
        </div>
      );
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className={`flex items-start ${mode === 'widget' ? 'gap-2' : 'md:gap-3 gap-2'} mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar section */}
      <motion.div 
        className={`flex-shrink-0 flex items-center justify-center relative ${
          isUser 
            ? ''
            : isError
            ? 'w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white ring-2 ring-red-200 shadow-lg'
            : mode === 'widget' ? 'w-16 h-16' : 'w-24 h-24'
        }`}
        style={isUser ? { paddingTop: '4px' } : {}}
        whileHover={isError ? { scale: 1.1 } : {}}
        transition={{ duration: 0.2 }}
      >
        {isUser ? (
          <UserAvatar size={mode === 'widget' ? 60 : 80} />
        ) : isError ? (
          <AlertCircle size={28} />
        ) : (
          <MessageSaiAvatar size={mode === 'widget' ? 60 : 80} isStreaming={actuallyStreaming || isThinking} />
        )}
      </motion.div>
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} md:max-w-[85%] max-w-full`}>
        {/* Message Bubble */}
        {(!isThinking || message.content) && (
          <motion.div 
            className={`message-bubble relative ${
              isUser
                ? 'user-message bg-gradient-to-br from-gray-100/10 via-primary-800/30 to-primary-700/40 border-2 border-primary-600 text-gray-100 shadow-xl md:max-w-[80%] max-w-full'
                : isError
                ? 'error-message bg-gradient-to-br from-red-900/20 to-red-800/20 border-2 border-red-600 text-red-300 md:max-w-[80%] max-w-full'
                : 'bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-primary-900/20 border-2 border-primary-700 text-gray-200 shadow-xl md:max-w-[80%] max-w-full'
            } ${actuallyStreaming ? 'animate-pulse border-primary-300' : ''} ${
              isPartial ? 'border-orange-300 bg-orange-50' : ''
            }`}
            initial={{ scale: 0.8, opacity: 0, rotate: isUser ? 5 : -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="text-sm leading-relaxed relative z-10">
              {formatContent(message.content)}
              
              {actuallyStreaming && message.content && (
                <motion.span 
                  className="inline-block w-2 h-5 ml-0.5 bg-gradient-to-r from-primary-400 to-primary-500 rounded-sm"
                  animate={{ 
                    opacity: [1, 0.2, 1],
                    scaleY: [1, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              )}
              
              {isPartial && (
                <div className="mt-3 p-2 bg-orange-900/20 rounded-md">
                  <div className="text-xs text-orange-300 font-medium flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>Response was interrupted</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Timestamp */}
        <motion.div 
          className={`flex items-center space-x-2 text-xs text-gray-500 mt-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Clock size={12} />
          <span>
            {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          
          {isError && <span className="text-red-300 font-medium">Error</span>}
          {isPartial && <span className="text-orange-300 font-medium">Partial</span>}
          {isWelcome && (
            <>
              <span>•</span>
              <span className="text-primary-400 font-medium">{getTimeBasedGreeting()}</span>
            </>
          )}
          {actuallyStreaming && !isThinking && (
            <motion.span 
              className="text-primary-400 font-medium flex items-center space-x-1"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span>Live</span>
            </motion.span>
          )}
          {isThinking && (
            <motion.span 
              className="text-primary-400 font-medium"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Thinking...
            </motion.span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;