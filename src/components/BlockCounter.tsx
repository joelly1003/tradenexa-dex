'use client';

import React, { useEffect, useState, useRef, useSyncExternalStore } from 'react';
import { useBlockNumber } from 'wagmi';
import { ExternalLink, WifiOff } from 'lucide-react';

const emptySubscribe = () => () => {};

interface BlockCounterProps {
  className?: string;
  showExplorerLink?: boolean;
}

export function BlockCounter({
  className = '',
  showExplorerLink = true,
}: BlockCounterProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Poll block number with watch: true on Ink Mainnet (57073)
  const { data: currentBlockData, isError, isLoading } = useBlockNumber({
    chainId: 57073,
    watch: true,
  });

  // Cached last known block to prevent layout disruption during network hiccups
  const [cachedBlock, setCachedBlock] = useState<bigint | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const prevBlockRef = useRef<bigint | null>(null);

  useEffect(() => {
    if (currentBlockData !== undefined && currentBlockData !== null) {
      if (prevBlockRef.current !== null && prevBlockRef.current !== currentBlockData) {
        setIsFlashing(true);
        const timer = setTimeout(() => setIsFlashing(false), 800);
        return () => clearTimeout(timer);
      }
      prevBlockRef.current = currentBlockData;
      setCachedBlock(currentBlockData);
    }
  }, [currentBlockData]);

  // If we have current block, use it; otherwise fallback to cached block
  const activeBlock = currentBlockData ?? cachedBlock;
  const hasError = isError && !currentBlockData;
  const isStale = isError && cachedBlock !== null;

  const formattedBlock = activeBlock ? Number(activeBlock).toLocaleString('en-US') : null;
  const explorerUrl = activeBlock
    ? `https://explorer.inkonchain.com/block/${activeBlock.toString()}`
    : 'https://explorer.inkonchain.com';

  if (!isMounted || (isLoading && !cachedBlock)) {
    return (
      <div
        className={`inline-flex items-center gap-2.5 bg-[#B1FA41]/5 border border-[#B1FA41]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#B1FA41] shadow-[0_0_15px_rgba(177,250,65,0.08)] select-none ${className}`}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B1FA41] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B1FA41]" />
        </span>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="font-sans font-bold">Live on Ink Mainnet</span>
          <span className="text-[#B1FA41]/50">•</span>
          <span className="text-[#B1FA41]/70 animate-pulse tracking-wider">Block #······</span>
        </div>
      </div>
    );
  }

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={activeBlock ? `View Block #${activeBlock} on Ink Explorer` : 'View Ink Network Explorer'}
      className="inline-block group focus:outline-none"
    >
      <div
        className={`inline-flex items-center gap-2.5 border rounded-full px-4 py-1.5 text-xs font-bold shadow-[0_0_15px_rgba(177,250,65,0.08)] transition-all duration-300 hover:scale-[1.03] select-none ${
          isStale
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : isFlashing
            ? 'bg-[#B1FA41]/20 border-[#B1FA41]/60 text-white shadow-[0_0_20px_rgba(177,250,65,0.25)]'
            : 'bg-[#B1FA41]/5 hover:bg-[#B1FA41]/10 border-[#B1FA41]/20 hover:border-[#B1FA41]/40 text-[#B1FA41]'
        } ${className}`}
      >
        {/* Live / Degraded Indicator Dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          {isStale ? (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          ) : (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B1FA41] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B1FA41]" />
            </>
          )}
        </span>

        {/* Network & Block Readout */}
        <div className="flex items-center gap-1.5 font-mono">
          <span className="font-sans font-bold">Live on Ink Mainnet</span>
          <span className={isStale ? 'text-amber-400/50' : 'text-[#B1FA41]/50'}>•</span>

          {formattedBlock ? (
            <span
              className={`font-black transition-colors ${
                isStale
                  ? 'text-amber-300'
                  : 'text-white group-hover:text-[#B1FA41]'
              } ${isFlashing ? 'text-[#B1FA41] font-extrabold' : ''}`}
            >
              Block #{formattedBlock}
            </span>
          ) : hasError ? (
            <span className="text-amber-400 flex items-center gap-1">
              <WifiOff className="w-3 h-3" /> Reconnecting
            </span>
          ) : (
            <span className="text-[#B1FA41]/70 animate-pulse tracking-wider">Block #······</span>
          )}
        </div>

        {showExplorerLink && (
          <ExternalLink
            className={`w-3 h-3 transition-colors ml-0.5 ${
              isStale
                ? 'text-amber-400/60 group-hover:text-amber-400'
                : 'text-[#B1FA41]/40 group-hover:text-[#B1FA41]'
            }`}
          />
        )}
      </div>
    </a>
  );
}
