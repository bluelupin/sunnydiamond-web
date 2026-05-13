'use client';

import React from 'react';
import StyledComponentsRegistry from '@/lib/registry';
import { Toaster } from 'sonner';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      {children}
      <Toaster richColors position="top-right" />
    </StyledComponentsRegistry>
  );
}
