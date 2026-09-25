'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useNadoTrade } from '../../../hooks/nado/useNadoTrade';
import { useNadoEdgeTicker } from '../../../hooks/nado/useNadoEdgeTicker';
import { Settings2, ArrowRightLeft, ChevronDown, Check } from 'lucide-react';

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
    
    // In a real app we'd convert USD size back to token size if needed
    const finalTokenAmount = isSizeInUSD && tradePrice > 0 ? finalSize / tradePrice : finalSize;

    try {
      await placeOrder({
        productId: productId,
        price: tradePrice,
        amount: finalTokenAmount,
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

  // Calculated Order Data
  const sizeNum = parseFloat(sizeAmount) || 0;
  const nominalUsd = isSizeInUSD ? sizeNum : sizeNum * tradePrice;
  const nominalToken = isSizeInUSD && tradePrice > 0 ? sizeNum / tradePrice : sizeNum;
  const takerFee = nominalUsd * 0.0005; // 0.05% taker fee mock
  const estLiqPrice = tradePrice > 0 ? (isLong ? tradePrice * (1 - 0.9 / leverage) : tradePrice * (1 + 0.9 / leverage)) : 0;

  // Button States
  let buttonText = 'Connect Wallet';
  let buttonAction: () => void = () => open();
  let buttonClass = 'bg-[#1e293b] hover:bg-[#334155] text-white'; // Disabled/Disconnected default

  if (isConnected) {
    if (isSubmitting) {
      buttonText = 'Submitting...';
      buttonAction = () => {};
      buttonClass = 'bg-[#B1FA41]/10 text-[#B1FA41] cursor-wait animate-pulse border border-[#B1FA41]/30';
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
        <div className="px-2 py-1 bg-[#B1FA41]/10 border border-[#B1FA41]/20 rounded text-[10px] font-mono text-[#B1FA41] flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B1FA41] animate-pulse" />
          RPC Online
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
            {leverage}x <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>
        </div>
        <input 
          type="range"
          min="1"
          max="100"
          value={leverage}
          onChange={(e) => handleLeverageChange(Number(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white transition-all"
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
          <span>Notional Total</span>
          <span className="font-mono text-white">${nominalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
        <div className="flex justify-between items-center text-zinc-400 mt-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-200">
            Slippage <Settings2 className="w-3 h-3" />
          </div>
          <span className="font-mono text-white">{slippage}%</span>
        </div>
      </div>

      {/* 9. Primary Action Button */}
      <button 
        onClick={buttonAction}
        disabled={isSubmitting || (isConnected && (payNum === 0 || sizeNum === 0))}
        className={`w-full font-bold py-3.5 rounded-lg mb-2 text-sm ${buttonClass}`}
      >
        {buttonText}
      </button>

      {tradeError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-2 rounded mb-2 break-words">
          {tradeError}
        </div>
      )}
    </div>
  );
}
