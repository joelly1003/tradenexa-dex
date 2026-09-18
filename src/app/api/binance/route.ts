import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  
  if (!symbol) {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
        next: { revalidate: 3 }
      });
      const data = await res.json();
      return NextResponse.json(data);
    } catch(e) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
  }

  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`, {
      next: { revalidate: 3 }
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch(e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
