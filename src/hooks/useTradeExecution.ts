'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount, useWalletClient, useBalance } from 'wagmi';
import {
  defaultNadoClient,
  buildSender,
  buildTimestampNonce,
  buildAppendix,
  toX18,
  OrderStruct,
  AppendixOptions,
  HexString,
} from '../lib/nado';

export interface TradeExecutionParams {
  productId: number;
  symbol: string;
  price: number;
  amount: number; // positive = buy/long, negative = sell/short
  isLong: boolean;
  orderType: string; // 'Market' | 'Limit' | 'Stop / Trigger'
  marginMode?: string; // 'Cross' | 'Isolated'
  leverage?: number;
}

export interface TradeExecutionState {
  isSubmitting: boolean;
  isQuoting: boolean;
  quoteTimeLeft: number;
  isQuoteExpired: boolean;
  isLiquidityAvailable: boolean;
  slippageTolerance: number; // e.g. 0.5 for 0.5%
  isSlippageBreached: boolean;
  priceImpact: number; // in percent
  usePrivateLane: boolean;
  privateLaneFailed: boolean;
  error: string | null;
  successDigest: string | null;
  refreshQuote: () => void;
  setSlippageTolerance: (val: number) => void;
  setUsePrivateLane: (val: boolean) => void;
  executeTrade: (params: TradeExecutionParams) => Promise<any>;
  retryWithStandardRoute: () => Promise<any>;
  resetError: () => void;
}

const QUOTE_DURATION = 10; // 10 seconds validity window

export function useTradeExecution(): TradeExecutionState {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: balanceData } = useBalance({ address });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteTimeLeft, setQuoteTimeLeft] = useState(QUOTE_DURATION);
  const [isQuoteExpired, setIsQuoteExpired] = useState(false);
  const [isLiquidityAvailable, setIsLiquidityAvailable] = useState(true);

  const [slippageTolerance, setSlippageTolerance] = useState(0.5); // Default 0.5%
  const [isSlippageBreached, setIsSlippageBreached] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0.08); // Mock calculated live impact

  const [usePrivateLane, setUsePrivateLane] = useState(true);
  const [privateLaneFailed, setPrivateLaneFailed] = useState(false);
  const [lastParams, setLastParams] = useState<TradeExecutionParams | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successDigest, setSuccessDigest] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 10-Second Quote Expiration Countdown
  const startQuoteTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setQuoteTimeLeft(QUOTE_DURATION);
    setIsQuoteExpired(false);

    timerRef.current = setInterval(() => {
      setQuoteTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsQuoteExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startQuoteTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startQuoteTimer]);

  const refreshQuote = useCallback(() => {
    setIsQuoting(true);
    setError(null);
    setIsQuoteExpired(false);
    // Simulate quote refresh
    setTimeout(() => {
      setIsQuoting(false);
      setIsLiquidityAvailable(true);
      startQuoteTimer();
    }, 400);
  }, [startQuoteTimer]);

  const mapExecutionError = (err: any): string => {
    const raw = (err?.message || err?.details || String(err)).toLowerCase();

    // User rejected signature in wallet
    if (
      raw.includes('user rejected') ||
      raw.includes('user denied') ||
      raw.includes('action rejected') ||
      raw.includes('4001')
    ) {
      return 'Signature declined in wallet.';
    }

    // Insufficient gas or ETH balance
    if (
      raw.includes('insufficient funds') ||
      raw.includes('gas required exceeds') ||
      raw.includes('insufficient balance')
    ) {
      return 'Insufficient ETH balance for Ink Network gas.';
    }

    // Quote or order intent auction expiration
    if (
      raw.includes('expired') ||
      raw.includes('auction timeout') ||
      raw.includes('timestamp')
    ) {
      return 'Order intent expired. Requesting a new quote...';
    }

    // Liquidity exhaustion
    if (
      raw.includes('liquidity') ||
      raw.includes('max_order_size') ||
      raw.includes('exceeds capacity')
    ) {
      return 'Solver liquidity unavailable for this size. Adjust amount or refresh quote.';
    }

    // Slippage violation
    if (raw.includes('slippage') || raw.includes('price impact')) {
      return 'Price impact exceeds slippage tolerance. Update slippage to proceed.';
    }

    // Private RPC failure
    if (raw.includes('private rpc') || raw.includes('mev') || raw.includes('proxy timeout')) {
      return 'Private MEV lane unavailable. Retry with standard fallback route?';
    }

    return err?.message || 'Transaction submission failed. Please check network connection.';
  };

  const executeTrade = async (params: TradeExecutionParams) => {
    if (!address || !walletClient) {
      throw new Error('Please connect your Web3 wallet.');
    }

    // Check quote expiration
    if (isQuoteExpired) {
      const msg = 'Solver liquidity unavailable for this size. Adjust amount or refresh quote.';
      setError(msg);
      throw new Error(msg);
    }

    // Check slippage breach
    if (priceImpact > slippageTolerance) {
      setIsSlippageBreached(true);
      const msg = 'Price impact exceeds slippage tolerance. Update slippage to proceed.';
      setError(msg);
      throw new Error(msg);
    }

    // Check gas balance
    const userEth = balanceData ? parseFloat(balanceData.formatted) : 0;
    if (userEth <= 0.00001) {
      const msg = 'Insufficient ETH balance for Ink Network gas.';
      setError(msg);
      throw new Error(msg);
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessDigest(null);
    setLastParams(params);

    try {
      const sender = buildSender(address, 'default');
      const priceX18 = toX18(params.price);
      const amountX18 = toX18(params.amount);
      const side = params.isLong ? 'buy' : 'sell';

      // Pre-flight sizing verification with solver
      try {
        const maxSizeData = await defaultNadoClient.query({
          type: 'max_order_size',
          subaccount: sender,
          product_id: params.productId,
          price_x18: priceX18.toString(),
          side,
        });

        if (maxSizeData?.max_order_size_x18) {
          const maxAmount = BigInt(maxSizeData.max_order_size_x18);
          const requestedAbsAmount = amountX18 < BigInt(0) ? -amountX18 : amountX18;
          if (requestedAbsAmount > maxAmount && maxAmount > BigInt(0)) {
            setIsLiquidityAvailable(false);
            const msg = 'Solver liquidity unavailable for this size. Adjust amount or refresh quote.';
            setError(msg);
            throw new Error(msg);
          }
        }
      } catch (err: any) {
        if (err.message && err.message.includes('Solver liquidity unavailable')) {
          throw err;
        }
        console.warn('Pre-flight sizing non-blocking notice:', err);
      }

      // Prepare EIP-712 Order Struct
      const expiration = BigInt(Math.floor(Date.now() / 1000) + 86400 * 30);
      const nonce = buildTimestampNonce();
      const appendixStr = buildAppendix({
        isolated: params.marginMode === 'Isolated',
        orderType: params.orderType === 'Limit' ? 'POST_ONLY' : 'DEFAULT',
      });

      const orderStruct: OrderStruct = {
        sender,
        priceX18,
        amount: amountX18,
        expiration,
        nonce,
        appendix: BigInt(appendixStr),
      };

      // Submit intent order via NADO solver client
      const result = await defaultNadoClient.placeOrder(
        walletClient,
        address as HexString,
        orderStruct,
        params.productId
      );

      const digest = (result as any)?.digest || (result as any)?.tx_hash || '0x' + nonce.toString(16);
      setSuccessDigest(digest);
      startQuoteTimer(); // Reset quote timer
      return result;
    } catch (err: any) {
      console.error('Trade Execution Error:', err);
      const friendlyMessage = mapExecutionError(err);
      setError(friendlyMessage);

      // If private lane failed, flag fallback possibility
      if (usePrivateLane && (err?.message?.includes('network') || err?.message?.includes('timeout') || err?.message?.includes('fetch'))) {
        setPrivateLaneFailed(true);
      }

      throw new Error(friendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryWithStandardRoute = async () => {
    if (!lastParams) return;
    setUsePrivateLane(false);
    setPrivateLaneFailed(false);
    setError(null);
    return executeTrade(lastParams);
  };

  const resetError = () => {
    setError(null);
    setIsSlippageBreached(false);
    setPrivateLaneFailed(false);
  };

  return {
    isSubmitting,
    isQuoting,
    quoteTimeLeft,
    isQuoteExpired,
    isLiquidityAvailable,
    slippageTolerance,
    isSlippageBreached,
    priceImpact,
    usePrivateLane,
    privateLaneFailed,
    error,
    successDigest,
    refreshQuote,
    setSlippageTolerance,
    setUsePrivateLane,
    executeTrade,
    retryWithStandardRoute,
    resetError,
  };
}
