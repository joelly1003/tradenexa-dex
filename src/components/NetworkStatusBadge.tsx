'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useInkBlockNumber } from '../hooks/useInkBlockNumber';

interface NetworkStatusBadgeProps {
  className?: string;
  showExplorerLink?: boolean;
}

export function NetworkStatusBadge({
  className = '',
  showExplorerLink = true,
}: NetworkStatusBadgeProps) {
  const { blockNumber, formattedBlockNumber, isLoading, isError } = useInkBlockNumber();

  const explorerUrl = blockNumber 
    ? `https://explorer.inkonchain.com/block/${blockNumber}` 
    : 'https://explorer.inkonchain.com';

  const badgeContent = (
    <div
      className={`inline-flex items-center gap-2.5 bg-[#B1FA41]/5 hover:bg-[#B1FA41]/10 border border-[#B1FA41]/20 hover:border-[#B1FA41]/40 rounded-full px-4 py-1.5 text-xs font-bold text-[#B1FA41] shadow-[0_0_15px_rgba(177,250,65,0.1)] transition-all hover:scale-105 group select-none ${className}`}
    >
      {/* Live Pulsing Dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B1FA41] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B1FA41]" />
      </span>

      {/* Network & Dynamic Block Text */}
      <div className="flex items-center gap-1.5 font-mono">
        <span className="font-sans font-bold">Live on Ink Mainnet</span>
        <span className="text-[#B1FA41]/50">•</span>
        {isLoading ? (
          <span className="text-[#B1FA41]/70 animate-pulse">Block #······</span>
        ) : isError || !formattedBlockNumber ? (
          <span className="text-[#B1FA41]/90">Online</span>
        ) : (
          <span className="font-black text-white group-hover:text-[#B1FA41] transition-colors">
            Block #{formattedBlockNumber}
          </span>
        )}
      </div>

      {showExplorerLink && (
        <ExternalLink className="w-3 h-3 text-[#B1FA41]/40 group-hover:text-[#B1FA41] transition-colors ml-0.5" />
      )}
    </div>
  );

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={blockNumber ? `View Block #${blockNumber} on Ink Explorer` : 'View Ink Network Explorer'}
      className="inline-block"
    >
      {badgeContent}
    </a>
  );
}
