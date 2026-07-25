'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { CartProvider } from '@/features/cart/context/CartContext';
import { CartUIProvider } from '@/features/cart/context/CartUIContext';
import CartBagDrawer from '@/features/cart/components/CartBagDrawer';
import GiftingOptionsPanel from '@/features/cart/components/GiftingOptionsPanel';
import GuestCheckoutModal from '@/features/cart/components/GuestCheckoutModal';
import { WishlistProvider } from '@/features/wishlist/context/WishlistContext';
import { LoginModalProvider } from '@/features/auth/context/LoginModalContext';
import LoginModal from '@/features/auth/components/LoginModal';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <CartUIProvider>
            <LoginModalProvider>
              <WishlistProvider>
                {children}
                <CartBagDrawer />
                <GiftingOptionsPanel />
                <GuestCheckoutModal />
                <LoginModal />
              </WishlistProvider>
            </LoginModalProvider>
          </CartUIProvider>
        </CartProvider>
      </AuthProvider>
      <Toaster richColors position="top-right" />
    </>
  );
}
