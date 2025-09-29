// lib/industries/index.ts

import { IndustryConfig, IndustryType } from '@/types/industry';
import { ClientConfig } from '@/types/api';

// Import STRIVE configuration
import striveConfigJson from './strive/config.json';
import { striveSystemPrompt } from './strive/system-prompt';
import { striveProblemPatterns } from './strive/problem-patterns';
import { striveSolutions } from './strive/solutions';
import { striveConversationFlow } from './strive/conversation-flow';

/**
 * Load complete industry configuration
 * Merges static JSON config with TypeScript modules
 */
export async function loadIndustryConfig(
  industry: IndustryType,
  clientOverrides?: ClientConfig
): Promise<IndustryConfig> {
  
  let config: IndustryConfig;

  // Load industry-specific configuration
  switch (industry) {
    case 'strive':
      config = {
        ...striveConfigJson,
        systemPrompt: striveSystemPrompt,
        problemPatterns: striveProblemPatterns,
        solutions: striveSolutions,
        conversationFlow: striveConversationFlow,
      } as IndustryConfig;
      break;

    // Future industries will go here
    case 'real-estate':
      throw new Error('Real Estate industry not yet implemented');
    case 'dental':
      throw new Error('Dental industry not yet implemented');
    case 'legal':
      throw new Error('Legal industry not yet implemented');
    case 'manufacturing':
      throw new Error('Manufacturing industry not yet implemented');
    case 'financial':
      throw new Error('Financial industry not yet implemented');
    case 'retail':
      throw new Error('Retail industry not yet implemented');
    case 'insurance':
      throw new Error('Insurance industry not yet implemented');

    default:
      throw new Error(`Unknown industry: ${industry}`);
  }

  // Apply client-specific overrides if provided
  if (clientOverrides) {
    config = applyClientOverrides(config, clientOverrides);
  }

  return config;
}

/**
 * Apply client-specific customizations to industry config
 */
function applyClientOverrides(
  config: IndustryConfig,
  overrides: ClientConfig
): IndustryConfig {
  return {
    ...config,
    branding: {
      ...config.branding,
      ...(overrides.primaryColor && { primaryColor: overrides.primaryColor }),
      ...(overrides.secondaryColor && { secondaryColor: overrides.secondaryColor }),
      ...(overrides.logo && { logo: overrides.logo }),
    },
    businessInfo: {
      ...config.businessInfo,
      ...(overrides.companyName && { companyName: overrides.companyName }),
      ...(overrides.calendlyLink && { calendlyLink: overrides.calendlyLink }),
      ...(overrides.website && { website: overrides.website }),
      ...(overrides.phone && { phone: overrides.phone }),
    },
  };
}

/**
 * Get list of available industries
 */
export function getAvailableIndustries(): IndustryType[] {
  return ['strive']; // Add more as they're implemented
}

/**
 * Validate industry type
 */
export function isValidIndustry(industry: string): industry is IndustryType {
  const validIndustries: IndustryType[] = [
    'strive',
    'real-estate',
    'dental',
    'legal',
    'manufacturing',
    'financial',
    'retail',
    'insurance'
  ];
  return validIndustries.includes(industry as IndustryType);
}

/**
 * Get industry display name
 */
export function getIndustryDisplayName(industry: IndustryType): string {
  const names: Record<IndustryType, string> = {
    'strive': 'AI Solutions (STRIVE TECH)',
    'real-estate': 'Real Estate',
    'dental': 'Dental Practice',
    'legal': 'Legal Services',
    'manufacturing': 'Manufacturing',
    'financial': 'Financial Services',
    'retail': 'Retail',
    'insurance': 'Insurance'
  };
  return names[industry];
}