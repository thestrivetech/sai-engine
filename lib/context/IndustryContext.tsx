// lib/context/IndustryContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IndustryType, IndustryConfig } from '@/types/industry';
import { loadIndustryConfig } from '@/lib/industries';

interface IndustryContextType {
  industry: IndustryType | null;
  industryConfig: IndustryConfig | null;
  setIndustry: (industry: IndustryType) => void;
  isLoading: boolean;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export function IndustryProvider({ children }: { children: ReactNode }) {
  const [industry, setIndustryState] = useState<IndustryType | null>(null);
  const [industryConfig, setIndustryConfig] = useState<IndustryConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load industry config when industry changes
  useEffect(() => {
    if (industry) {
      setIsLoading(true);
      loadIndustryConfig(industry)
        .then(config => {
          setIndustryConfig(config);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Failed to load industry config:', error);
          setIsLoading(false);
        });
    }
  }, [industry]);

  // Persist industry selection to localStorage
  const setIndustry = (newIndustry: IndustryType) => {
    setIndustryState(newIndustry);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected-industry', newIndustry);
    }
  };

  // Load persisted industry on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selected-industry');
      if (stored) {
        setIndustryState(stored as IndustryType);
      }
    }
  }, []);

  return (
    <IndustryContext.Provider value={{ industry, industryConfig, setIndustry, isLoading }}>
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustry() {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error('useIndustry must be used within an IndustryProvider');
  }
  return context;
}