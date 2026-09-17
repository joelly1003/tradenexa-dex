import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import {
  defaultNadoClient,
  buildSender,
  buildTimestampNonce,
  buildAppendix,
  toX18,
  toUnits,
  OrderStruct,
  AppendixOptions,
  HexString,
} from '../../lib/nado';

export interface PlaceOrderParams {
  productId: number;
  price: number | string;
  amount: number | string; // Positive for buy, negative for sell
  expirationSeconds?: number;
  appendixOptions?: AppendixOptions;
  subaccountName?: string;
}

export function useNadoTrade() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = async (params: PlaceOrderParams) => {
    if (!address || !walletClient) {
      throw new Error('Wallet not connected');
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const sender = buildSender(address, params.subaccountName || 'default');
      const priceX18 = toX18(params.price);
      const amountX18 = toX18(params.amount);
      const side = BigInt(amountX18) >= BigInt(0) ? 'buy' : 'sell';

      // Pre-flight sizing validation
      try {
        const maxSizeData = await defaultNadoClient.query({
          type: 'max_order_size',
          subaccount: sender,
          product_id: params.productId,
          price_x18: priceX18.toString(),
          side,
        });

        if (maxSizeData && maxSizeData.max_order_size_x18) {
          const maxAmount = BigInt(maxSizeData.max_order_size_x18);
          const requestedAbsAmount = amountX18 < BigInt(0) ? -amountX18 : amountX18;
          if (requestedAbsAmount > maxAmount) {
            console.warn('Requested size exceeds calculated max_order_size, proceeding with caution');
          }
        }
      } catch (err) {
        console.warn('Max order size pre-flight check warning:', err);
      }

      const expiration = BigInt(
        Math.floor(Date.now() / 1000) + (params.expirationSeconds || 86400 * 30)
      );
      const nonce = buildTimestampNonce();
      const appendixStr = buildAppendix(params.appendixOptions || {});

      const orderStruct: OrderStruct = {
        sender,
        priceX18,
        amount: amountX18,
        expiration,
        nonce,
        appendix: BigInt(appendixStr),
      };

      const result = await defaultNadoClient.placeOrder(
        walletClient,
        address as HexString,
        orderStruct,
        params.productId
      );

      return result;
    } catch (err: any) {
      const msg = err.message || 'Failed to place order';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelOrders = async (productIds: number[], digests: HexString[]) => {
    if (!address || !walletClient) {
      throw new Error('Wallet not connected');
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const sender = buildSender(address);
      const nonce = buildTimestampNonce();

      const cancellation = {
        sender,
        productIds,
        digests,
        nonce,
      };

      const result = await defaultNadoClient.cancelOrders(
        walletClient,
        address as HexString,
        cancellation
      );

      return result;
    } catch (err: any) {
      const msg = err.message || 'Failed to cancel orders';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const withdrawCollateral = async (productId: number, amount: number | string, decimals = 18) => {
    if (!address || !walletClient) {
      throw new Error('Wallet not connected');
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const sender = buildSender(address);
      const nonce = buildTimestampNonce();
      const amountUnits = toUnits(amount, decimals);

      const withdraw = {
        sender,
        productId,
        amount: amountUnits,
        nonce,
      };

      const result = await defaultNadoClient.withdrawCollateral(
        walletClient,
        address as HexString,
        withdraw
      );

      return result;
    } catch (err: any) {
      const msg = err.message || 'Failed to withdraw collateral';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    placeOrder,
    cancelOrders,
    withdrawCollateral,
    isSubmitting,
    error,
  };
}
