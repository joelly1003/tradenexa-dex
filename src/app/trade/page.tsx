import { Suspense } from 'react';
import { TradeInterface } from '../../components/trading/TradeInterface';

export default function TradePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading Trade Interface...</div>}>
      <TradeInterface />
    </Suspense>
  );
}
