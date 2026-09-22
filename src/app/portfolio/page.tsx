import { Suspense } from 'react';
import { PortfolioInterface } from '../../components/portfolio/PortfolioInterface';

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading Portfolio...</div>}>
      <PortfolioInterface />
    </Suspense>
  );
}
