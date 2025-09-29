// types/industry.ts

export type IndustryType = 
  | 'strive'
  | 'real-estate'
  | 'dental'
  | 'legal'
  | 'manufacturing'
  | 'financial'
  | 'retail'
  | 'insurance';

export interface IndustryConfig {
  // Basic Info
  industry: IndustryType;
  displayName: string;
  
  // Branding
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    favicon?: string;
  };
  
  // Assistant Info
  assistant: {
    name: string;
    title: string;
    avatar?: string;
    capabilities?: string[];
  };
  
  // Business Info
  businessInfo: {
    calendlyLink: string;
    website: string;
    phone?: string;
  };
  
  // Welcome Message
  welcomeMessage: {
    greeting: string;
    intro: string;
    firstQuestion: string;
  };
  
  // Quick Actions
  quickActions?: QuickAction[];
  
  // Sample Questions
  sampleQuestions?: QuestionCategory[];
  
  // Services/Solutions
  services?: Service[];
  
  // System Prompt
  systemPrompt: string;
  
  // Problem Patterns
  problemPatterns?: Record<string, ProblemPattern>;
  
  // Conversation Flow
  conversationFlow?: ConversationFlow;
  
  // Solutions Map
  solutions?: Record<string, Solution>;
  
  // Example Conversations (for RAG)
  exampleConversations?: ExampleConversation[];
}

export interface QuickAction {
  id: string;
  icon: string;
  text: string;
  action: string;
}

export interface QuestionCategory {
  category: string;
  questions: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export interface ProblemPattern {
  keywords: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  response: string;
  questions: string[];
  solution?: string;
  benefits?: string[];
  deflection?: string;
}

export interface ConversationFlow {
  stages: Record<string, ConversationStage>;
  transitions?: Record<string, FlowTransition>;
}

export interface ConversationStage {
  goal: string;
  maxMessages: number;
  nextStage: string;
}

export interface FlowTransition {
  from: string[];
  to: string;
  action: string;
}

export interface Solution {
  title: string;
  description: string;
  benefits: string[];
  cta: string;
  ctaAction: string;
  timeline?: string;
  roi?: string;
}

export interface ExampleConversation {
  userInput: string;
  assistantResponse: string;
  stage?: string;
  outcome?: string;
}