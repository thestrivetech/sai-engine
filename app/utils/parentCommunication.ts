// app/utils/parentCommunication.ts
'use client';

class ParentCommunication {
  private debugMode: boolean;
  private allowedOrigins: string[];
  private parentOrigin: string;
  private messageQueue: any[];
  private isReady: boolean;

  constructor() {
    // Check for debug mode
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      this.debugMode = urlParams.get('debug') === 'true' || process.env.NODE_ENV === 'development';
    } else {
      this.debugMode = false;
    }

    // Allow both production and development origins
    this.allowedOrigins = [
      'https://strivetech.ai',
      'https://www.strivetech.ai',
      'https://strive-website-8xot95578-strive-tech.vercel.app',
      'http://localhost:5000',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];

    this.parentOrigin = this.detectParentOrigin();
    this.messageQueue = [];
    this.isReady = false;

    if (typeof window !== 'undefined') {
      this.setupEventListeners();
      this.setupResizeObserver();

      // Send ready message immediately when DOM is loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.debugLog('🚀 DOM loaded - sending immediate ready message', true);
          this.sendReadyMessage();
        });
      } else {
        this.debugLog('🚀 DOM already loaded - sending immediate ready message', true);
        setTimeout(() => this.sendReadyMessage(), 100);
      }
    }

    this.debugLog('🔧 ParentCommunication initialized');
    this.debugLog(`🐛 Debug mode: ${this.debugMode ? 'ENABLED' : 'disabled'}`);
    this.debugLog(`🌐 Parent origin: ${this.parentOrigin}`);
    this.debugLog(`🖼️ In iframe: ${typeof window !== 'undefined' && window.parent !== window}`);
  }

  debugLog(message: string, force: boolean = false) {
    if (this.debugMode || force) {
      console.log(`[ParentComm] ${message}`);
    }
  }

  detectParentOrigin(): string {
    if (typeof window === 'undefined') return 'https://strivetech.ai';

    // Try to get parent origin from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const parentParam = urlParams.get('parent');
    if (parentParam) {
      this.debugLog(`🎯 Parent origin from URL: ${parentParam}`);
      return parentParam;
    }

    // Try to detect from document referrer
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        this.debugLog(`🎯 Parent origin from referrer: ${referrerUrl.origin}`);
        return referrerUrl.origin;
      } catch (e) {
        this.debugLog(`⚠️ Could not parse referrer: ${e}`);
      }
    }

    this.debugLog('🎯 Using default parent origin: https://strivetech.ai');
    return 'https://strivetech.ai';
  }

  setupEventListeners() {
    if (typeof window === 'undefined') return;

    // Listen for messages from parent
    window.addEventListener('message', this.handleParentMessage.bind(this));

    // Notify parent when closing
    window.addEventListener('beforeunload', () => {
      this.sendToParent('close');
    });

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
      this.sendToParent('visibility', {
        visible: document.visibilityState === 'visible'
      });
    });
  }

  setupResizeObserver() {
    if (typeof window === 'undefined' || !window.ResizeObserver) return;

    const resizeObserver = new ResizeObserver(() => {
      this.notifyResize();
    });

    // Observe body for size changes
    resizeObserver.observe(document.body);

    // Also observe the chat container if it exists
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      resizeObserver.observe(chatContainer);
    }
  }

  handleParentMessage(event: MessageEvent) {
    // Security: validate origin
    if (!this.allowedOrigins.includes(event.origin)) {
      console.warn('Ignored message from untrusted origin:', event.origin);
      return;
    }

    const { type, data, source } = event.data || {};

    // Only handle messages from website
    if (source && source !== 'strivetech-website') {
      console.warn('Ignored message from unknown source:', source);
      return;
    }

    switch(type) {
      case 'visibility':
        this.handleVisibilityChange(data?.visible);
        break;
      case 'mode':
        this.handleModeChange(data?.mode);
        break;
      case 'container_resize':
        this.handleContainerResize(data?.width, data?.height);
        break;
      case 'ping':
        this.sendToParent('pong', { timestamp: Date.now() });
        break;
      default:
        console.log('Unknown message type:', type);
    }
  }

  handleVisibilityChange(isVisible: boolean) {
    if (typeof window === 'undefined') return;
    
    const event = new CustomEvent('chatbot:visibility', {
      detail: { visible: isVisible }
    });
    window.dispatchEvent(event);
  }

  handleModeChange(mode: string) {
    if (typeof window === 'undefined') return;
    
    const event = new CustomEvent('chatbot:mode', {
      detail: { mode }
    });
    window.dispatchEvent(event);
  }

  handleContainerResize(width: number, height: number) {
    if (typeof window === 'undefined') return;
    
    const event = new CustomEvent('chatbot:resize', {
      detail: { width, height }
    });
    window.dispatchEvent(event);
  }

  sendReadyMessage() {
    this.debugLog('📤 Sending immediate ready message', true);
    this.sendToParent('ready', {
      version: '1.0.0',
      mode: this.detectMode(),
      capabilities: ['chat', 'streaming', 'analytics'],
      timestamp: Date.now()
    });
  }

  initializeWhenReady() {
    this.debugLog('🔧 initializeWhenReady called', true);
    this.debugLog(`🖼️ iframe check: ${typeof window !== 'undefined' && window.parent !== window}`, true);
    this.debugLog(`📍 current URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}`, true);
    this.debugLog(`📊 ready status: ${this.isReady}`, true);

    if (!this.isReady) {
      this.debugLog('🚀 Sending initial ready message...', true);
      this.notifyReady();
    } else {
      this.debugLog('⚠️ Already ready, sending ready message again for reliability...', true);
      this.sendToParent('ready', {
        version: '1.0.0',
        mode: this.detectMode(),
        capabilities: ['chat', 'streaming', 'analytics'],
        timestamp: Date.now()
      });
    }
  }

  notifyReady() {
    this.isReady = true;
    this.debugLog('📤 Sending ready message to parent...', true);
    this.sendToParent('ready', {
      version: '1.0.0',
      mode: this.detectMode(),
      capabilities: ['chat', 'streaming', 'analytics'],
      timestamp: Date.now()
    });

    this.flushMessageQueue();
  }

  notifyResize() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );

    const width = Math.max(
      document.body.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.clientWidth,
      document.documentElement.scrollWidth,
      document.documentElement.offsetWidth
    );

    this.sendToParent('resize', { height, width });
  }

  notifyError(error: Error, code: string = 'UNKNOWN_ERROR', recoverable: boolean = true) {
    this.sendToParent('error', {
      error: error.message || 'Unknown error',
      code,
      recoverable,
      stack: error.stack,
      timestamp: Date.now()
    });
  }

  notifyMinimize() {
    this.sendToParent('minimize', {});
  }

  notifyClose() {
    this.sendToParent('close', {});
  }

  notifyNavigate(url: string, target: string = '_self') {
    this.sendToParent('navigate', {
      url,
      target
    });
  }

  notifyAnalytics(event: string, properties: Record<string, any> = {}) {
    this.sendToParent('analytics', {
      event,
      properties,
      timestamp: Date.now()
    });
  }

  detectMode(): string {
    if (typeof window === 'undefined') return 'full';
    
    const path = window.location.pathname;
    if (path.includes('/widget')) return 'widget';
    if (path.includes('/full')) return 'full';
    return 'full';
  }

  sendToParent(type: string, data: any = {}) {
    if (typeof window === 'undefined') return;

    const message = {
      type,
      data,
      timestamp: Date.now(),
      source: 'sai-chatbot'
    };

    // Queue messages if not ready yet
    if (!this.isReady && type !== 'ready') {
      this.messageQueue.push(message);
      return;
    }

    try {
      // Send to all known origins for maximum compatibility
      window.parent.postMessage(message, '*');
      window.parent.postMessage(message, 'https://strive-website-8xot95578-strive-tech.vercel.app');

      this.debugLog(`✅ PostMessage sent: ${JSON.stringify(message)}`, true);
    } catch (error) {
      this.debugLog(`❌ PostMessage failed: ${error}`, true);
    }
  }

  flushMessageQueue() {
    if (typeof window === 'undefined') return;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      window.parent.postMessage(message, '*');
      window.parent.postMessage(message, 'https://strive-website-8xot95578-strive-tech.vercel.app');
    }
  }
}

// Create and export singleton instance
const parentComm = new ParentCommunication();

// Expose for debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).parentComm = parentComm;
}

export default parentComm;