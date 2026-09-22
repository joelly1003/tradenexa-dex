'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useCurrencyStore, FiatCurrency, FIAT_RATES } from '../../store/currencyStore';

type Language = 'EN' | 'ES' | 'FR' | 'DE';
type Region = 'US' | 'EU' | 'NG' | 'UK';

interface RegionalContextType {
  currency: FiatCurrency;
  setCurrency: (c: FiatCurrency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  region: Region;
  setRegion: (r: Region) => void;
  getSymbol: () => string;
}

const RegionalContext = createContext<RegionalContextType | undefined>(undefined);

export function RegionalProvider({ children }: { children: ReactNode }) {
  const { fiat, setFiat } = useCurrencyStore();
  const [language, setLanguage] = useState<Language>('EN');
  const [region, setRegion] = useState<Region>('US');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getSymbol = () => {
    if (!mounted) return '$';
    return FIAT_RATES[fiat]?.symbol || '$';
  };

  return (
    <RegionalContext.Provider value={{ 
      currency: mounted ? fiat : 'USD', 
      setCurrency: setFiat, 
      language, 
      setLanguage, 
      region, 
      setRegion, 
      getSymbol 
    }}>
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
