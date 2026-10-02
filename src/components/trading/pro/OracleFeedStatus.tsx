import React from 'react';
import { Activity, AlertTriangle, WifiOff } from 'lucide-react';
import { FeedStatus } from '../../../hooks/nado/useFeedHealth';

interface OracleFeedStatusProps {
  status: FeedStatus;
  latencyMs: number;
}

export function OracleFeedStatus({ status, latencyMs }: OracleFeedStatusProps) {
  if (status === 'connected') {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
        <Activity className="w-3 h-3 text-green-500" />
        <span className="text-[10px] font-mono font-bold text-green-500">{latencyMs}ms</span>
      </div>
    );
  }
  
  if (status === 'degraded') {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md">
        <AlertTriangle className="w-3 h-3 text-amber-500" />
        <span className="text-[10px] font-mono font-bold text-amber-500">{latencyMs}ms Lag</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
      <WifiOff className="w-3 h-3 text-red-500 animate-pulse" />
      <span className="text-[10px] font-mono font-bold text-red-500">Stale Feed</span>
    </div>
  );
}
