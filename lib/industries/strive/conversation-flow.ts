// lib/industries/strive/conversation-flow.ts

import { ConversationFlow } from '@/types/industry';

export const striveConversationFlow: ConversationFlow = {
  stages: {
    discovery: {
      goal: 'Understand business challenge and build rapport',
      maxMessages: 3,
      nextStage: 'qualifying'
    },
    qualifying: {
      goal: 'Assess urgency, impact, and specific requirements',
      maxMessages: 4,
      nextStage: 'solutioning'
    },
    solutioning: {
      goal: 'Present appropriate AI solution with clear benefits',
      maxMessages: 3,
      nextStage: 'closing'
    },
    closing: {
      goal: 'Create urgency and drive toward consultation booking',
      maxMessages: 2,
      nextStage: 'complete'
    },
    complete: {
      goal: 'Consultation booked or follow-up scheduled',
      maxMessages: 1,
      nextStage: 'complete'
    }
  },

  transitions: {
    emergency_detected: {
      from: ['discovery', 'qualifying'],
      to: 'solutioning',
      action: 'skip_to_solution'
    },
    booking_intent: {
      from: ['discovery', 'qualifying', 'solutioning'],
      to: 'closing',
      action: 'show_calendly'
    },
    high_confidence_problem: {
      from: ['discovery'],
      to: 'solutioning',
      action: 'present_solution'
    }
  }
};