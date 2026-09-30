/**
 * TradeNexa Verified Token Registry
 * Follows the Uniswap Token List standard (v1.0) with risk profiling for Ink Network (Chain ID: 57073).
 */

export type TokenTag = 
  | 'native' 
  | 'stablecoin' 
  | 'verified' 
  | 'bluechip' 
  | 'meme' 
  | 'high-volatility' 
  | 'experimental' 
  | 'perpetuals';

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXPERIMENTAL' | 'RESTRICTED';

export interface TokenInfo {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  tags: TokenTag[];
  riskTier: RiskTier;
  description?: string;
  isRestricted?: boolean;
}

export interface TokenList {
  name: string;
  timestamp: string;
  version: { major: number; minor: number; patch: number };
  keywords: string[];
  tokens: TokenInfo[];
}

export const TRADENEXA_TOKEN_LIST: TokenList = {
  name: 'TradeNexa Verified Ink Token List',
  timestamp: '2026-09-30T22:00:00Z',
  version: { major: 1, minor: 2, patch: 0 },
  keywords: ['tradenexa', 'ink', 'nado', 'perps', 'l2'],
  tokens: [
    {
      chainId: 57073,
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png',
      tags: ['native', 'verified', 'bluechip'],
      riskTier: 'LOW',
      description: 'Native gas asset of Ink Network (OP Stack L2).',
      isRestricted: false,
    },
    {
      chainId: 57073,
      address: '0x2D2702154460773B4D7895e78696F638A0D97D9b',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png',
      tags: ['stablecoin', 'verified', 'bluechip'],
      riskTier: 'LOW',
      description: 'Primary cross-margin collateral asset on TradeNexa.',
      isRestricted: false,
    },
    {
      chainId: 57073,
      address: '0x1F9840a85d5aF5bf1D1762F925BDADdC4201F984',
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      decimals: 8,
      logoURI: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png',
      tags: ['verified', 'bluechip'],
      riskTier: 'LOW',
      description: 'Wrapped Bitcoin bridged to Ink Network.',
      isRestricted: false,
    },
    {
      chainId: 57073,
      address: '0x5707300000000000000000000000000000000001',
      name: 'Ink Governance Token',
      symbol: 'INK',
      decimals: 18,
      tags: ['verified', 'native'],
      riskTier: 'MEDIUM',
      description: 'Ink Network ecosystem & governance token.',
      isRestricted: false,
    },
    {
      chainId: 57073,
      address: '0x0000000000000000000000000000000000000002',
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9,
      logoURI: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png',
      tags: ['verified', 'bluechip', 'perpetuals'],
      riskTier: 'LOW',
      description: 'High-speed layer 1 asset available for perpetual trading.',
      isRestricted: false,
    },
    {
      chainId: 57073,
      address: '0x0000000000000000000000000000000000000003',
      name: 'Pepe',
      symbol: 'PEPE',
      decimals: 18,
      logoURI: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/pepe.png',
      tags: ['meme', 'high-volatility', 'perpetuals'],
      riskTier: 'HIGH',
      description: 'Community meme token with elevated price volatility.',
      isRestricted: false,
    },
    {
      chainId: 57073,
      address: '0x0000000000000000000000000000000000000004',
      name: 'Hyperliquid Perps Index',
      symbol: 'HYPE',
      decimals: 18,
      tags: ['experimental', 'high-volatility', 'perpetuals'],
      riskTier: 'EXPERIMENTAL',
      description: 'Decentralized perpetual exchange index token.',
      isRestricted: false,
    },
  ],
};

/**
 * Returns all verified tokens on the Ink Network
 */
export function getVerifiedTokens(): TokenInfo[] {
  return TRADENEXA_TOKEN_LIST.tokens.filter(t => !t.isRestricted);
}

/**
 * Finds a token by symbol (case insensitive)
 */
export function getTokenBySymbol(symbol: string): TokenInfo | undefined {
  const sym = symbol.toUpperCase().replace('-PERP', '').replace('1000', '');
  return TRADENEXA_TOKEN_LIST.tokens.find(
    t => t.symbol.toUpperCase() === sym || (sym === 'BTC' && t.symbol === 'WBTC')
  );
}

/**
 * Checks whether an asset is flagged as restricted by compliance filters
 */
export function isAssetRestricted(symbol: string): boolean {
  const token = getTokenBySymbol(symbol);
  return token ? Boolean(token.isRestricted) : false;
}

/**
 * Retrieves the risk profile and tags for a token
 */
export function getTokenRiskProfile(symbol: string): {
  tier: RiskTier;
  tags: TokenTag[];
  isExperimental: boolean;
  isHighVolatility: boolean;
} {
  const token = getTokenBySymbol(symbol);
  if (!token) {
    return {
      tier: 'MEDIUM',
      tags: ['perpetuals'],
      isExperimental: false,
      isHighVolatility: false,
    };
  }

  return {
    tier: token.riskTier,
    tags: token.tags,
    isExperimental: token.tags.includes('experimental'),
    isHighVolatility: token.tags.includes('high-volatility'),
  };
}
