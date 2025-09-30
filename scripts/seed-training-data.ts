// scripts/seed-training-data.ts

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * High-quality training conversations for STRIVE
 * These represent successful conversation patterns
 */
const STRIVE_TRAINING_DATA = [
  // CHURN PATTERNS - HIGH CONVERSION
  {
    userInput: "We're losing customers every month and don't know why",
    assistantResponse: "I understand how frustrating that is - customer churn can feel like watching revenue slip away without knowing how to stop it.\n\nCan I ask, what percentage of customers are you losing monthly? And do you have any data on why they're leaving?\n\nOur Churn Prediction AI helps companies identify at-risk customers 30-60 days before they leave, which gives you time to intervene. It's helped companies reduce churn by 25-35% within 90 days.",
    problemType: "churn",
    solutionType: "churn_prediction",
    conversationStage: "qualifying",
    outcome: "booking_completed",
    conversionScore: 0.95,
  },
  {
    userInput: "Customers keep switching to competitors",
    assistantResponse: "That's tough - especially when you're not sure what's driving them away.\n\nLet me ask: how much does it cost you to acquire a new customer compared to retaining an existing one?\n\nOur Customer Retention AI can predict which customers are at risk and why. Most clients see the system pay for itself within 4-6 months through saved retention costs.\n\nLet's set up a meeting to discuss how this would work specifically for your business: https://calendly.com/strivetech",
    problemType: "churn",
    solutionType: "churn_prediction",
    conversationStage: "solutioning",
    outcome: "booking_completed",
    conversionScore: 0.92,
  },

  // SUPPORT AUTOMATION - HIGH CONVERSION
  {
    userInput: "Our support team is drowning in tickets",
    assistantResponse: "I hear you - when support volume outpaces your team's capacity, it affects everything from response times to employee burnout.\n\nHow many tickets are you handling daily? And what percentage are repetitive questions?\n\nOur Support Automation typically resolves 60% of tickets instantly without human intervention. That frees up your team for complex issues while customers get instant answers 24/7.",
    problemType: "support",
    solutionType: "support_automation",
    conversationStage: "qualifying",
    outcome: "booking_completed",
    conversionScore: 0.88,
  },
  {
    userInput: "We need help with customer service scaling",
    assistantResponse: "Scaling support is a common challenge - hiring more people isn't always the answer when the volume keeps growing.\n\nOur Intelligent Support Automation handles routine inquiries automatically while routing complex issues to your team with full context. Companies typically see 50-70% cost reduction while improving satisfaction scores.\n\nLet's set up a meeting to discuss how this would work specifically for your business: https://calendly.com/strivetech",
    problemType: "support",
    solutionType: "support_automation",
    conversationStage: "solutioning",
    outcome: "booking_completed",
    conversionScore: 0.90,
  },

  // QUALITY CONTROL - HIGH CONVERSION
  {
    userInput: "Too many defects are getting through our QA",
    assistantResponse: "Quality escapes are costly - both in rework and reputation. I bet that's causing some serious headaches.\n\nWhat's your current defect escape rate? And are you able to inspect 100% of products or just sampling?\n\nOur Computer Vision Quality Control inspects every single product at 99.7% accuracy - 10x faster than manual inspection. It catches micro-defects that humans miss.",
    problemType: "quality",
    solutionType: "quality_control",
    conversationStage: "qualifying",
    outcome: "booking_completed",
    conversionScore: 0.93,
  },
  {
    userInput: "Manual inspection is too slow and inconsistent",
    assistantResponse: "Exactly - human inspection has inherent limitations in speed, consistency, and the ability to catch subtle defects.\n\nOur Vision Quality Control system processes products 10x faster than manual inspection while maintaining 99.7% accuracy. Plus it learns your specific quality standards over time.\n\nMost manufacturers see 40-60% reduction in quality costs within the first 6 months.\n\nLet's set up a meeting to discuss how this would work specifically for your business: https://calendly.com/strivetech",
    problemType: "quality",
    solutionType: "quality_control",
    conversationStage: "solutioning",
    outcome: "booking_completed",
    conversionScore: 0.91,
  },

  // PREDICTIVE MAINTENANCE - HIGH CONVERSION
  {
    userInput: "Equipment keeps breaking down unexpectedly",
    assistantResponse: "Unexpected downtime is brutal - every hour of stopped production adds up fast.\n\nWhat's the typical cost of an hour of downtime for you? And do you collect any sensor data from your equipment?\n\nOur Predictive Maintenance AI analyzes equipment patterns to predict failures 2-4 weeks in advance. Companies typically reduce unplanned downtime by 45%.",
    problemType: "maintenance",
    solutionType: "predictive_maintenance",
    conversationStage: "qualifying",
    outcome: "booking_completed",
    conversionScore: 0.89,
  },

  // FRAUD DETECTION - HIGH URGENCY
  {
    userInput: "We're seeing suspicious transactions",
    assistantResponse: "Fraud is urgent - every day of delay means more losses. I understand you need to act fast.\n\nWhat types of fraud are you experiencing? And what's your current fraud loss rate?\n\nOur Fraud Detection AI catches 94% of fraud attempts in real-time while reducing false positives by 70%. It learns new fraud patterns automatically.\n\nGiven the urgency, let's get you on a call this week: https://calendly.com/strivetech",
    problemType: "fraud",
    solutionType: "fraud_detection",
    conversationStage: "solutioning",
    outcome: "booking_completed",
    conversionScore: 0.94,
  },

  // REVENUE FORECASTING
  {
    userInput: "Our sales forecasts are always wrong",
    assistantResponse: "Inaccurate forecasts make everything harder - from inventory planning to resource allocation.\n\nHow accurate are your current forecasts? And how far in advance do you need to predict?\n\nOur Revenue Forecasting System achieves 92-95% accuracy by analyzing historical patterns, seasonal trends, and external factors. Most companies see 60% reduction in forecast variance.\n\nLet's set up a meeting to discuss how this would work specifically for your business: https://calendly.com/strivetech",
    problemType: "revenue",
    solutionType: "revenue_forecasting",
    conversationStage: "solutioning",
    outcome: "booking_completed",
    conversionScore: 0.87,
  },

  // PRICING OBJECTIONS - MEDIUM CONVERSION
  {
    userInput: "How much does this cost?",
    assistantResponse: "Great question. Investment depends entirely on your volume and current costs. For context, most clients see 10-20x ROI within the first year.\n\nWhat matters most is the business impact. For example, if you're losing $50k monthly to churn, a system that cuts that by 30% pays for itself in a few months.\n\nLet's hop on a quick call to discuss your specific situation and I can give you accurate numbers: https://calendly.com/strivetech",
    problemType: "pricing_question",
    solutionType: "roi_focused",
    conversationStage: "closing",
    outcome: "booking_completed",
    conversionScore: 0.75,
  },
  {
    userInput: "What's the price range?",
    assistantResponse: "Pricing is customized based on the value delivered. We have solutions from pilot projects to enterprise deployments.\n\nWhat's more important than cost is ROI - typically 10-20x within year one. For a business your size, the system usually pays for itself within 4-6 months through saved costs.\n\nWant to see the specific numbers for your situation? Let's schedule a quick call: https://calendly.com/strivetech",
    problemType: "pricing_question",
    solutionType: "roi_focused",
    conversationStage: "closing",
    outcome: "booking_completed",
    conversionScore: 0.72,
  },

  // IMPLEMENTATION QUESTIONS - DEFLECTION NEEDED
  {
    userInput: "How do you implement this?",
    assistantResponse: "Implementation is highly customized to your specific data infrastructure and business processes. The exact approach depends on factors like your current tech stack, data volume, and integration requirements.\n\nOur proprietary methodology has taken years to perfect and involves dozens of decision points specific to your environment. I'd need to understand your specifics first.\n\nLet's set up a meeting where I can walk you through the implementation roadmap for your exact situation: https://calendly.com/strivetech",
    problemType: "implementation_question",
    solutionType: "consultation_required",
    conversationStage: "closing",
    outcome: "booking_completed",
    conversionScore: 0.80,
  },

  // SKEPTICAL USERS - BUILD TRUST
  {
    userInput: "We've tried AI before and it didn't work",
    assistantResponse: "I hear that often - and honestly, most DIY AI projects fail because they lack the domain expertise and infrastructure needed.\n\nWhat specifically didn't work? Was it accuracy, integration issues, or something else?\n\nOur advantage is we've built these exact solutions dozens of times across your industry. We know the common failure points and how to avoid them. Plus, our systems are trained on industry-specific patterns, not generic data.\n\nLet's discuss what went wrong before and how we'd approach it differently: https://calendly.com/strivetech",
    problemType: "skepticism",
    solutionType: "credibility_building",
    conversationStage: "qualifying",
    outcome: "booking_completed",
    conversionScore: 0.78,
  },

  // DISCOVERY - OPEN EXPLORATION
  {
    userInput: "Just looking at AI options",
    assistantResponse: "Smart to explore! AI can transform operations, but the key is finding the right application for your specific challenges.\n\nWhat's the biggest operational challenge your team is facing right now? Or what manual process takes up the most time?\n\nI can help you identify where AI would have the most impact for your business.",
    problemType: "discovery",
    solutionType: "qualification",
    conversationStage: "discovery",
    outcome: "in_progress",
    conversionScore: 0.60,
  },
];

/**
 * Generate embeddings and seed database
 */
async function seedTrainingData() {
  console.log('🌱 Starting training data seed...');

  let successCount = 0;
  let errorCount = 0;

  for (const example of STRIVE_TRAINING_DATA) {
    try {
      // Generate embedding
      console.log(`Generating embedding for: "${example.userInput.substring(0, 50)}..."`);
      
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: example.userInput,
      });

      const embedding = response.data[0].embedding;

      // Insert into database
      const { error } = await supabase.from('example_conversations').insert({
        industry: 'strive',
        user_input: example.userInput,
        assistant_response: example.assistantResponse,
        embedding,
        problem_type: example.problemType,
        solution_type: example.solutionType,
        conversation_stage: example.conversationStage,
        outcome: example.outcome,
        conversion_score: example.conversionScore,
        is_verified: true,
      });

      if (error) {
        console.error(`❌ Error inserting example:`, error);
        errorCount++;
      } else {
        console.log(`✅ Inserted: ${example.problemType} (${example.conversationStage})`);
        successCount++;
      }

      // Rate limit: Wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Error processing example:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Seed Summary:');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📦 Total: ${STRIVE_TRAINING_DATA.length}`);
}

// Run seeder
seedTrainingData()
  .then(() => {
    console.log('\n✨ Training data seed complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Seed failed:', error);
    process.exit(1);
  });