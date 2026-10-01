'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export interface InkBlockNumberState {
  blockNumber: number | null;
  formattedBlockNumber: string | null;
  isLoading: boolean;
  isError: boolean;
  isLive: boolean;
  refetch: () => Promise<void>;
}

const INK_RPC_ENDPOINTS = [
  'https://rpc-gel.inkonchain.com',
  'https://rpc-qnd.inkonchain.com',
  'https://rpc.inkonchain.com',
];

export function useInkBlockNumber(): InkBlockNumberState {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);

  const fetchBlockNumber = useCallback(async (): Promise<void> => {
    let success = false;

    for (const endpoint of INK_RPC_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
          signal: controller.signal,
          cache: 'no-store',
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.result) {
            const parsed = parseInt(data.result, 16);
            if (!isNaN(parsed) && parsed > 0) {
              setBlockNumber(parsed);
              setIsError(false);
              setIsLoading(false);
              setIsLive(true);
              success = true;
              break;
            }
          }
        }
      } catch {
        // Continue to fallback
      }
    }

    if (!success) {
      setIsError(true);
      setIsLoading(false);
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let active = true;

    const poll = async () => {
      for (const endpoint of INK_RPC_ENDPOINTS) {
        if (!active) return;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_blockNumber',
              params: [],
              id: 1,
            }),
            signal: controller.signal,
            cache: 'no-store',
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (data && data.result) {
              const parsed = parseInt(data.result, 16);
              if (!isNaN(parsed) && parsed > 0 && active) {
                setBlockNumber(parsed);
                setIsError(false);
                setIsLoading(false);
                setIsLive(true);
                return;
              }
            }
          }
        } catch {
          // Continue to fallback
        }
      }

      if (active) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    poll();

    const interval = setInterval(() => {
      if (active) {
        poll();
      }
    }, 3500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isMounted]);

  const formattedBlockNumber = blockNumber 
    ? blockNumber.toLocaleString('en-US') 
    : null;

  return {
    blockNumber,
    formattedBlockNumber,
    isLoading: !isMounted || isLoading,
    isError,
    isLive,
    refetch: fetchBlockNumber,
  };
}
