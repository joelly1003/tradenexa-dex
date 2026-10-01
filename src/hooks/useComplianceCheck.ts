'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { detectUserJurisdiction } from '../lib/compliance';

export type RestrictionType = 'SANCTIONED_ADDRESS' | 'SANCTIONED_JURISDICTION' | null;

export interface ComplianceState {
  isChecking: boolean;
  isBlocked: boolean;
  restrictionType: RestrictionType;
  details: string | null;
  countryName: string;
  countryCode: string;
  showModal: boolean;
  oracleChecked: boolean;
  dismissModal: () => void;
  recheck: () => Promise<void>;
}

export function useComplianceCheck(): ComplianceState {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isChecking, setIsChecking] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [restrictionType, setRestrictionType] = useState<RestrictionType>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [oracleChecked, setOracleChecked] = useState<boolean>(false);

  const evaluateCompliance = useCallback(async (activeWallet?: string): Promise<void> => {
    setIsChecking(true);

    // 1. If wallet address is connected, screen via the Serverless API Route
    if (activeWallet) {
      try {
        const res = await fetch('/api/compliance/screen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: activeWallet }),
        });

        if (res.ok) {
          const data = await res.json();
          setOracleChecked(true);

          if (data.sanctioned) {
            disconnect();
            setIsBlocked(true);
            setRestrictionType('SANCTIONED_ADDRESS');
            setDetails('This address has been flagged by automated risk and sanctions screening. Protocol interaction is disabled.');
            setShowModal(true);
            setIsChecking(false);
            return;
          }
        }
      } catch (apiErr) {
        console.warn('Backend compliance verification warning:', apiErr);
      }
    }

    // 2. Multi-layer browser-level fallback geofencing check
    try {
      const geo = await detectUserJurisdiction();
      setCountryCode(geo.countryCode);
      setCountryName(geo.countryName);

      if (geo.isRestricted) {
        setIsBlocked(true);
        setRestrictionType('SANCTIONED_JURISDICTION');
        setDetails(
          `Connection originated from ${geo.countryName} (${geo.countryCode}), which is subject to international financial sanctions (${geo.reason || 'Restricted Jurisdiction'}).`
        );
        setShowModal(true);
      } else {
        setIsBlocked(false);
        setRestrictionType(null);
        setDetails(null);
      }
    } catch (err) {
      console.warn('Compliance jurisdiction check warning:', err);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!active) return;
      await evaluateCompliance(address);
    };

    run();

    return () => {
      active = false;
    };
  }, [address, evaluateCompliance]);

  const dismissModal = () => {
    setShowModal(false);
  };

  return {
    isChecking,
    isBlocked,
    restrictionType,
    details,
    countryName,
    countryCode,
    showModal,
    oracleChecked,
    dismissModal,
    recheck: () => evaluateCompliance(address),
  };
}
