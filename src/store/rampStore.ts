import { create } from 'zustand';

export interface RampStore {
  isOpen: boolean;
  initialFiat: string;
  initialRail: string;
  initialMode: 'buy' | 'sell';
  openRamp: (options?: { fiat?: string; rail?: string; mode?: 'buy' | 'sell' }) => void;
  closeRamp: () => void;
}

export const useRampStore = create<RampStore>((set) => ({
  isOpen: false,
  initialFiat: 'EUR',
  initialRail: 'SEPA',
  initialMode: 'buy',
  openRamp: (options) =>
    set({
      isOpen: true,
      initialFiat: options?.fiat || 'EUR',
      initialRail: options?.rail || 'SEPA',
      initialMode: options?.mode || 'buy',
    }),
  closeRamp: () => set({ isOpen: false }),
}));
