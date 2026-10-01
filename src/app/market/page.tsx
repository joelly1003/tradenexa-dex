'use client';

import { Suspense, useSyncExternalStore } from 'react';
import { MarketInterface } from '../../components/market/MarketInterface';
import MarketLoading from './loading';

const emptySubscribe = () => () => {};

export default function MarketPage() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return <MarketLoading />;
  }

  return (
    <Suspense fallback={<MarketLoading />}>
      <MarketInterface />
    </Suspense>
  );
}
