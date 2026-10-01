'use client';

import { Suspense, useSyncExternalStore } from 'react';
import { EarnInterface } from '../../components/earn/EarnInterface';
import EarnLoading from './loading';

const emptySubscribe = () => () => {};

export default function EarnPage() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return <EarnLoading />;
  }

  return (
    <div className="w-full">
      <Suspense fallback={<EarnLoading />}>
        <EarnInterface />
      </Suspense>
    </div>
  );
}
