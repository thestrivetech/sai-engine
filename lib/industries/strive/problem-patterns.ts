// lib/industries/strive/problem-patterns.ts

import { ProblemPattern } from '@/types/industry';

export const striveProblemPatterns: Record<string, ProblemPattern> = {
  churn: {
    keywords: ['losing customers', 'retention', 'leaving', 'cancel', 'churn', 'unsubscribe'],
    urgencyLevel: 'high',
    response: 'churn_prediction',
    questions: [
      'What percentage of customers are you losing monthly?',
      'Do you know why customers are leaving?',
      'How much does it cost to acquire vs retain a customer?'
    ],
    solution: 'Churn Prediction Model',
    benefits: [
      'Identify at-risk customers 30-60 days before they leave',
      'Understand the top 5 factors driving customer departures',
      'Automate retention campaigns for high-risk segments',
      'Typically see 25-35% reduction in churn within 90 days'
    ],
    deflection: 'The modeling approach is proprietary and took years to perfect. Generic solutions miss industry-specific patterns.'
  },

  revenue: {
    keywords: ['revenue forecast', 'sales prediction', 'cash flow', 'financial planning', 'predict sales', 'boost revenue'],
    urgencyLevel: 'medium',
    response: 'revenue_forecasting',
    questions: [
      'How accurate are your current revenue forecasts?',
      'How far in advance do you need to predict?',
      'What factors most impact your revenue?'
    ],
    solution: 'Revenue Forecasting System',
    benefits: [
      'Achieve 92-95% forecast accuracy',
      'Plan inventory and resources more effectively',
      'Identify seasonal patterns and trends automatically',
      'Reduce variance in quarterly projections by 60%'
    ],
    deflection: 'Accurate forecasting requires complex ensemble methods customized to your business cycles.'
  },

  quality: {
    keywords: ['defect', 'quality control', 'inspection', 'faulty', 'QA', 'manufacturing'],
    urgencyLevel: 'high',
    response: 'quality_control',
    questions: [
      'What types of defects are you trying to catch?',
      "What's your current defect escape rate?",
      'How many products do you inspect daily?'
    ],
    solution: 'Computer Vision Quality Control',
    benefits: [
      'Detect defects with 99.7% accuracy',
      'Inspect 100% of products vs sampling',
      '10x faster than manual inspection',
      'Catch micro-defects invisible to human eye'
    ],
    deflection: 'Vision models must be trained on your specific defects and lighting conditions - generic models fail.'
  },

  fraud: {
    keywords: ['fraud', 'suspicious', 'risk', 'scam', 'fake', 'unauthorized'],
    urgencyLevel: 'high',
    response: 'fraud_detection',
    questions: [
      'What types of fraud are you experiencing?',
      "What's your current fraud loss rate?",
      'How many transactions do you process daily?'
    ],
    solution: 'AI Fraud Detection System',
    benefits: [
      'Real-time detection with 94% accuracy',
      '70% reduction in false positives',
      'Learns new fraud patterns automatically',
      'Processes millions of transactions per second'
    ],
    deflection: 'Fraud patterns are unique to each business - sharing generic approaches helps fraudsters more than you.'
  },

  support: {
    keywords: ['customer support', 'tickets', 'help desk', 'complaints', 'inquiries', 'customer service', 'overwhelmed'],
    urgencyLevel: 'medium',
    response: 'support_automation',
    questions: [
      'How many support tickets do you receive daily?',
      'What are the most common customer inquiries?',
      "What's your current average response time?"
    ],
    solution: 'Intelligent Support Automation',
    benefits: [
      'Resolve 60% of tickets without human intervention',
      'Reduce response time from hours to seconds',
      'Available 24/7 in multiple languages',
      'Maintain 95% customer satisfaction scores'
    ],
    deflection: 'Effective automation requires understanding your specific customer intents and response patterns.'
  },

  documents: {
    keywords: ['paperwork', 'documents', 'contracts', 'manual processing', 'data entry'],
    urgencyLevel: 'low',
    response: 'document_processing',
    questions: [
      'What types of documents do you process?',
      'How many hours spent on manual data entry?',
      'What errors occur in manual processing?'
    ],
    solution: 'Intelligent Document Processing',
    benefits: [
      'Extract data with 98% accuracy',
      'Process documents 80% faster',
      'Handle any format - PDFs, scans, handwritten',
      'Integrate directly with existing systems'
    ],
    deflection: 'Document processing requires custom extraction rules and validation logic specific to your forms.'
  },

  maintenance: {
    keywords: ['equipment failure', 'breakdown', 'downtime', 'maintenance', 'repair', 'breaking'],
    urgencyLevel: 'high',
    response: 'predictive_maintenance',
    questions: [
      'How often do you experience unexpected breakdowns?',
      "What's the cost of an hour of downtime?",
      'Do you collect sensor or operational data?'
    ],
    solution: 'Predictive Maintenance AI',
    benefits: [
      'Predict failures 2-4 weeks in advance',
      'Reduce unplanned downtime by 45%',
      'Optimize maintenance schedules',
      'Extend equipment lifespan by 20%'
    ],
    deflection: 'Prediction models must be calibrated to your specific equipment and operating conditions.'
  },

  inventory: {
    keywords: ['inventory', 'stock', 'overstock', 'shortage', 'demand', 'supply chain'],
    urgencyLevel: 'medium',
    response: 'demand_forecasting',
    questions: [
      "What's your current inventory turnover rate?",
      'How often do you experience stockouts?',
      'What percentage of inventory becomes obsolete?'
    ],
    solution: 'Demand Forecasting AI',
    benefits: [
      'Reduce inventory holding costs by 30-40%',
      'Prevent stockouts and overstock situations',
      'Optimize reorder points automatically',
      'Improve cash flow significantly'
    ],
    deflection: 'Demand patterns involve complex seasonality and external factors unique to your market.'
  },

  guestflow: {
    keywords: ['guest flow', 'attendance', 'visitor', 'customer flow', 'unpredictable', 'forecasting', 'capacity'],
    urgencyLevel: 'medium',
    response: 'guest_flow_prediction',
    questions: [
      "What's your current variance from forecasts?",
      'How does weather impact your attendance?',
      'What data sources do you currently use?'
    ],
    solution: 'Guest Flow Prediction Engine',
    benefits: [
      'Predict daily attendance with 85% accuracy',
      'Forecast 7-14 days in advance',
      'Optimize staffing levels automatically',
      'Reduce labor costs by 15-20%'
    ],
    deflection: 'Accurate predictions require integrating multiple data sources specific to your location and customer base.'
  }
};