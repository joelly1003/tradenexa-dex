'use client';

import React from 'react';
import { useComplianceCheck } from '../../hooks/useComplianceCheck';
import { ComplianceRestrictionModal } from './ComplianceRestrictionModal';

export function ComplianceGuard() {
  const { showModal, dismissModal, restrictionType, details, countryName } = useComplianceCheck();

  return (
    <ComplianceRestrictionModal
      isOpen={showModal}
      onClose={dismissModal}
      restrictionType={restrictionType}
      details={details}
      countryName={countryName}
    />
  );
}
