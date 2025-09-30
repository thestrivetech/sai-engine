// app/components/Chat/ChatInput.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Square, MessageSquare, Calendar, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdleDetection } from '@/app/hooks/useAdvancedChat';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled: boolean;
  onStop: () => void;
  onClear?: () => void;
  onScheduleClick: () => void;
  mode?: 'full' | 'widget';
  messageCount?: number;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  disabled, 
  onStop, 
  onClear, 
  onScheduleClick, 
  mode = 'full', 
  messageCount = 0 
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isIdle = useIdleDetection(60000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message);
      setMessage('');
      
      if (typeof window !== 'undefined') {
        const messageCountStorage = parseInt(localStorage.getItem('strive-message-count') || '0');
        localStorage.setItem('strive-message-count', (messageCountStorage + 1).toString());
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 140);
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    if (!isIdle) textareaRef.current?.focus();
  }, [isIdle]);

  useEffect(() => {
    if (message.length > 0) {
      setShowQuestions(false);
    }
  }, [message]);

  const sampleQuestions = [
    {
      category: "Getting Started",
      questions: [
        "Tell me about AI solutions for my industry",
        "We're curious about AI but don't know where to begin",
        "How do other companies like ours use AI?"
      ]
    },
    {
      category: "Common Challenges",
      questions: [
        "We're struggling with customer retention",
        "Our support team is overwhelmed",
        "How can we boost revenue?"
      ]
    },
    {
      category: "Cost & Implementation",
      questions: [
        "How long before we see ROI?",
        "How long does implementation take?",
        "Do we need technical staff?"
      ]
    }
  ];

  const currentQuestions = sampleQuestions[currentCategory].questions;

  const handleSampleQuestion = (question: string) => {
    setMessage(question);
    setShowQuestions(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-gray-800 border-t border-gray-600 relative">
      {/* Idle user prompt */}
      <AnimatePresence>
        {isIdle && message.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-40 left-6 right-6 z-20"
          >
            <div className="bg-gray-700 border border-gray-600 text-gray-300 rounded-lg p-3 text-sm">
              Still there? I'm here whenever you're ready to continue exploring AI solutions!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* CTA Box + Sample questions - hidden in widget mode */}
      <AnimatePresence>
        {!message && !isLoading && mode !== 'widget' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800"
          >
            {/* "Ready to discuss your AI strategy?" CTA */}
            {messageCount > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pt-4 pb-2"
              >
                <div className="p-4 bg-gray-800 border border-gray-600 rounded-xl glow-orange-subtle">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 group hidden md:flex">
                      <motion.div 
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5, ease: "linear" }}
                      >
                        <Calendar size={20} className="text-white" />
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-base text-gray-200">Ready to discuss your AI strategy?</h4>
                        <p className="text-sm text-gray-400">Let's explore how STRIVE can solve your specific challenges</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={onScheduleClick}
                      className="brand-orange-button px-8 py-3 text-white rounded-xl font-semibold flex items-center space-x-2 text-sm w-full md:w-auto justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Calendar size={16} />
                      <span>Schedule Free Assessment</span>
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Categories and Questions Section */}
            <div className="px-4 py-4 border-b border-gray-700">
              {/* Category tabs */}
              <div className="flex items-center justify-between mb-0">
                <div className="flex items-center space-x-2">
                  {sampleQuestions.map((category, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        if (currentCategory === index && showQuestions) {
                          setShowQuestions(false);
                        } else {
                          setCurrentCategory(index);
                          setShowQuestions(true);
                        }
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 font-medium flex items-center space-x-1 ${
                        currentCategory === index && showQuestions
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {index === 0 && <Sparkles size={12} />}
                      {index === 1 && <MessageSquare size={12} />}
                      {index === 2 && <Zap size={12} />}
                      <span>{category.category}</span>
                    </motion.button>
                  ))}
                </div>
                
                <motion.button
                  onClick={onScheduleClick}
                  className="text-xs px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white rounded-full transition-all duration-300 font-medium flex items-center space-x-1 hidden md:flex"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar size={12} />
                  <span>Book Call</span>
                </motion.button>
              </div>
              
              {/* Questions for selected category */}
              <AnimatePresence>
                {showQuestions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 mt-4"
                  >
                    {currentQuestions.map((question, index) => (
                      <motion.button
                        key={`${currentCategory}-${index}`}
                        onClick={() => handleSampleQuestion(question)}
                        className="w-full text-left text-sm px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-primary-600 text-gray-300 hover:text-primary-400 rounded-xl transition-all duration-300 group"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start space-x-3">
                          <MessageSquare size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed font-medium">{question}</span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input area */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-3">
        <div className={`flex-1 relative ${isFocused ? 'ring-2 ring-primary-600 ring-opacity-50 rounded-xl' : ''}`}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={typeof window !== 'undefined' && window.innerWidth < 768 ? "Your business challenge..." : "Tell me about your business challenge..."}
            className="chat-input w-full align-bottom"
            style={{ 
              minHeight: '52px', 
              maxHeight: '140px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
            disabled={disabled}
            rows={1}
          />
          
          {message.length > 200 && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-gray-700 px-1 rounded">
              {message.length}/2000
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Stop button */}
          <AnimatePresence>
            {isLoading && (
              <motion.button
                type="button"
                onClick={onStop}
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 glow-orange-subtle"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Square size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Send button */}
          <motion.button
            type="submit"
            disabled={!message.trim() || disabled || isLoading}
            className="send-button"
            whileHover={!disabled && message.trim() ? { scale: 1.02 } : {}}
            whileTap={!disabled && message.trim() ? { scale: 0.98 } : {}}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 size={20} className="animate-spin" />
                </motion.div>
              ) : (
                <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Send size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </form>
      
      {/* Status bar */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Sai ready</span>
            </div>
            
            <motion.button
              onClick={onScheduleClick}
              className="text-primary-400 hover:text-primary-300 font-medium transition-all duration-300 flex items-center space-x-1"
              whileHover={{ scale: 1.02 }}
            >
              <Calendar size={12} />
              <span>Free assessment available</span>
            </motion.button>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline">STRIVE TECH LLC</span>
            {onClear && (
              <button onClick={onClear} className="hover:text-gray-200 transition-all duration-300">
                New chat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;