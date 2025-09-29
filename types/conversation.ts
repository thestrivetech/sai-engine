// types/conversation.ts

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  conversationId?: string;
  isStreaming?: boolean;
  isThinking?: boolean;
  isPartial?: boolean;
  isError?: boolean;
  isWelcome?: boolean;
  showCalendlyButton?: boolean;
}

export interface ChatStats {
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
  conversationId: string;
  hasApiKey: boolean;
  isStreaming: boolean;
  identifiedProblems: string[];
  conversationStage: string;
  needsConsultation: boolean;
}

export interface ConversationContext {
  industry: string;
  messages: Message[];
  detectedProblems: string[];
  conversationStage: ConversationStage;
}

export type ConversationStage = 
  | 'discovery'
  | 'qualifying' 
  | 'solutioning'
  | 'closing'
  | 'complete';

export interface ProblemDetection {
  key: string;
  confidence: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  scale: 'small' | 'medium' | 'large';
  matchedKeywords: string[];
  contextScore: {
    frustration: number;
    urgency: number;
    scale: number;
    businessRelevance: number;
    total: number;
  };
}