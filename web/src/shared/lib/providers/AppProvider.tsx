'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { CartProvider } from '@/features/cart/context/CartContext';
import { CartUIProvider } from '@/features/cart/context/CartUIContext';
import CartBagDrawer from '@/features/cart/components/CartBagDrawer';
import GiftingOptionsPanel from '@/features/cart/components/GiftingOptionsPanel';
import { WishlistProvider } from '@/features/wishlist/context/WishlistContext';
import { LoginModalProvider } from '@/features/auth/context/LoginModalContext';
import LoginModal from '@/features/auth/components/LoginModal';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartProvider>
        <CartUIProvider>
          <WishlistProvider>
            <LoginModalProvider>
              {children}
              <CartBagDrawer />
              <GiftingOptionsPanel />
              <LoginModal />
            </LoginModalProvider>
          </WishlistProvider>
        </CartUIProvider>
      </CartProvider>
      <Toaster richColors position="top-right" />
    </>
  );
}
