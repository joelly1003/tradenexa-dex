import { Suspense } from 'react';
import { MarketInterface } from '../../components/market/MarketInterface';

export default function MarketPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading Market...</div>}>
      <MarketInterface />
    </Suspense>
  );
}
