// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { loadIndustryConfig } from '@/lib/industries';
import { RAGService } from '@/lib/services/rag-service';
import { IndustryType } from '@/types/industry';
import { Message } from '@/types/conversation';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      industry = 'strive',
      sessionId,
    }: {
      messages: Message[];
      industry: IndustryType;
      sessionId: string;
    } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    // Load industry configuration
    const config = await loadIndustryConfig(industry);

    // Get the latest user message
    const latestUserMessage = messages[messages.length - 1];

    // Build conversation history context
    const conversationHistory = {
      stage: determineConversationStage(messages),
      messageCount: messages.length,
      problemsDiscussed: extractProblemsDiscussed(messages),
    };

    // 🔥 RAG ENHANCEMENT: Get semantic context
    console.log('🔍 Searching for similar conversations...');
    const ragContext = await RAGService.buildRAGContext(
      latestUserMessage.content,
      industry,
      conversationHistory
    );

    console.log('✅ RAG Context:', {
      detectedProblems: ragContext.searchResults.detectedProblems,
      confidence: ragContext.searchResults.confidence.overallConfidence,
      suggestedApproach: ragContext.guidance.suggestedApproach,
    });

    // Build enhanced system prompt with RAG context
    const enhancedSystemPrompt = buildEnhancedSystemPrompt(
      config.systemPrompt,
      ragContext
    );

    // Prepare messages for Groq
    const groqMessages = [
      {
        role: 'system' as const,
        content: enhancedSystemPrompt,
      },
      ...messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
    ];

    // Stream response from Groq
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // or 'mixtral-8x7b-32768'
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    // Create readable stream
    const encoder = new TextEncoder();
    let fullResponse = '';

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponse += content;
            
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }

          // 🔥 STORE CONVERSATION: Save for future learning
          console.log('💾 Storing conversation for learning...');
          await RAGService.storeConversation({
            industry,
            sessionId,
            userMessage: latestUserMessage.content,
            assistantResponse: fullResponse,
            conversationStage: conversationHistory.stage,
            outcome: 'in_progress',
            bookingCompleted: false,
            problemDetected: ragContext.searchResults.detectedProblems[0],
            solutionPresented: ragContext.searchResults.recommendedSolutions[0],
          });

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Build enhanced system prompt with RAG context
 */
function buildEnhancedSystemPrompt(
  basePrompt: string,
  ragContext: any
): string {
  const { searchResults, guidance } = ragContext;

  let enhancement = '\n\n## 🎯 CONTEXTUAL INTELLIGENCE (RAG-Enhanced)\n\n';

  // Add detected problems
  if (searchResults.detectedProblems.length > 0) {
    enhancement += `**Similar Conversations Detected These Problems:**\n`;
    searchResults.detectedProblems.forEach((problem: string) => {
      enhancement += `- ${problem}\n`;
    });
    enhancement += '\n';
  }

  // Add proven approach
  if (searchResults.bestPattern) {
    enhancement += `**Proven Approach (${Math.round(searchResults.bestPattern.conversionScore * 100)}% conversion rate):**\n`;
    enhancement += `This type of conversation typically succeeds when you focus on quantifying the problem's impact and showing clear ROI.\n\n`;
  }

  // Add guidance
  enhancement += `**Recommended Strategy:**\n`;
  enhancement += `${guidance.suggestedApproach}\n\n`;

  if (guidance.keyPoints.length > 0) {
    enhancement += `**Key Points to Include:**\n`;
    guidance.keyPoints.forEach((point: string) => {
      enhancement += `- ${point}\n`;
    });
    enhancement += '\n';
  }

  if (guidance.avoidTopics.length > 0) {
    enhancement += `**Topics to Avoid:**\n`;
    guidance.avoidTopics.forEach((topic: string) => {
      enhancement += `- ${topic}\n`;
    });
    enhancement += '\n';
  }

  enhancement += `**Confidence Level:** ${Math.round(searchResults.confidence.overallConfidence * 100)}%\n`;
  enhancement += `**Urgency:** ${guidance.urgencyLevel}\n`;

  return basePrompt + enhancement;
}

/**
 * Determine current conversation stage
 */
function determineConversationStage(messages: Message[]): string {
  const userMessages = messages.filter(m => m.role === 'user');
  
  if (userMessages.length <= 2) return 'discovery';
  if (userMessages.length <= 4) return 'qualifying';
  if (userMessages.length <= 6) return 'solutioning';
  
  return 'closing';
}

/**
 * Extract problems discussed so far
 */
function extractProblemsDiscussed(messages: Message[]): string[] {
  const problems: string[] = [];
  const problemKeywords = [
    'losing customers',
    'churn',
    'defects',
    'quality',
    'support tickets',
    'fraud',
    'maintenance',
    'inventory',
  ];

  messages.forEach(message => {
    const content = message.content.toLowerCase();
    problemKeywords.forEach(keyword => {
      if (content.includes(keyword) && !problems.includes(keyword)) {
        problems.push(keyword);
      }
    });
  });

  return problems;
}