'use client';

import React from 'react';
import StyledComponentsRegistry from '@/shared/lib/registry';
import { Toaster } from 'sonner';
import { CartProvider } from '@/features/cart/context/CartContext';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <CartProvider>{children}</CartProvider>
      <Toaster richColors position="top-right" />
    </StyledComponentsRegistry>
  );
}
