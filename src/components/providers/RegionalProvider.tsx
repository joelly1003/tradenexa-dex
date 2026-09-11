'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'USD' | 'EUR' | 'NGN' | 'GBP';
type Language = 'EN' | 'ES' | 'FR' | 'DE';
type Region = 'US' | 'EU' | 'NG' | 'UK';

interface RegionalContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  region: Region;
  setRegion: (r: Region) => void;
  getSymbol: () => string;
}

const RegionalContext = createContext<RegionalContextType | undefined>(undefined);

export function RegionalProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [language, setLanguage] = useState<Language>('EN');
  const [region, setRegion] = useState<Region>('US');



  const getSymbol = () => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'NGN': return '₦';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  return (
    <RegionalContext.Provider value={{ currency, setCurrency, language, setLanguage, region, setRegion, getSymbol }}>
      {children}
    </RegionalContext.Provider>
  );
}

export function useRegional() {
  const context = useContext(RegionalContext);
  if (context === undefined) {
    throw new Error('useRegional must be used within a RegionalProvider');
  }
  return context;
}
