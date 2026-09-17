export const INK_MAINNET_CHAIN_ID = 763373;

export interface GatewayEndpoints {
  queryUrl: string;
  executeUrl: string;
  edgeQueryUrl: string;
  wsV2Url: string;
  wsSubscribeUrl: string;
}

export const NADO_GATEWAY_CONFIG: {
  mainnet: GatewayEndpoints;
  testnet: GatewayEndpoints;
  defaultHeaders: Record<string, string>;
} = {
  mainnet: {
    queryUrl: 'https://api.prod.nado.xyz/gateway/v1/query',
    executeUrl: 'https://api.prod.nado.xyz/gateway/v1/execute',
    edgeQueryUrl: 'https://api.prod.nado.xyz/gateway/v1/edge/query',
    wsV2Url: 'wss://api.prod.nado.xyz/gateway/ws/v2',
    wsSubscribeUrl: 'wss://api.prod.nado.xyz/gateway/v1/subscribe',
  },
  testnet: {
    queryUrl: 'https://api.test.nado.xyz/gateway/v1/query',
    executeUrl: 'https://api.test.nado.xyz/gateway/v1/execute',
    edgeQueryUrl: 'https://api.test.nado.xyz/gateway/v1/edge/query',
    wsV2Url: 'wss://api.test.nado.xyz/gateway/ws/v2',
    wsSubscribeUrl: 'wss://api.test.nado.xyz/gateway/v1/subscribe',
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, br, deflate',
  },
};

export const DEFAULT_SUBACCOUNT_SUFFIX = '64656661756c740000000000';
