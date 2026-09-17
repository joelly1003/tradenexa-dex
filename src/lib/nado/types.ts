export type HexString = `0x${string}`;

// EIP-712 Struct Types (Native BigInts for Viem Signing)
export interface OrderStruct {
  sender: HexString;
  priceX18: bigint;
  amount: bigint;
  expiration: bigint;
  nonce: bigint;
  appendix: bigint;
}

export interface CancellationStruct {
  sender: HexString;
  productIds: number[];
  digests: HexString[];
  nonce: bigint;
}

export interface ProductCancellationStruct {
  sender: HexString;
  productIds: number[];
  nonce: bigint;
}

export interface WithdrawCollateralStruct {
  sender: HexString;
  productId: number;
  amount: bigint;
  nonce: bigint;
}

export interface TransferQuoteStruct {
  sender: HexString;
  recipient: HexString;
  amount: bigint;
  nonce: bigint;
}

export interface LiquidateSubaccountStruct {
  sender: HexString;
  liquidatee: HexString;
  mode: number;
  healthGroup: number;
  amount: bigint;
  nonce: bigint;
}

export interface MintNlpStruct {
  sender: HexString;
  quoteAmount: bigint;
  nonce: bigint;
}

export interface BurnNlpStruct {
  sender: HexString;
  nlpAmount: bigint;
  nonce: bigint;
}

export interface LinkSignerStruct {
  sender: HexString;
  signer: HexString;
  nonce: bigint;
}

// Wire Format Struct Types (Serialized string numbers for JSON POST)
export interface SerializedOrderStruct {
  sender: string;
  priceX18: string;
  amount: string;
  expiration: string;
  nonce: string;
  appendix: string;
}

// Response Wrapper
export interface NadoApiResponse<T = any> {
  status: 'success' | 'failure';
  error?: string;
  code?: number;
  data?: T;
}

// Contracts Query Response
export interface NadoContractsInfo {
  endpoint_addr: HexString;
  clearinghouse_addr: HexString;
  quote_token_addr: HexString;
  nlp_token_addr: HexString;
}

// Edge Queries
export interface CachedPriceItem {
  product_id: number;
  symbol: string;
  price_x18: string;
  bid_x18: string;
  ask_x18: string;
  change_24h_percent: string;
  volume_24h_x18: string;
  timestamp: number;
}

export interface CachedBboHistoryItem {
  timestamp: number;
  bid_x18: string;
  ask_x18: string;
  price_x18: string;
}

// Query Payload & Requests
export type NadoQueryPayload =
  | { type: 'cached_prices'; product_ids?: number[] }
  | { type: 'cached_symbols' }
  | { type: 'cached_bbo_history'; product_id: number; granularity?: number; limit?: number }
  | { type: 'ping' }
  | { type: 'contracts' }
  | { type: 'subaccount_info'; subaccount: string }
  | { type: 'isolated_positions'; subaccount: string }
  | { type: 'max_order_size'; subaccount: string; product_id: number; price_x18: string; side: 'buy' | 'sell' }
  | { type: 'max_withdrawable'; subaccount: string; product_id: number }
  | { type: 'max_nlp_mintable'; subaccount: string }
  | { type: 'max_nlp_burnable'; subaccount: string }
  | { type: 'nlp_locked_balances'; subaccount: string }
  | { type: 'nlp_pool_info' }
  | { type: 'fee_rates'; subaccount: string }
  | { type: 'nonces'; subaccount: string };

// Appendix options interface
export interface AppendixOptions {
  version?: number;
  isolated?: boolean;
  orderType?: 'DEFAULT' | 'IOC' | 'FOK' | 'POST_ONLY';
  reduceOnly?: boolean;
}
