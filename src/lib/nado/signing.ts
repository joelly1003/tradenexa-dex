import { HexString } from './types';
import { INK_MAINNET_CHAIN_ID } from './config';
import { genOrderVerifyingContract } from './formatters';

export const NADO_EIP712_TYPES = {
  Order: [
    { name: 'sender', type: 'bytes32' },
    { name: 'priceX18', type: 'int128' },
    { name: 'amount', type: 'int128' },
    { name: 'expiration', type: 'uint64' },
    { name: 'nonce', type: 'uint64' },
    { name: 'appendix', type: 'uint128' },
  ],
  Cancellation: [
    { name: 'sender', type: 'bytes32' },
    { name: 'productIds', type: 'uint32[]' },
    { name: 'digests', type: 'bytes32[]' },
    { name: 'nonce', type: 'uint64' },
  ],
  WithdrawCollateral: [
    { name: 'sender', type: 'bytes32' },
    { name: 'productId', type: 'uint32' },
    { name: 'amount', type: 'uint128' },
    { name: 'nonce', type: 'uint64' },
  ],
  TransferQuote: [
    { name: 'sender', type: 'bytes32' },
    { name: 'recipient', type: 'bytes32' },
    { name: 'amount', type: 'uint128' },
    { name: 'nonce', type: 'uint64' },
  ],
  LiquidateSubaccount: [
    { name: 'sender', type: 'bytes32' },
    { name: 'liquidatee', type: 'bytes32' },
    { name: 'mode', type: 'uint8' },
    { name: 'healthGroup', type: 'uint8' },
    { name: 'amount', type: 'int128' },
    { name: 'nonce', type: 'uint64' },
  ],
  MintNlp: [
    { name: 'sender', type: 'bytes32' },
    { name: 'quoteAmount', type: 'uint128' },
    { name: 'nonce', type: 'uint64' },
  ],
  BurnNlp: [
    { name: 'sender', type: 'bytes32' },
    { name: 'nlpAmount', type: 'uint128' },
    { name: 'nonce', type: 'uint64' },
  ],
  LinkSigner: [
    { name: 'sender', type: 'bytes32' },
    { name: 'signer', type: 'bytes32' },
    { name: 'nonce', type: 'uint64' },
  ],
} as const;

export function getEip712Domain(verifyingContract: HexString) {
  return {
    name: 'Nado',
    version: '0.0.1',
    chainId: INK_MAINNET_CHAIN_ID,
    verifyingContract,
  } as const;
}

export function getVerifyingContractForExecute(
  executeType: string,
  endpointAddr: HexString,
  productId?: number
): HexString {
  if (executeType === 'place_order' || executeType === 'Order') {
    if (productId === undefined) {
      throw new Error('productId is required to generate order verifying contract address');
    }
    return genOrderVerifyingContract(productId);
  }
  return endpointAddr;
}

/**
 * Converts any BigInt values in a struct object into string format
 * for JSON POST HTTP serialization over the wire.
 */
export function serializeBigIntsToStrings<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'bigint') {
      result[key] = value.toString();
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => (typeof item === 'bigint' ? item.toString() : item));
    } else if (value !== null && typeof value === 'object') {
      result[key] = serializeBigIntsToStrings(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
