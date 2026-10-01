'use client';

import { Suspense, useSyncExternalStore } from 'react';
import { LeaderboardInterface } from '../../components/leaderboard/LeaderboardInterface';
import LeaderboardLoading from './loading';

const emptySubscribe = () => () => {};

export default function LeaderboardPage() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return <LeaderboardLoading />;
  }

  return (
    <div className="w-full">
      <Suspense fallback={<LeaderboardLoading />}>
        <LeaderboardInterface />
      </Suspense>
    </div>
  );
}
