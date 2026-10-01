'use client';

import React from 'react';
import { BlockCounter } from './BlockCounter';

interface NetworkStatusBadgeProps {
  className?: string;
  showExplorerLink?: boolean;
}

export function NetworkStatusBadge({
  className = '',
  showExplorerLink = true,
}: NetworkStatusBadgeProps) {
  return (
    <BlockCounter
      className={className}
      showExplorerLink={showExplorerLink}
    />
  );
}

export { BlockCounter };
