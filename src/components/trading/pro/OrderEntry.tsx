'use client';

import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useTradeExecution } from '../../../hooks/useTradeExecution';
import { useNadoEdgeTicker } from '../../../hooks/nado/useNadoEdgeTicker';
import { Settings2, ArrowRightLeft, ChevronDown, Check, Info, X, CreditCard, AlertTriangle, RefreshCw } from 'lucide-react';
import { useCurrencyStore, formatFiat } from '../../../store/currencyStore';
import { getTokenRiskProfile } from '../../../lib/tokens';

interface NadoTickerItem {
  symbol: string;
  price_x18: string;
  product_id: number;
}

export function OrderEntry({ symbol = 'BTC', livePrice }: { symbol?: string; livePrice?: number | null }) {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { open } = useAppKit();
  const {
    executeTrade,
    isSubmitting,
    isQuoting,
    quoteTimeLeft,
    isQuoteExpired,
    isLiquidityAvailable,
    slippageTolerance,
    setSlippageTolerance,
    isSlippageBreached,
    priceImpact,
    usePrivateLane,
    setUsePrivateLane,
    privateLaneFailed,
    error: tradeError,
    successDigest,
    refreshQuote,
    retryWithStandardRoute,
    resetError,
  } = useTradeExecution();
  const { data: tickers } = useNadoEdgeTicker();

  const symUpper = symbol.toUpperCase() === 'KPEPE' ? 'PEPE' : symbol.toUpperCase();
  const perpSymbol = `${symUpper}-PERP`;
  
  const currentAsset = (tickers as NadoTickerItem[] | undefined)?.find(
    (t) => t.symbol === perpSymbol || t.symbol === symUpper
  ) || (tickers as NadoTickerItem[] | undefined)?.find((t) => t.symbol.startsWith(symUpper));
    
  const currentPrice = (livePrice && livePrice > 0)
    ? livePrice
    : (currentAsset ? parseFloat(currentAsset.price_x18) / 1e18 : 0);
  const productId = currentAsset ? currentAsset.product_id : 1;
  const availableMargin = balanceData ? parseFloat(balanceData.formatted) : 0;
  const { fiat } = useCurrencyStore();
  const tokenRisk = getTokenRiskProfile(symUpper);

  // Local State
  const [marginMode, setMarginMode] = useState('Cross');
  const [leverage, setLeverage] = useState(50);
  const [isLong, setIsLong] = useState(true);
  const [orderType, setOrderType] = useState('Market');

  const [payAmount, setPayAmount] = useState('');
  const [sizeAmount, setSizeAmount] = useState('');
  const [isSizeInUSD, setIsSizeInUSD] = useState(false);
  const [limitPrice, setLimitPrice] = useState('');

  const [reduceOnly, setReduceOnly] = useState(false);
  const [tpSl, setTpSl] = useState(false);
  const [tpPrice, setTpPrice] = useState('');
  const [slPrice, setSlPrice] = useState('');
  
  const [slippage, setSlippage] = useState('0.5');
  const [showSlippageModal, setShowSlippageModal] = useState(false);
  const [customSlippage, setCustomSlippage] = useState('');

  const tradePrice = orderType === 'Limit' || orderType === 'Stop / Trigger' ? (parseFloat(limitPrice) || currentPrice) : currentPrice;
  
  // Handlers for sync between Pay and Size
  const handlePayChange = (val: string) => {
    setPayAmount(val);
    const pay = parseFloat(val) || 0;
    const nominalUsd = pay * leverage;
    if (isSizeInUSD) {
       setSizeAmount(nominalUsd > 0 ? nominalUsd.toFixed(2) : '');
    } else {
       setSizeAmount(nominalUsd > 0 && tradePrice > 0 ? (nominalUsd / tradePrice).toFixed(5) : '');
    }
  };

  const handleSizeChange = (val: string) => {
    setSizeAmount(val);
    const size = parseFloat(val) || 0;
    const nominalUsd = isSizeInUSD ? size : size * tradePrice;
    const pay = nominalUsd > 0 ? (nominalUsd / leverage) : 0;
    setPayAmount(pay > 0 ? pay.toFixed(4) : '');
  };

  const setMaxPay = () => {
    handlePayChange((availableMargin * 0.99).toString()); // leaving tiny room for gas if needed
  };

  // When leverage changes, keep Size fixed and update Pay (or vice-versa depending on standard UX, here we update Pay to maintain position size)
  const handleLeverageChange = (newLev: number) => {
    setLeverage(newLev);
    const size = parseFloat(sizeAmount) || 0;
    if (size > 0) {
      const nominalUsd = isSizeInUSD ? size : size * tradePrice;
      const pay = nominalUsd / newLev;
      setPayAmount(pay.toFixed(4));
    }
  };

  // Slider value for Pay amount relative to available margin
  const payNum = parseFloat(payAmount) || 0;
  const sliderVal = availableMargin > 0 ? Math.min(100, Math.max(0, (payNum / availableMargin) * 100)) : 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.target.value);
    const newPay = (availableMargin * (pct / 100)).toString();
    handlePayChange(newPay);
  };

  const toggleSizeAsset = () => {
    const size = parseFloat(sizeAmount) || 0;
    if (isSizeInUSD) {
      // USD -> Token
      setSizeAmount(size > 0 && tradePrice > 0 ? (size / tradePrice).toFixed(5) : '');
    } else {
      // Token -> USD
      setSizeAmount(size > 0 ? (size * tradePrice).toFixed(2) : '');
    }
    setIsSizeInUSD(!isSizeInUSD);
  };

  const handlePlaceOrder = async () => {
    const finalSize = parseFloat(sizeAmount) || 0;
    if (finalSize === 0) return;
    
    const finalTokenAmount = isSizeInUSD && tradePrice > 0 ? finalSize / tradePrice : finalSize;

    try {
      await executeTrade({
        productId,
        symbol: symUpper,
        price: tradePrice,
        amount: isLong ? finalTokenAmount : -finalTokenAmount,
        isLong,
        orderType,
        marginMode,
        leverage,
      });
    } catch (e: unknown) {
      console.error('Nado order execution error:', e);
    }
  };

  // Calculated Order Data
  const sizeNum = parseFloat(sizeAmount) || 0;
  const nominalUsd = isSizeInUSD ? sizeNum : sizeNum * tradePrice;
  const takerFee = nominalUsd * 0.0005; // 0.05% taker fee mock
  const estLiqPrice = tradePrice > 0 ? (isLong ? tradePrice * (1 - 0.9 / leverage) : tradePrice * (1 + 0.9 / leverage)) : 0;

  // Button States
  let buttonText = 'Connect Wallet to Trade';
  let buttonAction: () => void = () => open();
  let buttonClass = 'bg-[#1e293b] hover:bg-[#334155] text-white'; // Disabled/Disconnected default

  if (isConnected) {
    if (isSubmitting) {
      buttonText = 'Signing & Submitting Intent...';
      buttonAction = () => {};
      buttonClass = 'bg-[#B1FA41]/10 text-[#B1FA41] cursor-wait animate-pulse border border-[#B1FA41]/30';
    } else if (isQuoteExpired || !isLiquidityAvailable) {
      buttonText = 'Refresh Quote to Trade';
      buttonAction = refreshQuote;
      buttonClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30';
    } else if (payNum === 0 || sizeNum === 0) {
      buttonText = 'Enter Margin';
      buttonAction = () => {};
      buttonClass = 'bg-[#1e293b] text-zinc-500 cursor-not-allowed';
    } else {
      buttonText = `Open ${isLong ? 'Long' : 'Short'} ${symUpper}`;
      buttonAction = handlePlaceOrder;
      buttonClass = isLong 
        ? 'bg-[#22C55E] hover:bg-[#16a34a] text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 transition-all'
        : 'bg-[#EF4444] hover:bg-[#dc2626] text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 transition-all';
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0B0E14] border-l border-white/10 p-4 text-white shrink-0 font-sans w-full min-w-[340px] max-w-[380px] overflow-y-auto custom-scrollbar">
      
      {/* 1. Header & Routing */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={marginMode}
              onChange={(e) => setMarginMode(e.target.value)}
              className="px-3 py-1.5 bg-[#121824] hover:bg-[#1a2332] rounded border border-white/10 text-xs font-semibold transition-colors flex items-center appearance-none pr-8 outline-none cursor-pointer text-white"
            >
              <option value="Cross">Cross</option>
              <option value="Isolated">Isolated</option>
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tokenRisk.isHighVolatility && (
            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded text-[9px] font-bold uppercase tracking-wider">
              Volatile
            </span>
          )}
          {tokenRisk.isExperimental && (
            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded text-[9px] font-bold uppercase tracking-wider">
              Experimental
            </span>
          )}
          <div className="px-2 py-1 bg-[#B1FA41]/10 border border-[#B1FA41]/20 rounded text-[10px] font-mono text-[#B1FA41] flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B1FA41] animate-pulse" />
            RPC Online
          </div>
          <button
            onClick={refreshQuote}
            title="Refresh Solver Quote (10s window)"
            className={`px-2 py-1 border rounded text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
              isQuoteExpired
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <RefreshCw className={`w-2.5 h-2.5 ${isQuoting ? 'animate-spin' : ''}`} />
            <span>{isQuoteExpired ? 'Expired' : `${quoteTimeLeft}s`}</span>
          </button>
        </div>
      </div>

      {/* 2. Direction Controls */}
      <div className="flex p-1 bg-white/5 rounded-lg mb-4">
        <button 
          onClick={() => setIsLong(true)}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLong ? 'bg-[#22C55E] text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          Long
        </button>
        <button 
          onClick={() => setIsLong(false)}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLong ? 'bg-[#EF4444] text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          Short
        </button>
      </div>

      {/* 3. Order Type Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-0 mb-5">
        {['Market', 'Limit', 'Stop / Trigger'].map(tab => (
          <button 
            key={tab}
            onClick={() => setOrderType(tab)}
            className={`text-sm font-medium pb-2 transition-all relative ${orderType === tab ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            {tab}
            {orderType === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-t-sm" />}
          </button>
        ))}
      </div>

      {/* Conditional Limit Price */}
      {(orderType === 'Limit' || orderType === 'Stop / Trigger') && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
            <span>{orderType === 'Limit' ? 'Limit Price' : 'Trigger Price'}</span>
          </div>
          <div className="bg-[#121824] border border-white/10 focus-within:border-white/30 rounded-lg p-2.5 flex items-center justify-between transition-colors">
            <input 
              type="number" 
              placeholder={currentPrice.toFixed(2)}
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="bg-transparent text-white font-mono outline-none w-full text-sm placeholder:text-zinc-600" 
            />
            <span className="text-zinc-500 text-xs font-bold pl-2">USD</span>
          </div>
        </div>
      )}

      {/* 4. Input 1: Margin (Pay) */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
          <span>Pay (Margin)</span>
          <div className="flex items-center gap-1.5">
            <span>Avail: ${availableMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <button onClick={setMaxPay} className="text-[9px] bg-white/10 hover:bg-white/20 text-white px-1.5 py-0.5 rounded transition-colors font-bold">MAX</button>
          </div>
        </div>
        <div className="bg-[#121824] border border-white/10 focus-within:border-white/30 rounded-lg p-2.5 flex items-center justify-between transition-colors relative">
          <input 
            type="number" 
            placeholder="0.00" 
            value={payAmount}
            onChange={(e) => handlePayChange(e.target.value)}
            className="bg-transparent text-white font-mono outline-none w-full text-base placeholder:text-zinc-700" 
          />
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
            <img src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png" alt="USDC" className="w-4 h-4 rounded-full" />
            <span className="text-white text-xs font-bold">USDC</span>
          </div>
        </div>
        
        {/* Slider inside Pay section for quick margin allocation */}
        <div className="mt-4 px-1">
          <input 
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={handleSliderChange}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-[#B1FA41] transition-all"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>


      </div>

      {/* 5. Input 2: Position Size */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
          <span>Position Size</span>
          <span className="text-zinc-500 font-mono">
            ~${nominalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="bg-[#121824] border border-white/10 focus-within:border-white/30 rounded-lg p-2.5 flex items-center justify-between transition-colors">
          <input 
            type="number" 
            placeholder="0.0000" 
            value={sizeAmount}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="bg-transparent text-white font-mono outline-none w-full text-base placeholder:text-zinc-700" 
          />
          <button 
            onClick={toggleSizeAsset}
            className="flex items-center gap-1 text-xs font-bold text-zinc-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
          >
            {isSizeInUSD ? 'USD' : symUpper}
            <ArrowRightLeft className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>

      {/* 6. Leverage Control */}
      <div className="mb-6 bg-white/5 rounded-lg p-3 border border-white/5">
        <div className="flex justify-between text-xs text-zinc-400 mb-3 items-center">
          <span>Leverage</span>
          <div className="bg-[#121824] px-2 py-1 rounded border border-white/10 text-white font-bold text-xs flex items-center gap-1 cursor-pointer">
            {leverage}x
          </div>
        </div>
        <input 
          type="range"
          min="1"
          max="100"
          value={leverage}
          onChange={(e) => handleLeverageChange(Number(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#B1FA41] transition-all"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
          <span onClick={() => handleLeverageChange(2)} className="cursor-pointer hover:text-white">2x</span>
          <span onClick={() => handleLeverageChange(10)} className="cursor-pointer hover:text-white">10x</span>
          <span onClick={() => handleLeverageChange(25)} className="cursor-pointer hover:text-white">25x</span>
          <span onClick={() => handleLeverageChange(50)} className="cursor-pointer hover:text-white">50x</span>
          <span onClick={() => handleLeverageChange(100)} className="cursor-pointer hover:text-white">100x</span>
        </div>
      </div>

      {/* 7. Advanced Order Options */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors font-medium">
          <div className={`w-4 h-4 rounded flex items-center justify-center border ${reduceOnly ? 'bg-white border-white text-black' : 'bg-transparent border-zinc-600'}`}>
            {reduceOnly && <Check className="w-3 h-3" />}
          </div>
          <input type="checkbox" checked={reduceOnly} onChange={e => setReduceOnly(e.target.checked)} className="hidden" />
          Reduce Only
        </label>
        
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors font-medium">
            <div className={`w-4 h-4 rounded flex items-center justify-center border ${tpSl ? 'bg-white border-white text-black' : 'bg-transparent border-zinc-600'}`}>
              {tpSl && <Check className="w-3 h-3" />}
            </div>
            <input type="checkbox" checked={tpSl} onChange={e => setTpSl(e.target.checked)} className="hidden" />
            TP / SL
          </label>

          {tpSl && (
            <div className="pl-6 space-y-3 pt-1 border-l border-white/10 ml-2">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Take Profit</span>
                  {tpPrice && <span className="text-green-500">Est. PnL: +{(((parseFloat(tpPrice) - tradePrice) / tradePrice) * leverage * 100 * (isLong ? 1 : -1)).toFixed(2)}%</span>}
                </div>
                <div className="bg-[#121824] border border-white/10 focus-within:border-green-500/50 rounded flex items-center p-1.5">
                  <input type="number" placeholder="Target Price" value={tpPrice} onChange={e => setTpPrice(e.target.value)} className="bg-transparent text-white font-mono outline-none w-full text-xs pl-1" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Stop Loss</span>
                  {slPrice && <span className="text-red-500">Est. PnL: {(((parseFloat(slPrice) - tradePrice) / tradePrice) * leverage * 100 * (isLong ? 1 : -1)).toFixed(2)}%</span>}
                </div>
                <div className="bg-[#121824] border border-white/10 focus-within:border-red-500/50 rounded flex items-center p-1.5">
                  <input type="number" placeholder="Trigger Price" value={slPrice} onChange={e => setSlPrice(e.target.value)} className="bg-transparent text-white font-mono outline-none w-full text-xs pl-1" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 8. Summary & Risk Data Card */}
      <div className="bg-white/5 rounded-lg p-3 space-y-2 text-[11px] font-sans mb-5 border border-white/5">
        <div className="flex justify-between items-center text-zinc-400">
          <span>Execution Route</span>
          <span className="font-mono text-[10px] text-[#B1FA41] bg-[#B1FA41]/10 px-2 py-0.5 rounded border border-[#B1FA41]/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B1FA41] animate-pulse" />
            NADO Solver → Ink L2 (57073)
          </span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span>Notional Total</span>
          <span className="font-mono text-white">${nominalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        {/* Oracle Equivalent Tooltip */}
        <div className="flex justify-between items-center text-zinc-400">
          <div className="flex items-center gap-1">
            <span>Est. Value ({fiat})</span>
            <div className="relative group/oracle cursor-help">
              <Info className="w-3 h-3 text-zinc-500 hover:text-[#B1FA41] transition-colors" />
              <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover/oracle:flex flex-col w-64 p-2.5 bg-[#121824] border border-white/10 rounded-xl text-[10px] text-zinc-300 shadow-2xl z-30 pointer-events-none">
                <span className="font-bold text-white mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B1FA41]" />
                  Live Oracle Reference Feed
                </span>
                <span className="text-zinc-400 leading-tight">
                  Fiat values are estimates based on live oracle reference rates (Chainlink / Pyth benchmarks). Actual execution occurs in crypto/stablecoins on Ink Network.
                </span>
              </div>
            </div>
          </div>
          <span className="font-mono text-[#B1FA41] font-semibold">{formatFiat(nominalUsd, fiat)}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span>Est. Execution Price</span>
          <span className="font-mono text-white">${tradePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span>Est. Liq. Price</span>
          <span className={`font-mono ${payNum > 0 ? 'text-orange-400' : 'text-zinc-600'}`}>
            {payNum > 0 ? `~${estLiqPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
          </span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span>Est. Taker Fee</span>
          <span className="font-mono text-white">${takerFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
        </div>

        {/* Slippage Row & Interactive Toggle */}
        <div className="mt-2 pt-2 border-t border-white/5">
          <div 
            onClick={() => setShowSlippageModal(!showSlippageModal)}
            className="flex justify-between items-center text-zinc-400 cursor-pointer hover:text-white transition-colors"
          >
            <div className="flex items-center gap-1">
              <span>Slippage Tolerance</span>
              <Settings2 className="w-3 h-3 text-zinc-400" />
            </div>
            <span className="font-mono text-white font-bold bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
              {slippage}%
            </span>
          </div>

          {/* Interactive Slippage Configuration Panel */}
          {showSlippageModal && (
            <div className="mt-2.5 p-2.5 bg-[#121824] border border-white/10 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span className="font-semibold text-white">Slippage Tolerance</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSlippageModal(false); }}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {['0.1', '0.5', '1.0'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlippage(val);
                      setCustomSlippage('');
                    }}
                    className={`py-1 rounded text-[10px] font-mono font-bold transition-all ${
                      slippage === val && !customSlippage
                        ? 'bg-[#B1FA41] text-black'
                        : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Custom"
                    value={customSlippage}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomSlippage(val);
                      if (val && parseFloat(val) > 0) {
                        setSlippage(val);
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#B1FA41]/50 rounded px-1.5 py-1 text-[10px] font-mono text-white placeholder:text-zinc-600 outline-none text-center"
                  />
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-[9px] text-zinc-500 leading-tight pt-1 border-t border-white/5">
                <Info className="w-3 h-3 text-[#B1FA41] shrink-0 mt-0.5" />
                <span>
                  Orders are routed through NADO&apos;s off-chain solver and settled on Ink L2. Dynamic slippage protection minimizes MEV impact.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slippage Breach Warning */}
      {isSlippageBreached && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-3 text-xs text-amber-200">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Slippage Tolerance Exceeded</span>
          </div>
          <p className="text-[11px] text-amber-200/80 mb-2">
            Price impact exceeds slippage tolerance. Update slippage to proceed.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSlippageTolerance(1.0);
                setSlippage('1.0');
                resetError();
              }}
              className="bg-amber-500 text-black px-2.5 py-1 rounded font-bold text-[10px] hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Set Slippage to 1.0%
            </button>
            <button
              onClick={resetError}
              className="bg-white/5 text-zinc-300 px-2.5 py-1 rounded text-[10px] hover:bg-white/10 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Private MEV lane failover prompt */}
      {privateLaneFailed && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 mb-3 text-xs text-purple-200">
          <p className="mb-2 text-[11px]">Private MEV lane unavailable. Retry with standard fallback route?</p>
          <button
            onClick={retryWithStandardRoute}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-1.5 rounded text-xs transition-all cursor-pointer"
          >
            Retry via Standard Route
          </button>
        </div>
      )}

      {/* Quote Expired / Liquidity Exhaustion Alert */}
      {isQuoteExpired && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 mb-3 text-xs flex items-center justify-between gap-2">
          <span className="text-amber-200 text-[11px]">Solver liquidity unavailable for this size. Adjust amount or refresh quote.</span>
          <button
            onClick={refreshQuote}
            className="bg-amber-500 text-black px-2.5 py-1 rounded text-[10px] font-bold shrink-0 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>
      )}

      {/* 9. Primary Action Button */}
      <button 
        onClick={buttonAction}
        disabled={isSubmitting || (isConnected && (payNum === 0 || sizeNum === 0))}
        className={`w-full font-bold py-3.5 rounded-lg mb-2 text-sm transition-all cursor-pointer ${buttonClass}`}
      >
        {buttonText}
      </button>

      {/* Actionable Error State with Inline Retry */}
      {tradeError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl mb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-red-200">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Execution Notice</span>
            </div>
            <button
              onClick={resetError}
              className="text-red-400 hover:text-white shrink-0 text-sm font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-red-200/90">{tradeError}</p>
          {tradeError.includes('Signature declined') && (
            <button
              onClick={handlePlaceOrder}
              className="mt-2 w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 font-bold py-1.5 rounded text-[11px] transition-all cursor-pointer border border-red-500/30"
            >
              Retry Signature in Wallet
            </button>
          )}
          {tradeError.includes('expired') && (
            <button
              onClick={refreshQuote}
              className="mt-2 w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold py-1.5 rounded text-[11px] transition-all cursor-pointer border border-amber-500/30"
            >
              Refresh Quote Now
            </button>
          )}
        </div>
      )}

      {/* Success Confirmation Card */}
      {successDigest && (
        <div className="bg-[#B1FA41]/10 border border-[#B1FA41]/30 text-[#B1FA41] text-xs p-3 rounded-xl mb-3">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-white">
            <Check className="w-4 h-4 text-[#B1FA41]" />
            <span>Order Intent Submitted!</span>
          </div>
          <p className="text-[11px] text-zinc-300 mb-2">
            Cryptographically signed and matched by NADO solvers on Ink Network.
          </p>
          <a
            href={`https://explorer.inkonchain.com/tx/${successDigest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] underline hover:text-white font-mono text-[#B1FA41]"
          >
            <span>View on Ink Explorer</span>
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}
