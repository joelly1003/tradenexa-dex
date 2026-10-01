'use client';

import { useState, useEffect } from 'react';
import { isRestrictedJurisdiction, RESTRICTED_JURISDICTIONS } from './compliance';

export interface ProviderCorridor {
  provider: 'Transak' | 'Stripe' | 'MoonPay';
  supportedCountries: string[]; // ISO 2-letter codes or ['*']
  unsupportedCountries: string[];
}

export const PARTNER_CORRIDORS: Record<string, ProviderCorridor> = {
  Transak: {
    provider: 'Transak',
    supportedCountries: ['BR', 'IN', 'KE', 'DE', 'FR', 'ES', 'IT', 'NL', 'US', 'GB', 'CA', 'AU', 'JP', 'KR', 'MX', 'AR', 'CO', 'CL', 'PE', 'ZA', 'NG', 'GH', 'PH', 'VN', 'TH', 'ID', 'SG', 'MY', 'NZ'],
    unsupportedCountries: ['CU', 'IR', 'KP', 'SY', 'RU', 'BY', 'MM'],
  },
  Stripe: {
    provider: 'Stripe',
    supportedCountries: ['US', 'DE', 'FR', 'ES', 'IT', 'NL', 'IE', 'GB', 'BE', 'AT', 'PT', 'SE', 'FI', 'DK', 'NO', 'CH', 'PL', 'RO'],
    unsupportedCountries: ['CU', 'IR', 'KP', 'SY', 'RU', 'BY', 'MM', 'IN', 'BR', 'KE'],
  },
  MoonPay: {
    provider: 'MoonPay',
    supportedCountries: ['BR', 'US', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'CA', 'AU'],
    unsupportedCountries: ['CU', 'IR', 'KP', 'SY', 'RU', 'BY', 'MM', 'IN', 'KE'],
  },
};

// Regional rail specific country mappings
export const RAIL_ALLOWED_COUNTRIES: Record<string, string[]> = {
  PIX: ['BR'], // Brazil
  UPI: ['IN'], // India
  'M-PESA': ['KE', 'TZ', 'UG', 'RW'], // East Africa
  SEPA: ['DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'PT', 'AT', 'IE', 'FI', 'GR', 'LU', 'EE', 'LV', 'LT', 'SK', 'SI', 'CY', 'MT'],
  STRIPE: ['US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'AU'],
};

/**
 * Checks if a given country is sanctioned or completely prohibited from fiat rails.
 */
export function isCountrySanctioned(countryCode?: string | null): boolean {
  if (!countryCode) return false;
  return isRestrictedJurisdiction(countryCode);
}

/**
 * Determines whether a user in `countryCode` is supported for a specific rail.
 */
export function isRailSupportedInRegion(railId: string, countryCode?: string | null): boolean {
  if (!countryCode) return true; // Default allow if unknown to avoid false block
  const code = countryCode.toUpperCase().trim();
  if (isCountrySanctioned(code)) return false;

  const allowedList = RAIL_ALLOWED_COUNTRIES[railId.toUpperCase()];
  if (!allowedList) return true; // generic rails
  return allowedList.includes(code);
}

/**
 * React hook to screen regional availability upfront
 */
export function useGeoGuard() {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string>('Detecting location...');
  const [isRestricted, setIsRestricted] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkLocation() {
      try {
        // Fast edge check or fallback detection
        const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
        if (res.ok && active) {
          const data = await res.json();
          const code = (data.country_code || '').toUpperCase();
          const name = data.country_name || code;

          setCountryCode(code);
          setCountryName(name);

          if (isRestrictedJurisdiction(code)) {
            setIsRestricted(true);
            const reason = RESTRICTED_JURISDICTIONS[code]?.reason || 'Jurisdiction subject to regulatory restrictions.';
            setRestrictionReason(reason);
          } else {
            setIsRestricted(false);
            setRestrictionReason(null);
          }
          setIsLoading(false);
          return;
        }
      } catch {
        // Fallback: estimate from locale/timezone
        if (active) {
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          if (timeZone.includes('Tehran') || timeZone.includes('Moscow') || timeZone.includes('Pyongyang')) {
            setIsRestricted(true);
            setRestrictionReason('Jurisdiction subject to regulatory restrictions.');
          }
        }
      }

      if (active) {
        setIsLoading(false);
      }
    }

    checkLocation();

    return () => {
      active = false;
    };
  }, []);

  return {
    countryCode,
    countryName,
    isRestricted,
    restrictionReason,
    isLoading,
    isRailSupported: (railId: string) => isRailSupportedInRegion(railId, countryCode),
  };
}
