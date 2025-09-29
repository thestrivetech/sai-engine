// lib/industries/strive/solutions.ts

import { Solution } from '@/types/industry';

export const striveSolutions: Record<string, Solution> = {
  churn: {
    title: "Customer Retention AI",
    description: "Predict and prevent customer churn",
    benefits: [
      "Identify at-risk customers 30-60 days early",
      "Understand why customers leave",
      "Automate targeted retention campaigns",
      "Reduce churn by 25-35%"
    ],
    cta: "Schedule Strategy Call",
    ctaAction: "booking",
    timeline: "See results in 60-90 days",
    roi: "3-5x ROI within first year"
  },

  fraud: {
    title: "Fraud Detection AI",
    description: "Catch fraud in real-time",
    benefits: [
      "94% detection accuracy",
      "70% fewer false positives",
      "Real-time transaction monitoring",
      "Learns new fraud patterns automatically"
    ],
    cta: "Schedule Demo",
    ctaAction: "booking",
    timeline: "Operational in 30-45 days",
    roi: "Prevents 10-20x implementation cost in fraud losses"
  },

  quality: {
    title: "Vision Quality Control",
    description: "Automated defect detection",
    benefits: [
      "99.7% defect detection rate",
      "10x faster than manual inspection",
      "Inspect 100% of products",
      "Catch micro-defects invisible to humans"
    ],
    cta: "See It In Action",
    ctaAction: "booking",
    timeline: "Full deployment in 30-60 days",
    roi: "Reduce quality costs by 40-60%"
  },

  maintenance: {
    title: "Predictive Maintenance",
    description: "Prevent equipment failures",
    benefits: [
      "Predict failures 2-4 weeks early",
      "Reduce downtime by 45%",
      "Optimize maintenance schedules",
      "Extend equipment life 20%"
    ],
    cta: "Learn More",
    ctaAction: "booking",
    timeline: "Predictive insights in 45-60 days",
    roi: "Save 5-10x annual maintenance budget"
  },

  support: {
    title: "Support Automation",
    description: "AI-powered customer service",
    benefits: [
      "Resolve 60% of tickets automatically",
      "24/7 availability in any language",
      "Instant response times",
      "95% customer satisfaction"
    ],
    cta: "Get Started",
    ctaAction: "booking",
    timeline: "Live in 30-45 days",
    roi: "Reduce support costs by 50-70%"
  },

  documents: {
    title: "Document Intelligence",
    description: "Automate document processing",
    benefits: [
      "Extract data with 98% accuracy",
      "Process any document format",
      "80% faster than manual entry",
      "Direct system integration"
    ],
    cta: "See Demo",
    ctaAction: "booking",
    timeline: "Processing documents in 21-30 days",
    roi: "Save thousands of work hours annually"
  },

  inventory: {
    title: "Demand Forecasting",
    description: "Optimize inventory levels",
    benefits: [
      "Reduce holding costs 30-40%",
      "Prevent stockouts",
      "Optimize reorder points",
      "Improve cash flow"
    ],
    cta: "Explore Solution",
    ctaAction: "booking",
    timeline: "Accurate forecasts in 30-45 days",
    roi: "Free up 20-30% of working capital"
  },

  revenue: {
    title: "Revenue Prediction",
    description: "Accurate financial forecasting",
    benefits: [
      "92-95% forecast accuracy",
      "Identify trends automatically",
      "Plan resources effectively",
      "Reduce variance by 60%"
    ],
    cta: "Schedule Consultation",
    ctaAction: "booking",
    timeline: "First predictions in 30 days",
    roi: "Improve margins by better planning"
  }
};