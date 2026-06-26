'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { CartProvider } from '@/features/cart/context/CartContext';
import { WishlistProvider } from '@/features/wishlist/context/WishlistContext';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
      <Toaster richColors position="top-right" />
    </>
  );
}
