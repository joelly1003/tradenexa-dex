import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://s3.tradingview.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self' data: https:;
      connect-src 'self' https://*.inkonchain.com https://*.drpc.org https://*.alchemy.com wss://*.inkonchain.com https://*.walletconnect.com https://*.walletconnect.org https://*.web3modal.org https://*.web3modal.com https://*.reown.com wss://*.walletconnect.com wss://*.walletconnect.org https://*.transak.com https://api.stripe.com https://crypto.stripe.com https://*.moonpay.com https://cloudflare-eth.com https://api.binance.com https://data-api.binance.vision https://ipapi.co;
      frame-src 'self' https://verify.walletconnect.com https://verify.walletconnect.org https://global.transak.com https://crypto.stripe.com https://buy.moonpay.com https://challenges.cloudflare.com;
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim(),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
