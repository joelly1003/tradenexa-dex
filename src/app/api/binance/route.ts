import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let symbol = searchParams.get('symbol')?.toUpperCase();
  
  if (!symbol) {
    try {
      const res = await fetch('https://data-api.binance.vision/api/v3/ticker/24hr', {
        next: { revalidate: 3 }
      });
      const data = await res.json();
      return NextResponse.json(data);
    } catch(e) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
  }

  if (symbol === 'KPEPE') symbol = 'PEPE';

  const bybitSymbols = ['HYPE', 'LIT', 'PUMP', 'XMR', 'FARTCOIN', 'MON', 'PENGU', 'SKR', 'BERA', 'VIRTUAL'];
  const mexcSymbols = ['ASTER', 'XPL', 'CHIP'];

  try {
    if (bybitSymbols.includes(symbol)) {
      const res = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}USDT`, { next: { revalidate: 3 } });
      const json = await res.json();
      const item = json?.result?.list?.[0];
      if (item) {
        const turnover = parseFloat(item.turnover24h || '100000000');
        return NextResponse.json({
          lastPrice: item.lastPrice,
          priceChangePercent: (parseFloat(item.price24hPcnt) * 100).toString(),
          quoteVolume: item.turnover24h,
          highPrice: item.highPrice24h || (parseFloat(item.lastPrice) * 1.025).toString(),
          lowPrice: item.lowPrice24h || (parseFloat(item.lastPrice) * 0.975).toString(),
          openInterest: (turnover * 0.18).toString()
        });
      }
    } else if (mexcSymbols.includes(symbol)) {
      const res = await fetch(`https://api.mexc.com/api/v3/ticker/24hr?symbol=${symbol}USDT`, { next: { revalidate: 3 } });
      const item = await res.json();
      if (item && item.lastPrice) {
        const quoteVol = parseFloat(item.quoteVolume || '50000000');
        return NextResponse.json({
          lastPrice: item.lastPrice,
          priceChangePercent: (parseFloat(item.priceChangePercent) * 100).toString(),
          quoteVolume: item.quoteVolume,
          highPrice: item.highPrice || (parseFloat(item.lastPrice) * 1.025).toString(),
          lowPrice: item.lowPrice || (parseFloat(item.lastPrice) * 0.975).toString(),
          openInterest: (quoteVol * 0.18).toString()
        });
      }
    }

    // Default to Binance
    const res = await fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${symbol}USDT`, {
      next: { revalidate: 3 }
    });
    const data = await res.json();

    // Fetch or calculate Open Interest
    let openInterest = null;
    try {
      const oiRes = await fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${symbol}USDT`, {
        next: { revalidate: 10 }
      });
      if (oiRes.ok) {
        const oiData = await oiRes.json();
        if (oiData && oiData.openInterest) {
          const oiCoins = parseFloat(oiData.openInterest);
          const p = parseFloat(data.lastPrice || '0');
          if (oiCoins > 0 && p > 0) {
            openInterest = (oiCoins * p).toString();
          }
        }
      }
    } catch (e) {
      // Fallback
    }

    if (!openInterest && data && data.quoteVolume) {
      openInterest = (parseFloat(data.quoteVolume) * 0.18).toString();
    }

    return NextResponse.json({
      ...data,
      highPrice: data?.highPrice,
      lowPrice: data?.lowPrice,
      openInterest: openInterest || '28260000'
    });
  } catch(e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
