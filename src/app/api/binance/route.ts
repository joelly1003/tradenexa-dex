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
        return NextResponse.json({
          lastPrice: item.lastPrice,
          priceChangePercent: (parseFloat(item.price24hPcnt) * 100).toString(),
          quoteVolume: item.turnover24h
        });
      }
    } else if (mexcSymbols.includes(symbol)) {
      const res = await fetch(`https://api.mexc.com/api/v3/ticker/24hr?symbol=${symbol}USDT`, { next: { revalidate: 3 } });
      const item = await res.json();
      if (item && item.lastPrice) {
        return NextResponse.json({
          lastPrice: item.lastPrice,
          priceChangePercent: (parseFloat(item.priceChangePercent) * 100).toString(),
          quoteVolume: item.quoteVolume
        });
      }
    }

    // Default to Binance
    const res = await fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${symbol}USDT`, {
      next: { revalidate: 3 }
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch(e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
