'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useNadoTrade } from '../../../hooks/nado/useNadoTrade';
import { useNadoEdgeTicker } from '../../../hooks/nado/useNadoEdgeTicker';

export function OrderEntry({ symbol = 'BTC' }: { symbol?: string }) {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { open } = useAppKit();
  const { placeOrder, isSubmitting, error: tradeError } = useNadoTrade();
  const { data: tickers } = useNadoEdgeTicker();

  const symUpper = symbol.toUpperCase() === 'KPEPE' ? 'PEPE' : symbol.toUpperCase();
  const perpSymbol = `${symUpper}-PERP`;
  
  const currentAsset = (tickers || []).find(t => t.symbol === perpSymbol || t.symbol === symUpper) || 
    (tickers || []).find(t => t.symbol.startsWith(symUpper));
    
  const currentPrice = currentAsset ? parseFloat(currentAsset.price_x18) / 1e18 : 0;
  const productId = currentAsset ? currentAsset.product_id : 1;

  const availableMargin = balanceData ? parseFloat(balanceData.formatted) : 0;

  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [sliderVal, setSliderVal] = useState(0);
  const [marginMode, setMarginMode] = useState('Cross');
  const [leverage, setLeverage] = useState(50);
  const [orderType, setOrderType] = useState('Market');

  const [reduceOnly, setReduceOnly] = useState(false);
  const [tpSl, setTpSl] = useState(false);
  
  // Real math for max size
  const tradePrice = orderType === 'Limit' || orderType === 'Advanced' ? (parseFloat(limitPrice) || currentPrice) : currentPrice;
  const maxPositionSize = tradePrice > 0 ? (availableMargin * leverage) / tradePrice : 0;

  const handlePlaceOrder = async () => {
    if (!amount || parseFloat(amount) === 0) return;
    try {
      await placeOrder({
        productId: productId,
        price: tradePrice,
        amount: parseFloat(amount),
        appendixOptions: {
          isolated: marginMode === 'Isolated',
          reduceOnly,
          orderType: orderType === 'Limit' ? 'POST_ONLY' : 'DEFAULT',
        },
      });
      alert('Order successfully signed via EIP-712 and submitted to Nado Gateway!');
    } catch (e: any) {
      console.error('Nado order placement error:', e);
    }
  };

  // Determine button text and action
  let buttonText = 'Connect Wallet to Trade';
  let buttonAction: () => void = () => open();
  let buttonStyle = 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]';

  if (isConnected) {
    if (isSubmitting) {
      buttonText = 'Signing EIP-712 & Submitting...';
      buttonAction = () => {};
      buttonStyle = 'bg-zinc-800 text-blue-400 cursor-wait animate-pulse border border-blue-900/50';
    } else if (!amount || parseFloat(amount) === 0) {
      buttonText = 'Enter Trade Size';
      buttonAction = () => {};
      buttonStyle = 'bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800';
    } else {
      buttonText = `Place ${symbol} ${orderType} Order`;
      buttonAction = handlePlaceOrder;
      buttonStyle = 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]';
    }
  }

  // Calculate Value and Cost
  const parsedAmount = parseFloat(amount) || 0;
  const orderValue = parsedAmount * tradePrice;
  const orderCost = orderValue / leverage;
  const liqPrice = tradePrice > 0 ? tradePrice * 0.98 : 0; // rough mock liq price

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] p-4 text-white shrink-0">
      {/* Margin / Leverage row */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <select 
            value={marginMode}
            onChange={e => setMarginMode(e.target.value)}
            className="w-full bg-zinc-900 hover:bg-zinc-800 py-1.5 rounded text-sm font-semibold transition-colors border border-zinc-800 appearance-none text-center outline-none cursor-pointer"
          >
            <option value="Cross">Cross</option>
            <option value="Isolated">Isolated</option>
          </select>
        </div>
        <div className="flex-1 relative">
          <select 
            value={leverage}
            onChange={e => {
              const newLev = Number(e.target.value);
              setLeverage(newLev);
              // adjust amount if it exceeds new max
              const newMax = tradePrice > 0 ? (availableMargin * newLev) / tradePrice : 0;
              if (parsedAmount > newMax) {
                setAmount(newMax.toFixed(5));
                setSliderVal(100);
              } else {
                setSliderVal(newMax > 0 ? (parsedAmount / newMax) * 100 : 0);
              }
            }}
            className="w-full bg-zinc-900 hover:bg-zinc-800 py-1.5 rounded text-sm font-semibold transition-colors border border-zinc-800 appearance-none text-center outline-none cursor-pointer"
          >
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={5}>5x</option>
            <option value={10}>10x</option>
            <option value={20}>20x</option>
            <option value={50}>50x</option>
            <option value={100}>100x</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 pointer-events-none">▼</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-zinc-800 pb-2 mb-4 text-sm font-semibold">
        {['Market', 'Limit', 'Advanced'].map(tab => (
          <button 
            key={tab}
            onClick={() => setOrderType(tab)}
            className={`transition-colors ${orderType === tab ? 'text-white border-b-2 border-white pb-2 -mb-[9px]' : 'text-zinc-500 hover:text-white pb-2'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs text-zinc-400 mb-2 font-sans">
        <span>Available Margin</span>
        <span className="text-white font-mono">${availableMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div className="flex justify-between text-xs text-zinc-400 mb-6 font-sans">
        <span>Position</span>
        <span className="text-white font-mono">0.00000 {symbol}</span>
      </div>

      {/* Limit Price field (Shown for Limit and Advanced) */}
      {(orderType === 'Limit' || orderType === 'Advanced') && (
        <div className="bg-zinc-900/50 rounded p-2 flex items-center justify-between mb-3 border border-zinc-800 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 focus-within:shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all">
          <span className="text-zinc-500 text-sm pl-2">Limit Price</span>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder={currentPrice > 0 ? currentPrice.toString() : "0.00"}
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="bg-transparent text-right text-white font-mono outline-none w-24 text-sm placeholder:text-zinc-700" 
            />
            <span className="text-zinc-500 text-sm font-bold w-12 text-right">USD</span>
          </div>
        </div>
      )}

      {/* Trigger Price field (Shown for Advanced) */}
      {orderType === 'Advanced' && (
        <div className="bg-zinc-900/50 rounded p-2 flex items-center justify-between mb-3 border border-zinc-800 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 focus-within:shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all">
          <span className="text-zinc-500 text-sm pl-2">Trigger Price</span>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder={currentPrice > 0 ? currentPrice.toString() : "0.00"}
              className="bg-transparent text-right text-white font-mono outline-none w-24 text-sm placeholder:text-zinc-700" 
            />
            <span className="text-zinc-500 text-sm font-bold w-12 text-right">USD</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-zinc-900/50 rounded p-2 flex items-center justify-between mb-4 border border-zinc-800 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 focus-within:shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all">
        <span className="text-zinc-500 text-sm pl-2">Size</span>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="0.00000" 
            value={amount}
            onChange={(e) => {
              const val = Number(e.target.value || 0);
              setAmount(e.target.value);
              setSliderVal(maxPositionSize > 0 ? Math.min(100, Math.max(0, (val / maxPositionSize) * 100)) : 0);
            }}
            className="bg-transparent text-right text-white font-mono outline-none w-24 text-sm placeholder:text-zinc-700" 
          />
          <span className="text-zinc-500 text-sm font-bold w-12 text-right">{symbol} ⇌</span>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-6 px-1 relative">
        <input 
          type="range"
          min="0"
          max="100"
          value={sliderVal}
          onChange={(e) => {
            const v = Number(e.target.value);
            setSliderVal(v);
            if (maxPositionSize > 0) {
              setAmount((maxPositionSize * (v / 100)).toFixed(5));
            }
          }}
          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-all"
        />
        
        <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono font-bold">
          <span>{Math.round(sliderVal)}%</span>
          <span>Max {maxPositionSize.toFixed(4)}</span>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors font-medium">
          <input 
            type="checkbox" 
            checked={reduceOnly}
            onChange={e => setReduceOnly(e.target.checked)}
            className="rounded bg-zinc-900 border-zinc-700 text-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" 
          />
          Reduce Only
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors font-medium">
            <input 
              type="checkbox" 
              checked={tpSl}
              onChange={e => setTpSl(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" 
            />
            TP/SL
          </label>

          {/* Conditional TP/SL Inputs */}
          {tpSl && (
            <div className="pl-6 space-y-2 pt-1">
              <div className="bg-zinc-900/80 rounded p-2 flex items-center justify-between border border-zinc-800 focus-within:border-green-500 transition-colors">
                <span className="text-zinc-500 text-xs">Take Profit</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-transparent text-right text-white font-mono outline-none w-20 text-xs placeholder:text-zinc-700" 
                  />
                  <span className="text-zinc-500 text-xs font-bold">USD</span>
                </div>
              </div>

              <div className="bg-zinc-900/80 rounded p-2 flex items-center justify-between border border-zinc-800 focus-within:border-red-500 transition-colors">
                <span className="text-zinc-500 text-xs">Stop Loss</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-transparent text-right text-white font-mono outline-none w-20 text-xs placeholder:text-zinc-700" 
                  />
                  <span className="text-zinc-500 text-xs font-bold">USD</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={buttonAction}
        className={`w-full font-bold py-3 rounded mb-2 transition-colors ${buttonStyle}`}
      >
        {buttonText}
      </button>

      {tradeError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-2 rounded mb-4 break-words">
          Error: {tradeError}
        </div>
      )}

      <div className="space-y-2 text-xs text-zinc-500 mt-auto font-sans pt-2">
        <div className="flex justify-between">
          <span>Value</span>
          <span className="font-mono text-white">${orderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span>Cost</span>
          <span className="font-mono text-white">${orderCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span>Liq. Price</span>
          <span className="font-mono">~${liqPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
