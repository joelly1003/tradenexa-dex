import { useState, useEffect, useCallback } from 'react';

export type FeedStatus = 'connected' | 'degraded' | 'stale' | 'offline';

interface FeedHealth {
  status: FeedStatus;
  lastTick: number;
  latencyMs: number;
  updateTick: () => void;
}

export function useFeedHealth(criticalThresholdMs = 5000, degradedThresholdMs = 2000): FeedHealth {
  const [lastTick, setLastTick] = useState<number>(Date.now());
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [status, setStatus] = useState<FeedStatus>('connected');

  const updateTick = useCallback(() => {
    setLastTick(Date.now());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const currentLatency = now - lastTick;
      setLatencyMs(currentLatency);

      if (currentLatency > criticalThresholdMs) {
        setStatus('stale');
      } else if (currentLatency > degradedThresholdMs) {
        setStatus('degraded');
      } else {
        setStatus('connected');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastTick, criticalThresholdMs, degradedThresholdMs]);

  useEffect(() => {
    const handleOffline = () => setStatus('offline');
    const handleOnline = () => setStatus('connected');
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return { status, lastTick, latencyMs, updateTick };
}
