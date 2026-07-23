'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { CartProvider } from '@/features/cart/context/CartContext';
import { CartUIProvider } from '@/features/cart/context/CartUIContext';
import CartBagDrawer from '@/features/cart/components/CartBagDrawer';
import GiftingOptionsPanel from '@/features/cart/components/GiftingOptionsPanel';
import { WishlistProvider } from '@/features/wishlist/context/WishlistContext';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <CartUIProvider>
            <WishlistProvider>
              {children}
              <CartBagDrawer />
              <GiftingOptionsPanel />
            </WishlistProvider>
          </CartUIProvider>
        </CartProvider>
      </AuthProvider>
      <Toaster richColors position="top-right" />
    </>
  );
}
