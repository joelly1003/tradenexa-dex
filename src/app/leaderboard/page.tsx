import { Suspense } from 'react';
import { LeaderboardInterface } from '../../components/leaderboard/LeaderboardInterface';

export default function LeaderboardPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<div className="flex items-center justify-center py-20 text-white">Loading Leaderboard...</div>}>
        <LeaderboardInterface />
      </Suspense>
    </div>
  );
}
