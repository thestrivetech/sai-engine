// types/rag.ts

export interface ConversationEmbedding {
  id: string;
  industry: string;
  clientId?: string;
  sessionId: string;
  
  // Conversation
  userMessage: string;
  assistantResponse: string;
  embedding: number[];
  
  // Metadata
  problemDetected?: string;
  solutionPresented?: string;
  conversationStage: string;
  
  // Outcomes
  outcome: 'booking_completed' | 'conversation_ended' | 'in_progress';
  conversionScore?: number;
  bookingCompleted: boolean;
  
  // Analytics
  responseTimeMs?: number;
  userSatisfaction?: number; // 1-5
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ExampleConversation {
  id: string;
  industry: string;
  
  // Conversation
  userInput: string;
  assistantResponse: string;
  embedding: number[];
  
  // Classification
  problemType: string;
  solutionType: string;
  conversationStage: string;
  
  // Success metrics
  outcome: string;
  conversionScore: number;
  
  // Metadata
  isVerified: boolean;
  notes?: string;
  
  createdAt: Date;
}

export interface SimilarConversation {
  id: string;
  userMessage: string;
  assistantResponse: string;
  problemDetected: string;
  solutionPresented: string;
  outcome: string;
  conversionScore: number;
  similarity: number;
}

export interface SemanticSearchResult {
  // Top similar conversations
  similarConversations: SimilarConversation[];
  
  // Detected patterns
  detectedProblems: string[];
  recommendedSolutions: string[];
  
  // Best response pattern (highest conversion)
  bestPattern?: {
    approach: string;
    conversionScore: number;
    stage: string;
  };
  
  // Confidence scoring
  confidence: {
    problemDetection: number; // 0-1
    solutionMatch: number; // 0-1
    overallConfidence: number; // 0-1
  };
}

export interface RAGContext {
  // Original user message
  userMessage: string;
  
  // Semantic search results
  searchResults: SemanticSearchResult;
  
  // Current conversation context
  conversationHistory: {
    stage: string;
    messageCount: number;
    problemsDiscussed: string[];
  };
  
  // Guidance for Sai
  guidance: {
    suggestedApproach: string;
    keyPoints: string[];
    avoidTopics: string[];
    urgencyLevel: 'low' | 'medium' | 'high';
  };
}

export interface LearnedPattern {
  id: string;
  industry: string;
  patternName: string;
  keywords: string[];
  examplePhrases: string[];
  embedding: number[];
  detectionCount: number;
  conversionRate: number;
  recommendedSolution: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationAnalytics {
  sessionId: string;
  industry: string;
  
  // Metrics
  totalMessages: number;
  averageResponseTime: number;
  problemsDetected: string[];
  solutionsPresented: string[];
  
  // Outcome
  outcome: 'booking_completed' | 'conversation_ended' | 'in_progress';
  conversionScore?: number;
  
  // Quality
  semanticSearchUsed: boolean;
  contextRelevance: number; // 0-1
  userSatisfaction?: number;
  
  // Timestamps
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // seconds
}