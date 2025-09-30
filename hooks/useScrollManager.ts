// app/hooks/useScrollManager.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  id: string;
  role: string;
  content: string;
  timestamp: Date;
}

const useScrollManager = (messages: Message[], streamingMessage: string) => {
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const previousMessageCount = useRef(0);
  const previousStreamingContent = useRef('');
  const previousLastMessageContent = useRef('');

  const NEAR_BOTTOM_THRESHOLD = 100;

  // Check if user is near bottom
  const checkIfNearBottom = useCallback(() => {
    if (!scrollContainerRef.current) return true;

    const container = scrollContainerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    return distanceFromBottom <= NEAR_BOTTOM_THRESHOLD;
  }, []);

  // Smooth scroll to bottom
  const scrollToBottom = useCallback((force = false, smooth = true) => {
    if (!scrollContainerRef.current && !messagesEndRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const performScroll = () => {
      try {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const scrollOptions: ScrollToOptions = {
            top: container.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto'
          };
          container.scrollTo(scrollOptions);
        } else if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'end',
            inline: 'nearest'
          });
        }
      } catch (error) {
        console.warn('Scroll failed:', error);
      }
    };

    const currentNearBottom = checkIfNearBottom();
    const currentAutoScrollEnabled = isAutoScrollEnabled;

    if (force || (currentAutoScrollEnabled && currentNearBottom)) {
      animationFrameRef.current = requestAnimationFrame(() => {
        performScroll();

        setTimeout(() => {
          if (checkIfNearBottom()) {
            setIsNearBottom(true);
            setShowScrollButton(false);
          }
        }, 100);
      });
    }
  }, [checkIfNearBottom, isAutoScrollEnabled]);

  // Handle manual scroll to bottom
  const handleScrollToBottom = useCallback(() => {
    setIsAutoScrollEnabled(true);
    scrollToBottom(true, true);
  }, [scrollToBottom]);

  // Scroll event handler
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const nearBottom = checkIfNearBottom();
      setIsNearBottom(nearBottom);
      setShowScrollButton(!nearBottom);
      setIsAutoScrollEnabled(nearBottom);

      if (scrollContainerRef.current) {
        lastScrollTop.current = scrollContainerRef.current.scrollTop;
      }
    }, 100);
  }, [checkIfNearBottom]);

  // Auto-scroll on new messages
  useEffect(() => {
    const currentMessageCount = messages.length;

    if (currentMessageCount > previousMessageCount.current && currentMessageCount > 0) {
      setTimeout(() => {
        scrollToBottom(true, true);
      }, 50);
    }

    previousMessageCount.current = currentMessageCount;
  }, [messages.length, scrollToBottom]);

  // Auto-scroll during streaming
  useEffect(() => {
    const currentStreamingContent = streamingMessage || '';

    if (streamingMessage &&
        currentStreamingContent !== previousStreamingContent.current &&
        currentStreamingContent.length > previousStreamingContent.current.length) {
      setTimeout(() => {
        scrollToBottom(false, false);
      }, 10);
    }

    previousStreamingContent.current = currentStreamingContent;
  }, [streamingMessage, scrollToBottom]);

  // Auto-scroll on assistant message updates
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const currentLastMessageContent = lastMessage ? lastMessage.content : '';

    if (lastMessage &&
        lastMessage.role === 'assistant' &&
        currentLastMessageContent !== previousLastMessageContent.current &&
        currentLastMessageContent.length > previousLastMessageContent.current.length &&
        currentLastMessageContent !== 'Thinking...') {
      setTimeout(() => {
        scrollToBottom(true, true);
      }, 50);
    }

    previousLastMessageContent.current = currentLastMessageContent;
  }, [messages, scrollToBottom]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  // Initialize scroll position
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'auto'
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    scrollContainerRef,
    messagesEndRef,
    isNearBottom,
    showScrollButton,
    isAutoScrollEnabled,
    scrollToBottom,
    handleScrollToBottom,
    setIsAutoScrollEnabled
  };
};

export default useScrollManager;