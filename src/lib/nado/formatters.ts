import { HexString, AppendixOptions } from './types';
import { DEFAULT_SUBACCOUNT_SUFFIX } from './config';

/**
 * 1. buildSender: 32-byte hex string combining 20-byte EVM address (lowercased)
 * and 12-byte zero-padded subaccount name.
 */
export function buildSender(address: string, subaccountName = 'default'): HexString {
  const cleanAddr = address.toLowerCase().replace(/^0x/, '');
  let suffix = DEFAULT_SUBACCOUNT_SUFFIX;
  if (subaccountName !== 'default') {
    let hexName = '';
    for (let i = 0; i < subaccountName.length; i++) {
      hexName += subaccountName.charCodeAt(i).toString(16);
    }
    suffix = hexName.padEnd(24, '0').slice(0, 24);
  }
  return `0x${cleanAddr}${suffix}` as HexString;
}

/**
 * 2. buildSignerField:
 * - 20-byte address + 12 zero bytes for active signers (32 bytes).
 * - 32 zero bytes for revocations.
 */
export function buildSignerField(signerAddress?: string): HexString {
  if (!signerAddress || signerAddress === '0x' || /^0x0+$/.test(signerAddress)) {
    return '0x0000000000000000000000000000000000000000000000000000000000000000' as HexString;
  }
  const clean = signerAddress.toLowerCase().replace(/^0x/, '');
  return `0x${clean}${'0'.repeat(24)}` as HexString;
}

/**
 * 3. genOrderVerifyingContract:
 * Encodes productId as a 20-byte big-endian hex address
 * e.g. product 1 -> 0x0000000000000000000000000000000000000001
 */
export function genOrderVerifyingContract(productId: number): HexString {
  const hex = productId.toString(16).padStart(40, '0');
  return `0x${hex}` as HexString;
}

/**
 * 4. buildTimestampNonce:
 * Fast trading nonce: ((BigInt(Date.now()) + 50n) << 20n) + BigInt(Math.floor(Math.random() * 1048575))
 */
export function buildTimestampNonce(): bigint {
  const timestampOffset = BigInt(Date.now()) + BigInt(50);
  const randomPart = BigInt(Math.floor(Math.random() * 1048575));
  return (timestampOffset << BigInt(20)) + randomPart;
}

/**
 * 5. buildAppendix:
 * Packs flags into a uint128 bitfield string:
 * - bit 8 = isolated
 * - bits 9-10 = orderType (DEFAULT=0, IOC=1, FOK=2, POST_ONLY=3)
 * - bit 11 = reduce-only
 */
export function buildAppendix(options: AppendixOptions = {}): string {
  const { version = 0, isolated = false, orderType = 'DEFAULT', reduceOnly = false } = options;
  let bitfield = BigInt(version) & BigInt(0xff);

  if (isolated) {
    bitfield |= BigInt(1) << BigInt(8);
  }

  let typeVal = BigInt(0);
  if (orderType === 'IOC') typeVal = BigInt(1);
  else if (orderType === 'FOK') typeVal = BigInt(2);
  else if (orderType === 'POST_ONLY') typeVal = BigInt(3);
  bitfield |= (typeVal & BigInt(0x3)) << BigInt(9);

  if (reduceOnly) {
    bitfield |= BigInt(1) << BigInt(11);
  }

  return bitfield.toString();
}

/**
 * 6. Decimal conversion utilities: toX18, fromX18, and ERC-20 decimal scalers
 */
export function toX18(val: number | string): bigint {
  const num = typeof val === 'number' ? val.toString() : val;
  const parts = num.split('.');
  let integerPart = parts[0] || '0';
  let decimalPart = parts[1] || '';

  if (decimalPart.length > 18) {
    decimalPart = decimalPart.slice(0, 18);
  } else {
    decimalPart = decimalPart.padEnd(18, '0');
  }

  const sign = integerPart.startsWith('-') ? BigInt(-1) : BigInt(1);
  if (sign === BigInt(-1)) {
    integerPart = integerPart.slice(1);
  }

  const combined = BigInt(integerPart + decimalPart);
  return sign * combined;
}

export function fromX18(val: bigint | string): number {
  const bigVal = typeof val === 'string' ? BigInt(val) : val;
  const isNegative = bigVal < BigInt(0);
  const absVal = isNegative ? -bigVal : bigVal;

  const str = absVal.toString().padStart(19, '0');
  const integerPart = str.slice(0, str.length - 18);
  const decimalPart = str.slice(str.length - 18);

  const floatStr = `${isNegative ? '-' : ''}${integerPart}.${decimalPart}`;
  return parseFloat(floatStr);
}

export function toUnits(val: number | string, decimals: number): bigint {
  const num = typeof val === 'number' ? val.toString() : val;
  const parts = num.split('.');
  let integerPart = parts[0] || '0';
  let decimalPart = parts[1] || '';

  if (decimalPart.length > decimals) {
    decimalPart = decimalPart.slice(0, decimals);
  } else {
    decimalPart = decimalPart.padEnd(decimals, '0');
  }

  const sign = integerPart.startsWith('-') ? BigInt(-1) : BigInt(1);
  if (sign === BigInt(-1)) {
    integerPart = integerPart.slice(1);
  }

  return sign * BigInt(integerPart + decimalPart);
}

export function fromUnits(val: bigint | string, decimals: number): number {
  const bigVal = typeof val === 'string' ? BigInt(val) : val;
  const isNegative = bigVal < BigInt(0);
  const absVal = isNegative ? -bigVal : bigVal;

  const str = absVal.toString().padStart(decimals + 1, '0');
  const integerPart = str.slice(0, str.length - decimals);
  const decimalPart = str.slice(str.length - decimals);

  const floatStr = `${isNegative ? '-' : ''}${integerPart}.${decimalPart}`;
  return parseFloat(floatStr);
}
