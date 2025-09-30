// app/components/Shared/Avatars.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, UserRound } from 'lucide-react';

const MOBILE_AVATAR_SIZE = 65;
const DESKTOP_AVATAR_SIZE = 80;

// Bot icon component
const WhiteBotIcon: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({ 
  size = 50, 
  className = "", 
  style = {} 
}) => (
  <div 
    className={`flex items-center justify-center ${className}`}
    style={{ 
      width: `${size}px`, 
      height: `${size}px`, 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style 
    }}
  >
    <div 
      className="rounded-full bg-gradient-to-br from-brand-dark-blue via-brand-dark-blue-light to-brand-dark-blue flex items-center justify-center shadow-lg ring-2 ring-white"
      style={{ 
        width: `${size * 0.8}px`, 
        height: `${size * 0.8}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Bot size={size * 0.45} className="text-white" strokeWidth={2} />
    </div>
  </div>
);

// User avatar component
export const UserAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 50, className = "" }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const avatarSize = isMobile ? MOBILE_AVATAR_SIZE : size;
  
  return (
    <motion.div 
      className={`flex items-center justify-center ${className}`}
      style={{ 
        width: `${avatarSize}px`, 
        height: `${avatarSize}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto'
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className="rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg ring-2 ring-white"
        style={{ 
          width: `${avatarSize * 0.8}px`, 
          height: `${avatarSize * 0.8}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <UserRound 
          size={avatarSize * 0.45} 
          className="text-white" 
          strokeWidth={2} 
          style={{ display: 'block' }}
        />
      </div>
    </motion.div>
  );
};

// Base avatar component
const BaseAvatar: React.FC<{
  size?: number;
  isAnimating?: boolean;
  animationConfig?: any;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size = 50, isAnimating = false, animationConfig = {}, className = "", style = {} }) => {
  return isAnimating ? (
    <motion.div 
      className={className} 
      animate={animationConfig.animate} 
      transition={animationConfig.transition} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        ...style 
      }}
    >
      <WhiteBotIcon size={size} />
    </motion.div>
  ) : (
    <WhiteBotIcon size={size} className={className} style={style} />
  );
};

// Main Sai avatar with glow effect
export const SaiAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 60, className = "" }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const avatarSize = isMobile ? MOBILE_AVATAR_SIZE : size;
  
  return (
    <motion.div
      className={`flex items-center justify-center relative ${className}`}
      whileHover={{ scale: 1.2 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-primary-500"
        animate={{
          scale: [1, 1.4, 1.2, 1.6, 1],
          opacity: [0.1, 0.3, 0.15, 0.4, 0.1],
          filter: ["blur(8px) brightness(1)", "blur(12px) brightness(1.2)", "blur(10px) brightness(1.1)", "blur(15px) brightness(1.3)", "blur(8px) brightness(1)"]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        style={{ width: `${avatarSize + 30}px`, height: `${avatarSize + 30}px`, left: '-15px', top: '-15px' }}
      />
      <BaseAvatar 
        size={avatarSize}
        className="relative z-10"
        isAnimating={true}
        animationConfig={{
          animate: { filter: ['drop-shadow(0 8px 16px rgba(255, 255, 255, 0.4)) brightness(1)', 'drop-shadow(0 12px 24px rgba(255, 255, 255, 0.6)) brightness(1.1)', 'drop-shadow(0 8px 16px rgba(255, 255, 255, 0.4)) brightness(1)'] },
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />
    </motion.div>
  );
};

// Loading avatar variant
export const LoadingSaiAvatar: React.FC<{ size?: number }> = ({ size = 50 }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const avatarSize = isMobile ? MOBILE_AVATAR_SIZE : size;
  
  return (
    <motion.div
      className="flex items-center justify-center relative"
      animate={{ rotate: [0, 360] }}
      transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" } }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-primary-500"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: `${avatarSize + 20}px`, height: `${avatarSize + 20}px`, left: '-10px', top: '-10px' }}
      />
      <BaseAvatar size={avatarSize} style={{ filter: 'drop-shadow(0 5px 15px rgba(255, 255, 255, 0.8))' }} />
    </motion.div>
  );
};

// Message avatar variant
export const MessageSaiAvatar: React.FC<{ size?: number; isStreaming?: boolean }> = ({ size = 36, isStreaming = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const avatarSize = isMobile ? MOBILE_AVATAR_SIZE : size;
  
  return (
    <motion.div
      className="flex items-center justify-center relative"
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      whileHover={!isStreaming ? { scale: 1.1 } : {}}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={isStreaming ? { 
          rotate: 360
        } : {}}
        transition={isStreaming ? { 
          rotate: { 
            duration: 3, 
            repeat: Infinity, 
            ease: "linear" 
          }
        } : {}}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isStreaming && (
          <motion.div
            className="absolute inset-0 bg-primary-500 rounded-full"
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.1, 0.3] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
          />
        )}
        
        <WhiteBotIcon 
          size={avatarSize}
          style={{ 
            filter: isStreaming 
              ? 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9))' 
              : 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25))' 
          }}
        />
      </motion.div>
    </motion.div>
  );
};