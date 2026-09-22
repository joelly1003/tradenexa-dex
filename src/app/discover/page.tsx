import { Suspense } from 'react';
import { DiscoverInterface } from '../../components/discover/DiscoverInterface';

export default function DiscoverPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="flex items-center justify-center py-20 text-white">Loading Discover...</div>}>
        <DiscoverInterface />
      </Suspense>
    </div>
  );
}
