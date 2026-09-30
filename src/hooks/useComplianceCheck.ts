'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { 
  isSanctionedAddress, 
  detectUserJurisdiction 
} from '../lib/compliance';

export type RestrictionType = 'SANCTIONED_ADDRESS' | 'SANCTIONED_JURISDICTION' | null;

export interface ComplianceState {
  isChecking: boolean;
  isBlocked: boolean;
  restrictionType: RestrictionType;
  details: string | null;
  countryName: string;
  countryCode: string;
  showModal: boolean;
  dismissModal: () => void;
  recheck: () => Promise<void>;
}

export function useComplianceCheck(): ComplianceState {
  const { address } = useAccount();
  const [isChecking, setIsChecking] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [restrictionType, setRestrictionType] = useState<RestrictionType>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const executeComplianceEvaluation = useCallback(async () => {
    setIsChecking(true);

    if (address && isSanctionedAddress(address)) {
      setIsBlocked(true);
      setRestrictionType('SANCTIONED_ADDRESS');
      setDetails(`Connected wallet address ${address.slice(0, 8)}... is flagged on the OFAC Specially Designated Nationals (SDN) registry.`);
      setShowModal(true);
      setIsChecking(false);
      return;
    }

    try {
      const geo = await detectUserJurisdiction();
      setCountryCode(geo.countryCode);
      setCountryName(geo.countryName);

      if (geo.isRestricted) {
        setIsBlocked(true);
        setRestrictionType('SANCTIONED_JURISDICTION');
        setDetails(`Connection originated from ${geo.countryName} (${geo.countryCode}), which is subject to international financial sanctions (${geo.reason || 'Restricted Jurisdiction'}).`);
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
  }, [address]);

  useEffect(() => {
    let active = true;

    async function evaluate() {
      // Asynchronous non-blocking evaluation
      if (address && isSanctionedAddress(address)) {
        if (active) {
          setIsBlocked(true);
          setRestrictionType('SANCTIONED_ADDRESS');
          setDetails(`Connected wallet address ${address.slice(0, 8)}... is flagged on the OFAC Specially Designated Nationals (SDN) registry.`);
          setShowModal(true);
          setIsChecking(false);
        }
        return;
      }

      try {
        const geo = await detectUserJurisdiction();
        if (active) {
          setCountryCode(geo.countryCode);
          setCountryName(geo.countryName);

          if (geo.isRestricted) {
            setIsBlocked(true);
            setRestrictionType('SANCTIONED_JURISDICTION');
            setDetails(`Connection originated from ${geo.countryName} (${geo.countryCode}), which is subject to international financial sanctions (${geo.reason || 'Restricted Jurisdiction'}).`);
            setShowModal(true);
          } else {
            setIsBlocked(false);
            setRestrictionType(null);
            setDetails(null);
          }
        }
      } catch (err) {
        console.warn('Compliance jurisdiction check warning:', err);
      } finally {
        if (active) {
          setIsChecking(false);
        }
      }
    }

    evaluate();

    return () => {
      active = false;
    };
  }, [address]);

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
    dismissModal,
    recheck: executeComplianceEvaluation,
  };
}
