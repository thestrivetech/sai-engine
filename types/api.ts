// types/api.ts

import { Message } from './conversation';

export interface ChatRequest {
  messages: Message[];
  industry?: string;
  clientConfig?: ClientConfig;
}

export interface ChatResponse {
  id: string;
  role: 'assistant';
  content: string;
  timestamp: string;
}

export interface ClientConfig {
  companyName?: string;
  calendlyLink?: string;
  website?: string;
  phone?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
}