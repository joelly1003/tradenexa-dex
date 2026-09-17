import { NADO_GATEWAY_CONFIG, GatewayEndpoints } from './config';
import {
  NadoQueryPayload,
  NadoApiResponse,
  HexString,
  OrderStruct,
  CancellationStruct,
  WithdrawCollateralStruct,
  TransferQuoteStruct,
  LiquidateSubaccountStruct,
  MintNlpStruct,
  BurnNlpStruct,
  LinkSignerStruct,
  NadoContractsInfo,
} from './types';
import {
  NADO_EIP712_TYPES,
  getEip712Domain,
  getVerifyingContractForExecute,
  serializeBigIntsToStrings,
} from './signing';

export class NadoClient {
  private endpoints: GatewayEndpoints;
  private headers: Record<string, string>;
  private contractsCache: NadoContractsInfo | null = null;

  constructor(isTestnet = false) {
    this.endpoints = isTestnet ? NADO_GATEWAY_CONFIG.testnet : NADO_GATEWAY_CONFIG.mainnet;
    this.headers = NADO_GATEWAY_CONFIG.defaultHeaders;
  }

  /**
   * Edge Cached Query (12,000 wt/min allowance)
   * High-throughput in-memory gateway edge reads for tickers and sparklines.
   */
  async edgeQuery<T = any>(payload: NadoQueryPayload): Promise<T> {
    const res = await fetch(this.endpoints.edgeQueryUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Edge Query HTTP error: ${res.status} ${res.statusText}`);
    }

    const json: NadoApiResponse<T> = await res.json();
    if (json.status === 'failure') {
      throw new Error(`Edge Query Failed [code ${json.code}]: ${json.error || 'Unknown error'}`);
    }

    return json.data !== undefined ? json.data : (json as unknown as T);
  }

  /**
   * Authoritative Engine Query
   * Direct reads against the matching engine for health, balances, sizing, and nonces.
   */
  async query<T = any>(payload: NadoQueryPayload): Promise<T> {
    const res = await fetch(this.endpoints.queryUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Query HTTP error: ${res.status} ${res.statusText}`);
    }

    const json: NadoApiResponse<T> = await res.json();
    if (json.status === 'failure') {
      throw new Error(`Query Failed [code ${json.code}]: ${json.error || 'Unknown error'}`);
    }

    return json.data !== undefined ? json.data : (json as unknown as T);
  }

  /**
   * Fetches contracts info and caches endpoint_addr for typed signing.
   */
  async getContractsInfo(): Promise<NadoContractsInfo> {
    if (this.contractsCache) return this.contractsCache;
    const contracts = await this.query<NadoContractsInfo>({ type: 'contracts' });
    this.contractsCache = contracts;
    return contracts;
  }

  /**
   * Low-level Execute Dispatcher
   */
  private async dispatchExecute(executeType: string, signature: HexString, txData: any): Promise<any> {
    const payload = {
      type: executeType,
      tx: serializeBigIntsToStrings(txData),
      signature,
    };

    const res = await fetch(this.endpoints.executeUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Execute HTTP error: ${res.status} ${res.statusText}`);
    }

    const json: NadoApiResponse = await res.json();
    if (json.status === 'failure') {
      throw new Error(`Execute Failed [${executeType}] [code ${json.code}]: ${json.error || 'Unknown error'}`);
    }

    return json.data !== undefined ? json.data : json;
  }

  // ==========================================
  // ALL 10 SIGNED EXECUTE OPERATIONS
  // ==========================================

  /** 1. placeOrder */
  async placeOrder(
    walletClient: any,
    accountAddress: HexString,
    order: OrderStruct,
    productId: number
  ): Promise<any> {
    const verifyingContract = getVerifyingContractForExecute('place_order', '0x0', productId);
    const domain = getEip712Domain(verifyingContract);

    const signature = await walletClient.signTypedData({
      account: accountAddress,
      domain,
      types: { Order: NADO_EIP712_TYPES.Order },
      primaryType: 'Order',
      message: order,
    });

    return this.dispatchExecute('place_order', signature, order);
  }

  /** 2. cancelOrders */
  async cancelOrders(
    walletClient: any,
    accountAddress: HexString,
    cancellation: CancellationStruct
  ): Promise<any> {
    const contracts = await this.getContractsInfo();
    const domain = getEip712Domain(contracts.endpoint_addr);

    const signature = await walletClient.signTypedData({
      account: accountAddress,
      domain,
      types: { Cancellation: NADO_EIP712_TYPES.Cancellation },
      primaryType: 'Cancellation',
      message: cancellation,
    });

    return this.dispatchExecute('cancel_orders', signature, cancellation);
  }

  /** 3. cancelProductOrders (Mass cancellation) */
  async cancelProductOrders(
    walletClient: any,
    accountAddress: HexString,
    cancellation: CancellationStruct
  ): Promise<any> {
    const contracts = await this.getContractsInfo();
    const domain = getEip712Domain(contracts.endpoint_addr);

    const signature = await walletClient.signTypedData({
      account: accountAddress,
      domain,
      types: { Cancellation: NADO_EIP712_TYPES.Cancellation },
      primaryType: 'Cancellation',
      message: cancellation,
    });

    return this.dispatchExecute('cancel_product_orders', signature, cancellation);
  }

  /** 4. cancelAndPlace (Atomic cancel & replace) */
  async cancelAndPlace(
    walletClient: any,
    accountAddress: HexString,
    cancelData: CancellationStruct,
    placeOrderData: OrderStruct,
    productId: number
  ): Promise<any> {
    const contracts = await this.getContractsInfo();

    const cancelDomain = getEip712Domain(contracts.endpoint_addr);
    const cancelSig = await walletClient.signTypedData({
      account: accountAddress,
      domain: cancelDomain,
      types: { Cancellation: NADO_EIP712_TYPES.Cancellation },
      primaryType: 'Cancellation',
      message: cancelData,
    });

    const orderVerifyingContract = getVerifyingContractForExecute('place_order', '0x0', productId);
    const orderDomain = getEip712Domain(orderVerifyingContract);
    const orderSig = await walletClient.signTypedData({
      account: accountAddress,
      domain: orderDomain,
      types: { Order: NADO_EIP712_TYPES.Order },
      primaryType: 'Order',
      message: placeOrderData,
    });

    const payload = {
      type: 'cancel_and_place',
      cancel_tx: serializeBigIntsToStrings(cancelData),
      cancel_signature: cancelSig,
      place_tx: serializeBigIntsToStrings(placeOrderData),
      place_signature: orderSig,
    };

    const res = await fetch(this.endpoints.executeUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`CancelAndPlace HTTP error: ${res.status}`);
    }

    const json: NadoApiResponse = await res.json();
    if (json.status === 'failure') {
      throw new Error(`CancelAndPlace Failed: ${json.error}`);
    }

    return json.data;
  }

  /** 5. withdrawCollateral */
  async withdrawCollateral(
    walletClient: any,
    accountAddress: HexString,
    withdraw: WithdrawCollateralStruct
  ): Promise<any> {
    const contracts = await this.getContractsInfo();
    const domain = getEip712Domain(contracts.endpoint_addr);

    const signature = await walletClient.signTypedData({
      account: accountAddress,
      domain,
      types: { WithdrawCollateral: NADO_EIP712_TYPES.WithdrawCollateral },
      primaryType: 'WithdrawCollateral',
      message: withdraw,
    });

    return this.dispatchExecute('withdraw_collateral', signature, withdraw);
  }

  /** 6. withdrawCollateralV2 */
  async withdrawCollateralV2(
    walletClient: any,
    accountAddress: HexString,
    withdraw: WithdrawCollateralStruct
  ): Promise<any> {
    const contracts = await this.getContractsInfo();
    const domain = getEip712Domain(contracts.endpoint_addr);

    const signature = await walletClient.signTypedData({
      account: accountAddress,
      domain,
      types: { WithdrawCollateral: NADO_EIP712_TYPES.WithdrawCollateral },
      primaryType: 'WithdrawCollateral',
      message: withdraw,
    });

    return this.dispatchExecute('withdraw_collateral_v2', signature, withdraw);
  }

  /** 7. transferQuote */
  async transferQuote(
    walletClient: any,
    accountAddress: HexString,
    transfer: TransferQuoteStruct
  ): Promise<any> {
    const contracts = await this.getContractsInfo();
    const domain = getEip712Domain(contracts.endpoint_addr);

    const signature = await walletClient.signTypedData({
      account: accountAddress,
      domain,
      types: { TransferQuote: NADO_EIP712_TYPES.TransferQuote },
      primaryType: 'TransferQuote',
      message: transfer,
    });

    return this.dispatchExecute('transfer_quote', signature, transfer);
  }

  /** 8. liquidateSubaccount */
  async liquidateSubaccount(
    walletClient: any,
    accountAddress: HexString,
    liquidate: LiquidateSubaccountStruct
  ): Promise<any> {
    const contracts = await this.getContractsInfo();
    const domain = getEip712Domain(contracts.endpoint_addr);

    const signature = await walletClient.signTypedData({
      account: accountAddress,
      domain,
      types: { LiquidateSubaccount: NADO_EIP712_TYPES.LiquidateSubaccount },
      primaryType: 'LiquidateSubaccount',
      message: liquidate,
    });

    return this.dispatchExecute('liquidate_subaccount', signature, liquidate);
  }

  /** 9. mintNlp & burnNlp */
  async mintNlp(
    walletClient: any,
    accountAddress: HexString,
    mint: MintNlpStruct
  ): Promise<any> {
    const contracts = await this.getContractsInfo();
    const domain = getEip712Domain(contracts.endpoint_addr);

    const signature = await walletClient.signTypedData({
      account: accountAddress,
      domain,
      types: { MintNlp: NADO_EIP712_TYPES.MintNlp },
      primaryType: 'MintNlp',
      message: mint,
    });

    return this.dispatchExecute('mint_nlp', signature, mint);
  }

  async burnNlp(
    walletClient: any,
    accountAddress: HexString,
    burn: BurnNlpStruct
  ): Promise<any> {
    const contracts = await this.getContractsInfo();
    const domain = getEip712Domain(contracts.endpoint_addr);

    const signature = await walletClient.signTypedData({
      account: accountAddress,
      domain,
      types: { BurnNlp: NADO_EIP712_TYPES.BurnNlp },
      primaryType: 'BurnNlp',
      message: burn,
    });

    return this.dispatchExecute('burn_nlp', signature, burn);
  }

  /** 10. linkSigner */
  async linkSigner(
    walletClient: any,
    accountAddress: HexString,
    link: LinkSignerStruct
  ): Promise<any> {
    const contracts = await this.getContractsInfo();
    const domain = getEip712Domain(contracts.endpoint_addr);

    const signature = await walletClient.signTypedData({
      account: accountAddress,
      domain,
      types: { LinkSigner: NADO_EIP712_TYPES.LinkSigner },
      primaryType: 'LinkSigner',
      message: link,
    });

    return this.dispatchExecute('link_signer', signature, link);
  }
}

/**
 * WebSocket v2 Concurrent Client
 * Interactive /ws/v2 client supporting out-of-order dispatch with Promise-based id correlation.
 */
export class NadoWsClient {
  private ws: WebSocket | null = null;
  private url: string;
  private nextId = 1;
  private pendingRequests = new Map<number, { resolve: (val: any) => void; reject: (err: any) => void }>();
  private subscriptions = new Map<string, (data: any) => void>();

  constructor(isTestnet = false) {
    this.url = isTestnet ? NADO_GATEWAY_CONFIG.testnet.wsV2Url : NADO_GATEWAY_CONFIG.mainnet.wsV2Url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.id && this.pendingRequests.has(data.id)) {
              const { resolve, reject } = this.pendingRequests.get(data.id)!;
              this.pendingRequests.delete(data.id);
              if (data.status === 'failure') {
                reject(new Error(data.error || 'WS Request Failed'));
              } else {
                resolve(data.data || data);
              }
            } else if (data.stream && this.subscriptions.has(data.stream)) {
              this.subscriptions.get(data.stream)!(data.data || data);
            }
          } catch (e) {
            console.error('Nado WebSocket message parse error:', e);
          }
        };

        this.ws.onerror = (err) => {
          reject(err);
        };

        this.ws.onclose = () => {
          this.pendingRequests.forEach(({ reject }) => reject(new Error('WebSocket closed')));
          this.pendingRequests.clear();
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  async sendRequest<T = any>(method: string, params: any = {}): Promise<T> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    const id = this.nextId++;
    const payload = { id, method, ...params };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.ws!.send(JSON.stringify(payload));
    });
  }

  subscribe(stream: string, callback: (data: any) => void) {
    this.subscriptions.set(stream, callback);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ method: 'subscribe', stream }));
    }
  }

  unsubscribe(stream: string) {
    this.subscriptions.delete(stream);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ method: 'unsubscribe', stream }));
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const defaultNadoClient = new NadoClient(false);
