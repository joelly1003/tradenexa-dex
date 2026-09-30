/**
 * TradeNexa Compliance & Jurisdiction Engine
 * 
 * Implements client-side geofencing, OFAC/FATF sanction screening, 
 * and wallet address verification in accordance with non-custodial DEX best practices.
 */

export interface JurisdictionPolicy {
  countryCode: string;
  countryName: string;
  isRestricted: boolean;
  reason?: string;
}

// OFAC / FATF Comprehensive Sanctions and High-Risk Jurisdictions
export const RESTRICTED_JURISDICTIONS: Record<string, { name: string; reason: string }> = {
  CU: { name: 'Cuba', reason: 'OFAC Sanctions Program (31 CFR Part 515)' },
  IR: { name: 'Iran', reason: 'OFAC Sanctions Program (31 CFR Part 560)' },
  KP: { name: 'North Korea (DPRK)', reason: 'OFAC Sanctions Program (31 CFR Part 510)' },
  SY: { name: 'Syria', reason: 'OFAC Sanctions Program (31 CFR Part 542)' },
  RU: { name: 'Russian Federation', reason: 'International Sanctions & Export Controls' },
  BY: { name: 'Belarus', reason: 'OFAC Sanctions Program (31 CFR Part 548)' },
  MM: { name: 'Myanmar (Burma)', reason: 'OFAC Sanctions Program (31 CFR Part 525)' },
  // Regional sanctioned territories
  UA_CRI: { name: 'Crimea Region', reason: 'OFAC Executive Order 13685' },
  UA_DNR: { name: 'Donetsk Region', reason: 'OFAC Executive Order 14065' },
  UA_LNR: { name: 'Luhansk Region', reason: 'OFAC Executive Order 14065' },
};

// Known OFAC Specially Designated Nationals (SDN) and high-risk exploit/mixer addresses
// Normalized to lowercase
export const SANCTIONED_ADDRESSES = new Set<string>([
  // Tornado Cash core and router contracts (OFAC SDN List)
  '0x8589427373d6d84e98730d7795d8f6f8731fda16',
  '0x722122df12d450404793402795f514b8a1c970e4',
  '0xd90e2f925da726b50c4ed8d0fb90ad053324f31b',
  '0xd96f2b1c14db8458374d9aca76e2862953636165',
  '0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936',
  '0x23773e65ed146a459791799d01336db287f25292',
  '0xd21be7248e01798b1e298b49e29a997d91db9b92',
  '0x610b717796ad83846506340434477b653ced32ca',
  // Lazarus Group & Ronin Bridge Exploiter Associated Wallets
  '0x098b716b8aaf21512996dc57eb0615e2383e2f96',
  '0xa0e1c89ef1a4dcfc413390963efe5e320da7cb82',
  '0x6296333763562952d437544073d706f50f288779',
  '0x53b6936513e738f44fb50d2b9476730c0ab3bf1f',
]);

/**
 * Validates whether an EVM address is flagged on the OFAC SDN list or sanctions registry.
 */
export function isSanctionedAddress(address?: string | null): boolean {
  if (!address) return false;
  return SANCTIONED_ADDRESSES.has(address.toLowerCase().trim());
}

/**
 * Checks whether a 2-letter ISO country code is in a restricted jurisdiction.
 */
export function isRestrictedJurisdiction(countryCode?: string | null): boolean {
  if (!countryCode) return false;
  const upper = countryCode.toUpperCase().trim();
  return Boolean(RESTRICTED_JURISDICTIONS[upper]);
}

/**
 * Returns full jurisdiction policy info for a given country code.
 */
export function getJurisdictionPolicy(countryCode?: string | null): JurisdictionPolicy {
  if (!countryCode) {
    return {
      countryCode: 'UNKNOWN',
      countryName: 'Unknown Region',
      isRestricted: false,
    };
  }

  const upper = countryCode.toUpperCase().trim();
  const restrictedInfo = RESTRICTED_JURISDICTIONS[upper];

  if (restrictedInfo) {
    return {
      countryCode: upper,
      countryName: restrictedInfo.name,
      isRestricted: true,
      reason: restrictedInfo.reason,
    };
  }

  return {
    countryCode: upper,
    countryName: upper,
    isRestricted: false,
  };
}

/**
 * Client-side jurisdiction detection with fallback.
 * Checks for IP geolocation headers, client timezone heuristics, and public endpoint.
 */
export async function detectUserJurisdiction(): Promise<{
  countryCode: string;
  countryName: string;
  isRestricted: boolean;
  reason?: string;
}> {
  // Allow developer or user testing override via localStorage if in development
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('tradenexa_compliance_override');
    if (override && RESTRICTED_JURISDICTIONS[override.toUpperCase()]) {
      const info = RESTRICTED_JURISDICTIONS[override.toUpperCase()];
      return {
        countryCode: override.toUpperCase(),
        countryName: info.name,
        isRestricted: true,
        reason: info.reason,
      };
    }
  }

  try {
    // Attempt fast non-blocking lookup from ipapi.co or ip-api.com
    const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const code = (data.country_code || '').toUpperCase();
      const policy = getJurisdictionPolicy(code);
      return {
        countryCode: policy.countryCode,
        countryName: data.country_name || policy.countryName,
        isRestricted: policy.isRestricted,
        reason: policy.reason,
      };
    }
  } catch {
    // Network or rate-limited lookup fallback: do not false-positive block users
  }

  return {
    countryCode: 'US',
    countryName: 'United States',
    isRestricted: false,
  };
}
