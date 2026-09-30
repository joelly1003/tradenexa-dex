import { NextRequest, NextResponse } from 'next/server';
import { isAddress, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { isSanctionedAddress, isRestrictedJurisdiction, getJurisdictionPolicy } from '../../../../lib/compliance';

// Chainalysis Sanctions Oracle Contract on Ethereum Mainnet
const CHAINALYSIS_ORACLE_ADDRESS = '0x40C57923924B5c5c5455c48D93317139ADDaC8fb';

const SANCTIONS_ORACLE_ABI = [
  {
    name: 'isSanctioned',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'addr', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

// Create lightweight public client for oracle queries
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://cloudflare-eth.com', {
    timeout: 3500,
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    // 1. Validate EVM address format
    if (!address || typeof address !== 'string' || !isAddress(address)) {
      return NextResponse.json(
        {
          allowed: false,
          reason: 'Invalid or missing EVM address format.',
          timestamp: Date.now(),
          oracleChecked: false,
        },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();

    // 2. Extract edge geolocation signal
    const country = (
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-tradenexa-country') ||
      ''
    ).toUpperCase();

    // Check jurisdiction sanctions
    if (country && isRestrictedJurisdiction(country)) {
      const policy = getJurisdictionPolicy(country);
      return NextResponse.json({
        allowed: false,
        address: normalizedAddress,
        reason: `Connection originates from a restricted jurisdiction (${policy.countryName}): ${policy.reason || 'International Sanctions'}.`,
        timestamp: Date.now(),
        oracleChecked: false,
        country,
      });
    }

    // 3. Fast In-Memory OFAC SDN List Check
    if (isSanctionedAddress(normalizedAddress)) {
      return NextResponse.json({
        allowed: false,
        address: normalizedAddress,
        reason: 'Address matches OFAC Specially Designated Nationals (SDN) registry.',
        timestamp: Date.now(),
        oracleChecked: false,
        source: 'ofac-sdn-registry',
      });
    }

    // 4. Authoritative Chainalysis On-Chain Oracle Verification
    let oracleSanctioned = false;
    let oracleChecked = false;

    try {
      const result = await publicClient.readContract({
        address: CHAINALYSIS_ORACLE_ADDRESS,
        abi: SANCTIONS_ORACLE_ABI,
        functionName: 'isSanctioned',
        args: [address as `0x${string}`],
      });

      oracleSanctioned = Boolean(result);
      oracleChecked = true;
    } catch (oracleErr) {
      // Fallback gracefully without breaking trade flow if RPC times out
      console.warn('Chainalysis oracle query timed out, falling back to local registry:', oracleErr);
    }

    if (oracleSanctioned) {
      return NextResponse.json({
        allowed: false,
        address: normalizedAddress,
        reason: 'Address flagged as sanctioned by Chainalysis On-Chain Oracle (0x40C5...C8fb).',
        timestamp: Date.now(),
        oracleChecked: true,
        source: 'chainalysis-on-chain-oracle',
      });
    }

    // 5. Address is cleared
    return NextResponse.json({
      allowed: true,
      address: normalizedAddress,
      reason: null,
      timestamp: Date.now(),
      oracleChecked,
      source: oracleChecked ? 'chainalysis-oracle-verified' : 'local-sdn-verified',
    });
  } catch (error: unknown) {
    console.error('Compliance screening route error:', error);
    return NextResponse.json(
      {
        allowed: false,
        reason: 'Server error during compliance verification.',
        timestamp: Date.now(),
        oracleChecked: false,
      },
      { status: 500 }
    );
  }
}
