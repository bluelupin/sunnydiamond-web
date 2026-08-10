'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { CartProvider } from '@/features/cart/context/CartContext';
import { CartUIProvider } from '@/features/cart/context/CartUIContext';
import CartBagDrawer from '@/features/cart/components/CartBagDrawer';
import GiftingOptionsPanel from '@/features/cart/components/GiftingOptionsPanel';
import GuestCheckoutModal from '@/features/cart/components/GuestCheckoutModal';
import { FeatureErrorBoundary } from '@/shared/ui/FeatureErrorBoundary';
import { WishlistProvider } from '@/features/wishlist/context/WishlistContext';
import { LoginModalProvider } from '@/features/auth/context/LoginModalContext';
import LoginModal from '@/features/auth/components/LoginModal';
import { PageLoadingProvider } from '@/shared/context/PageLoadingContext';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <CartUIProvider>
            <LoginModalProvider>
              <WishlistProvider>
                <PageLoadingProvider>
                  {children}
                </PageLoadingProvider>
                <FeatureErrorBoundary featureName="CartBagDrawer">
                  <CartBagDrawer />
                </FeatureErrorBoundary>
                <FeatureErrorBoundary featureName="GiftingOptionsPanel">
                  <GiftingOptionsPanel />
                </FeatureErrorBoundary>
                <FeatureErrorBoundary featureName="GuestCheckoutModal">
                  <GuestCheckoutModal />
                </FeatureErrorBoundary>
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
