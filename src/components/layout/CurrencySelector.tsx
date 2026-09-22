'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrencyStore, FIAT_RATES, FiatCurrency } from '../../store/currencyStore';

export function CurrencySelector() {
  const { fiat, setFiat } = useCurrencyStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="h-[38px] w-[80px] bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl"></div>;
  }

  const currencies = Object.keys(FIAT_RATES) as FiatCurrency[];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-[38px] px-3 flex items-center justify-between gap-2 bg-zinc-100 dark:bg-[#101114] hover:bg-zinc-200 dark:hover:bg-[#1a1b1f] border border-transparent dark:border-zinc-800 text-black dark:text-white rounded-xl transition-all font-mono text-sm font-bold min-w-[70px] ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
        aria-label="Select Currency"
      >
        <span>{fiat}</span>
        <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-[#151518] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 py-1">
          {currencies.map(c => (
            <button
              key={c}
              onClick={() => { setFiat(c); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 font-mono text-sm font-medium flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800 ${fiat === c ? 'text-blue-500' : 'text-black dark:text-white'}`}
            >
              <span>{c}</span>
              <span className="text-zinc-500">{FIAT_RATES[c].symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
