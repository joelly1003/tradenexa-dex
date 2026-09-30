'use client';

import React, { useSyncExternalStore, Suspense } from 'react';
import { TradeInterface } from '../../components/trading/TradeInterface';
import TradeLoading from './loading';

const emptySubscribe = () => () => {};

export default function TradePage() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return <TradeLoading />;
  }

  return (
    <Suspense fallback={<TradeLoading />}>
      <TradeInterface />
    </Suspense>
  );
}
