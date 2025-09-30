// app/components/Chat/ChatContainer.tsx
'use client';

import React, { useEffect, useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, RotateCcw, Minimize2, Maximize2, ExternalLink,
  TrendingUp, Eye, MessageCircle, Calendar, Sparkles, Zap,
  ArrowRight, Download, Mail, FileText, Command, ChevronDown
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { URLS, SERVICE_CARDS } from '@/app/constants/chatConstants';
import { useTimeBasedGreeting, useKeyboardShortcuts } from '@/hooks/useAdvancedChat';
import useScrollManager from '@/hooks/useScrollManager';
import parentComm from '@/app/utils/parentCommunication';

// Quick action suggestions component
const QuickActions = memo(({ messageCount, onAction }: { messageCount: number; onAction: (action: string) => void }) => {
  const suggestions = messageCount === 0 ? [
    { icon: Zap, text: "Quick Demo", action: "show_demo" },
    { icon: TrendingUp, text: "ROI Calculator", action: "roi_calc" },
    { icon: FileText, text: "Case Studies", action: "case_studies" }
  ] : [];

  if (!suggestions.length) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mb-4">
      {suggestions.map((s, i) => (
        <motion.button
          key={s.action}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onAction(s.action)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <s.icon size={14} />
          <span>{s.text}</span>
        </motion.button>
      ))}
    </motion.div>
  );
});

QuickActions.displayName = 'QuickActions';

// Service showcase card component
const ServiceCard = memo(({ service, sendMessage }: { service: any; sendMessage: (msg: string) => void }) => {
  const iconMap: Record<string, any> = { TrendingUp, Eye, MessageCircle };
  const Icon = iconMap[service.icon];
  
  if (!Icon) return null;

  const handleCardClick = () => {
    const serviceMessages: Record<string, string> = {
      'TrendingUp': "I'm interested in learning about Predictive Analytics. Can you explain what it does and how businesses use it? Then I'd like to explore solutions specific to my industry.",
      'Eye': "I'm interested in learning about Computer Vision. Can you explain what it does and how businesses use it? Then I'd like to explore solutions specific to my industry.",
      'MessageCircle': "I'm interested in learning about Natural Language AI. Can you explain what it does and how businesses use it? Then I'd like to explore solutions specific to my industry."
    };

    const messageToSend = serviceMessages[service.icon];
    if (messageToSend && sendMessage) {
      sendMessage(messageToSend);
    }
  };
  
  return (
    <motion.div 
      className="bg-gray-700 rounded-xl px-4 py-3 border border-gray-600 transition-all duration-300 cursor-pointer hover:bg-gray-600 flex items-center space-x-3"
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-10 h-10 bg-gradient-to-br ${service.gradientFrom} ${service.gradientTo} rounded-lg flex items-center justify-center flex-shrink-0`}
        whileHover={{ rotate: 10 }}
        transition={{ duration: 0.15 }}
      >
        <Icon size={20} className="text-white" />
      </motion.div>
      <div>
        <h3 className="font-semibold text-sm text-gray-200">{service.title}</h3>
        <div className="text-xs text-primary-500 font-medium">Learn More →</div>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

interface ChatContainerProps {
  mode?: 'full' | 'widget';
}

const ChatContainer: React.FC<ChatContainerProps> = ({ mode = 'full' }) => {
  const {
    messages, isLoading, streamingMessage, error,
    sendMessage, clearMessages, stopGeneration, retryLastMessage, getStats
  } = useChat();

  const {
    scrollContainerRef,
    messagesEndRef,
    showScrollButton,
    handleScrollToBottom
  } = useScrollManager(messages, streamingMessage);

  const [isMinimized, setIsMinimized] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  useTimeBasedGreeting();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      parentComm.notifyAnalytics('chat_opened', { mode });
    }
  }, [mode]);

  useKeyboardShortcuts({
    onSearch: () => console.log('Search triggered'),
    onShowShortcuts: () => setShowKeyboardShortcuts(!showKeyboardShortcuts),
    onClear: clearMessages
  });

  const handleScheduleClick = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.parent && window.parent !== window) {
        parentComm.notifyNavigate(URLS.CALENDLY, '_blank');
      } else {
        window.open(URLS.CALENDLY, '_blank');
      }
    }
  }, []);

  const handleWebsiteClick = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.parent && window.parent !== window) {
        parentComm.notifyNavigate(URLS.STRIVE_WEBSITE, '_blank');
      } else {
        window.open(URLS.STRIVE_WEBSITE, '_blank');
      }
    }
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    if (typeof window !== 'undefined') {
      parentComm.notifyAnalytics('message_sent', {
        messageLength: message.length,
        mode
      });
    }
    sendMessage(message);
  }, [sendMessage, mode]);

  const handleQuickAction = useCallback((action: string) => {
    switch(action) {
      case 'schedule':
        handleScheduleClick();
        break;
      case 'export':
        if (typeof window !== 'undefined') {
          const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `strive-chat-${Date.now()}.json`;
          a.click();
        }
        break;
      case 'email':
        if (typeof window !== 'undefined') {
          window.open(`mailto:contact@strivetech.ai?subject=${encodeURIComponent('STRIVE AI Consultation Summary')}&body=${encodeURIComponent('I would like to discuss the AI solutions we explored.')}`);
        }
        break;
      default:
        handleSendMessage(`Tell me more about ${action.replace('_', ' ')}`);
    }
  }, [handleScheduleClick, messages, handleSendMessage]);

  const stats = getStats();

  return (
    <motion.div
      className={`chat-container ${mode === 'widget' ? 'widget-chat' : 'full-chat'} flex flex-col bg-gray-800 border border-gray-600 rounded-xl overflow-hidden transition-all duration-300 relative ${isMinimized ? 'h-16' : mode === 'widget' ? 'h-full' : 'h-screen'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)' }}
    >
      {/* Static gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-transparent opacity-50" />
      </div>

      {/* Header - only in full mode */}
      {mode === 'full' && (
        <motion.div className="chat-header flex items-center justify-between p-4 bg-gray-900 text-gray-100 relative z-10 border-b border-gray-700">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col">
              <motion.div 
                className="flex items-center mt-0 ml-5 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={handleWebsiteClick}
              >
                <motion.img 
                  src="/images/strive-wordmark.png"
                  alt="STRIVE"
                  className="h-10 w-auto"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }}
                />
              </motion.div>
              
              <motion.div className="flex items-center space-x-2 text-sm mt-5 ml-5 text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 glow-pulse" />
                  <span>Sai Active</span>
                </div>
                <span>•</span>
                <span>{stats.totalMessages - 1} messages</span>
                {!stats.hasApiKey && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 flex items-center space-x-1">
                      <Zap size={12} />
                      <span>API key needed</span>
                    </span>
                  </>
                )}
              </motion.div>
            </div>
            
            {/* Header buttons */}
            <div className="flex items-center space-x-2 mt-0.5">
              <motion.button
                onClick={handleScheduleClick}
                className="brand-orange-button px-4 py-2.5 text-white rounded-xl font-semibold text-sm flex items-center space-x-2"
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(229, 95, 42, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Calendar size={24} />
                <span className="hidden sm:inline">Book Call</span>
              </motion.button>

              {[
                { icon: TrendingUp, onClick: () => setShowStats(!showStats), rotate: 360 },
                { icon: RotateCcw, onClick: clearMessages, rotate: -360, className: "danger-button" },
                { icon: isMinimized ? Maximize2 : Minimize2, onClick: () => {
                  const newMinimizedState = !isMinimized;
                  setIsMinimized(newMinimizedState);
                  if (newMinimizedState && typeof window !== 'undefined') {
                    parentComm.notifyMinimize();
                  }
                }, scale: [1, 1.3, 0.8, 1.1, 1] }
              ].map(({ icon: Icon, onClick, rotate, scale, className = "secondary-button hidden-mobile" }, i) => (
                <motion.button
                  key={i}
                  onClick={onClick}
                  className={`p-3 ${className} rounded-xl`}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <motion.div
                    whileHover={rotate ? { rotate } : scale ? { scale } : {}}
                    animate={{ rotate: 0 }}
                    transition={{ duration: rotate === 360 || rotate === -360 ? 0.4 : 0.5, ease: rotate === -360 ? "linear" : "easeInOut" }}
                  >
                    <Icon size={24} />
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Panel */}
      <AnimatePresence>
        {showStats && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-850 border-b border-gray-700 p-4 relative z-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { value: stats.userMessages, label: "Your Messages", color: "text-primary-500" },
                { value: stats.assistantMessages, label: "Sai Responses", color: "text-blue-500" },
                { value: stats.hasApiKey ? 'Active' : 'Setup', label: "Status", color: "text-green-500" },
                { value: stats.isStreaming ? 'Live' : 'Ready', label: "Connection", color: "text-purple-500" }
              ].map(({ value, label, color }) => (
                <div key={label} className="bg-gray-700 rounded-xl p-3 border border-gray-600">
                  <div className={`text-2xl font-semibold ${color}`}>{value}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col relative z-10 min-h-0"
          >
            <div
              ref={scrollContainerRef}
              className={`flex-1 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-800 to-gray-900 chat-scrollbar scroll-container ${mode === 'widget' ? 'p-3 pb-32' : 'p-6 pb-64'}`}
            >
              {/* Service cards - only show in full mode for first message */}
              {messages.length === 1 && mode === 'full' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-3 gap-4 mb-8 hidden md:grid"
                >
                  {SERVICE_CARDS.map((service, index) => (
                    <ServiceCard key={index} service={service} sendMessage={sendMessage} />
                  ))}
                </motion.div>
              )}

              <QuickActions messageCount={messages.length} onAction={handleQuickAction} />

              {/* Messages */}
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <ChatMessage key={message.id} message={message} isFirst={index === 0} mode={mode} />
                ))}
              </AnimatePresence>
              
              {/* Streaming message */}
              <AnimatePresence>
                {isLoading && streamingMessage && (
                  <ChatMessage
                    message={{
                      id: 'streaming',
                      role: 'assistant',
                      content: streamingMessage,
                      timestamp: new Date()
                    }}
                    isStreaming={true}
                    mode={mode}
                  />
                )}
              </AnimatePresence>
              
              {/* Error retry */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-center"
                  >
                    <button
                      onClick={retryLastMessage}
                      className="brand-orange-button px-6 py-3 text-white text-sm font-semibold rounded-xl flex items-center space-x-2"
                    >
                      <span>Retry with Sai</span>
                      <RotateCcw size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} className="h-7" />
            </div>

            {/* Scroll to Bottom Button */}
            <AnimatePresence>
              {showScrollButton && !isMinimized && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={handleScrollToBottom}
                  className={`scroll-to-bottom-inside visible ${mode === 'widget' ? 'bottom-16' : messages.length > 1 ? 'bottom-52' : 'bottom-36'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Scroll to bottom"
                >
                  <ChevronDown size={mode === 'widget' ? 16 : 20} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Input Area at Bottom */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 z-20"
          >
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={!stats.hasApiKey}
              onStop={stopGeneration}
              onClear={clearMessages}
              onScheduleClick={handleScheduleClick}
              mode={mode}
              messageCount={messages.length}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Helper */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-20 left-4 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl z-50"
          >
            <h4 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-2">
              <Command size={14} />
              Keyboard Shortcuts
            </h4>
            {[
              { key: "⌘+K", action: "Quick search" },
              { key: "⌘+/", action: "Toggle shortcuts" },
              { key: "⌘+Enter", action: "Send message" },
              { key: "Esc", action: "Clear input" }
            ].map((shortcut, i) => (
              <motion.div
                key={shortcut.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.15 }}
                className="flex justify-between items-center gap-4 text-xs text-gray-400 py-1"
              >
                <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300 font-mono">{shortcut.key}</kbd>
                <span>{shortcut.action}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatContainer;