'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useBalance } from 'wagmi';

export type RampOrderStatus = 'idle' | 'created' | 'processing' | 'completed' | 'failed';

export interface RampEventData {
  status: RampOrderStatus;
  partner?: string;
  orderId?: string;
  fiatAmount?: string;
  fiatCurrency?: string;
  cryptoAmount?: string;
  cryptoCurrency?: string;
}

export function useRampStatus() {
  const { address } = useAccount();
  const { refetch: refetchBalance } = useBalance({ address });

  const [status, setStatus] = useState<RampOrderStatus>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<RampEventData | null>(null);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const handleOrderCompleted = useCallback((data?: any) => {
    setStatus('completed');
    setToastMessage('Fiat conversion complete. Assets routed to your Ink L2 address.');
    setLastOrder({
      status: 'completed',
      orderId: data?.id || data?.orderId,
      cryptoAmount: data?.cryptoAmount,
      cryptoCurrency: data?.cryptoCurrency,
    });

    // Automatically trigger balance refetch across the trade dashboard
    if (refetchBalance) {
      refetchBalance();
    }

    // Broadcast global event so any balance hooks can listen and refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tradenexa:balance-refresh'));
    }

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  }, [refetchBalance]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle Transak / MoonPay / Stripe postMessage events
      const data = event.data;
      if (!data) return;

      const eventType = data.event_id || data.type || data.event;

      if (
        eventType === 'TRANSAK_ORDER_CREATED' ||
        eventType === 'ORDER_CREATED'
      ) {
        setStatus('created');
      } else if (
        eventType === 'TRANSAK_ORDER_PROCESSING' ||
        eventType === 'ORDER_PROCESSING'
      ) {
        setStatus('processing');
      } else if (
        eventType === 'TRANSAK_ORDER_SUCCESSFUL' ||
        eventType === 'ORDER_COMPLETED' ||
        eventType === 'MOONPAY_TRANSACTION_SUCCESS'
      ) {
        handleOrderCompleted(data);
      } else if (
        eventType === 'TRANSAK_ORDER_FAILED' ||
        eventType === 'ORDER_FAILED'
      ) {
        setStatus('failed');
        setToastMessage('Fiat gateway transaction was cancelled or declined.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleOrderCompleted]);

  return {
    status,
    toastMessage,
    lastOrder,
    clearToast,
    triggerOrderCompleted: handleOrderCompleted,
  };
}
