// lib/services/rag-service.ts

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import {
  SemanticSearchResult,
  SimilarConversation,
  RAGContext,
  ConversationEmbedding,
} from '@/types/rag';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class RAGService {
  /**
   * Generate embedding for text using OpenAI
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    
    return response.data[0].embedding;
  }

  /**
   * Search for similar conversations using vector similarity
   */
  static async searchSimilarConversations(
    userMessage: string,
    industry: string,
    options: {
      threshold?: number;
      limit?: number;
      includeExamples?: boolean;
    } = {}
  ): Promise<SemanticSearchResult> {
    const {
      threshold = 0.75,
      limit = 5,
      includeExamples = true,
    } = options;

    // Generate embedding for user message
    const embedding = await this.generateEmbedding(userMessage);

    // Search actual conversations
    const { data: conversations, error: convError } = await supabase.rpc(
      'match_conversations',
      {
        query_embedding: embedding,
        match_industry: industry,
        match_threshold: threshold,
        match_count: limit,
      }
    );

    if (convError) {
      console.error('Error searching conversations:', convError);
    }

    // Search example conversations
    let examples: any[] = [];
    if (includeExamples) {
      const { data: exampleData, error: exError } = await supabase.rpc(
        'match_examples',
        {
          query_embedding: embedding,
          match_industry: industry,
          match_threshold: threshold,
          match_count: limit,
        }
      );

      if (exError) {
        console.error('Error searching examples:', exError);
      } else {
        examples = exampleData || [];
      }
    }

    // Combine and analyze results
    const allResults = [
      ...(conversations || []),
      ...examples.map(e => ({
        id: e.id,
        userMessage: e.user_input,
        assistantResponse: e.assistant_response,
        problemDetected: e.problem_type,
        solutionPresented: e.solution_type,
        outcome: e.outcome,
        conversionScore: e.conversion_score,
        similarity: e.similarity,
      })),
    ];

    // Extract detected problems
    const problemCounts = new Map<string, number>();
    allResults.forEach(r => {
      if (r.problemDetected) {
        problemCounts.set(
          r.problemDetected,
          (problemCounts.get(r.problemDetected) || 0) + 1
        );
      }
    });

    const detectedProblems = Array.from(problemCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([problem]) => problem);

    // Extract recommended solutions
    const solutionCounts = new Map<string, number>();
    allResults.forEach(r => {
      if (r.solutionPresented) {
        solutionCounts.set(
          r.solutionPresented,
          (solutionCounts.get(r.solutionPresented) || 0) + 1
        );
      }
    });

    const recommendedSolutions = Array.from(solutionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([solution]) => solution);

    // Find best response pattern (highest conversion)
    const bestPattern = allResults
      .filter(r => r.conversionScore && r.conversionScore > 0.7)
      .sort((a, b) => (b.conversionScore || 0) - (a.conversionScore || 0))[0];

    // Calculate confidence scores
    const avgSimilarity =
      allResults.reduce((sum, r) => sum + r.similarity, 0) /
      Math.max(allResults.length, 1);

    const problemConfidence = Math.min(
      problemCounts.size > 0 ? Math.max(...problemCounts.values()) / allResults.length : 0,
      1
    );

    const solutionConfidence = Math.min(
      solutionCounts.size > 0 ? Math.max(...solutionCounts.values()) / allResults.length : 0,
      1
    );

    return {
      similarConversations: allResults as SimilarConversation[],
      detectedProblems,
      recommendedSolutions,
      bestPattern: bestPattern
        ? {
            approach: bestPattern.assistantResponse,
            conversionScore: bestPattern.conversionScore || 0,
            stage: 'solutioning', // Could extract from data
          }
        : undefined,
      confidence: {
        problemDetection: problemConfidence,
        solutionMatch: solutionConfidence,
        overallConfidence: (avgSimilarity + problemConfidence + solutionConfidence) / 3,
      },
    };
  }

  /**
   * Build enhanced context for Sai
   */
  static async buildRAGContext(
    userMessage: string,
    industry: string,
    conversationHistory: {
      stage: string;
      messageCount: number;
      problemsDiscussed: string[];
    }
  ): Promise<RAGContext> {
    const searchResults = await this.searchSimilarConversations(
      userMessage,
      industry
    );

    // Generate guidance based on search results
    const guidance = this.generateGuidance(searchResults, conversationHistory);

    return {
      userMessage,
      searchResults,
      conversationHistory,
      guidance,
    };
  }

  /**
   * Generate guidance for Sai based on RAG results
   */
  private static generateGuidance(
    searchResults: SemanticSearchResult,
    conversationHistory: any
  ): RAGContext['guidance'] {
    const { confidence, detectedProblems, bestPattern } = searchResults;

    const keyPoints: string[] = [];
    const avoidTopics: string[] = [];
    let urgencyLevel: 'low' | 'medium' | 'high' = 'low';

    // High confidence - use proven approach
    if (confidence.overallConfidence > 0.8 && bestPattern) {
      keyPoints.push(
        `Similar conversations with ${Math.round(bestPattern.conversionScore * 100)}% conversion rate used this approach`
      );
      keyPoints.push('Focus on problem quantification and impact');
    }

    // Medium confidence - suggest exploration
    if (confidence.overallConfidence > 0.5 && confidence.overallConfidence <= 0.8) {
      keyPoints.push('Ask 2-3 discovery questions to clarify the problem');
      keyPoints.push('Avoid premature solution presentation');
    }

    // Low confidence - stay in discovery
    if (confidence.overallConfidence <= 0.5) {
      keyPoints.push('Stay in discovery mode - ask open-ended questions');
      avoidTopics.push('Specific solution recommendations');
    }

    // Detect urgency based on problem patterns
    if (detectedProblems.some(p => p.includes('churn') || p.includes('fraud'))) {
      urgencyLevel = 'high';
      keyPoints.push('Emphasize cost of inaction and urgency');
    }

    const suggestedApproach =
      confidence.overallConfidence > 0.8
        ? 'Present solution with proven talking points'
        : confidence.overallConfidence > 0.5
        ? 'Ask qualifying questions to confirm problem'
        : 'Continue discovery to understand pain points';

    return {
      suggestedApproach,
      keyPoints,
      avoidTopics,
      urgencyLevel,
    };
  }

  /**
   * Store conversation with embedding for future learning
   */
  static async storeConversation(
    conversation: Omit<ConversationEmbedding, 'id' | 'embedding' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    // Generate embedding for user message
    const embedding = await this.generateEmbedding(conversation.userMessage);

    const { error } = await supabase.from('conversations').insert({
      industry: conversation.industry,
      client_id: conversation.clientId,
      session_id: conversation.sessionId,
      user_message: conversation.userMessage,
      assistant_response: conversation.assistantResponse,
      embedding,
      problem_detected: conversation.problemDetected,
      solution_presented: conversation.solutionPresented,
      conversation_stage: conversation.conversationStage,
      outcome: conversation.outcome,
      conversion_score: conversation.conversionScore,
      booking_completed: conversation.bookingCompleted,
      response_time_ms: conversation.responseTimeMs,
      user_satisfaction: conversation.userSatisfaction,
    });

    if (error) {
      console.error('Error storing conversation:', error);
      throw error;
    }
  }

  /**
   * Mark conversation as successful (booking completed)
   */
  static async markConversationSuccess(
    sessionId: string,
    conversionScore: number = 1.0
  ): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update({
        outcome: 'booking_completed',
        booking_completed: true,
        conversion_score: conversionScore,
        updated_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error marking conversation success:', error);
    }
  }
}