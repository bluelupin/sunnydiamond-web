'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AppStatusToastProvider } from '@/shared/context/AppStatusToastContext';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { CartProvider } from '@/features/cart/context/CartContext';
import { CartUIProvider } from '@/features/cart/context/CartUIContext';
import GiftingOptionsPanel from '@/features/cart/components/GiftingOptionsPanel';
import GuestCheckoutModal from '@/features/cart/components/GuestCheckoutModal';
import { FeatureErrorBoundary } from '@/shared/ui/FeatureErrorBoundary';
import { WishlistProvider } from '@/features/wishlist/context/WishlistContext';
import { LoginModalProvider } from '@/features/auth/context/LoginModalContext';
import LoginModal from '@/features/auth/components/LoginModal';
import { PageLoadingProvider } from '@/shared/context/PageLoadingContext';
import { AuthFeaturesProvider } from '@/features/auth/context/AuthFeaturesContext';
import {
  DEFAULT_AUTH_FEATURE_FLAGS,
  type AuthFeatureFlags,
} from '@/features/auth/types/authFeatures.types';
import { UiPlatformProvider } from '@/shared/context/UiPlatformContext';
import type { UiPlatform } from '@/shared/utils/detectUiPlatform';

const CartBagDrawer = dynamic(
  () => import('@/features/cart/components/CartBagDrawer'),
  { ssr: false },
);

export default function AppProvider({
  children,
  authFeatures = DEFAULT_AUTH_FEATURE_FLAGS,
  initialUiPlatform = "other",
}: {
  children: React.ReactNode;
  authFeatures?: AuthFeatureFlags;
  initialUiPlatform?: UiPlatform;
}) {
  return (
    <UiPlatformProvider initialPlatform={initialUiPlatform}>
    <AppStatusToastProvider>
      <AuthFeaturesProvider flags={authFeatures}>
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
                  <FeatureErrorBoundary featureName="LoginModal">
                    <LoginModal />
                  </FeatureErrorBoundary>
                </WishlistProvider>
              </LoginModalProvider>
            </CartUIProvider>
          </CartProvider>
        </AuthProvider>
      </AuthFeaturesProvider>
    </AppStatusToastProvider>
    </UiPlatformProvider>
  );
}
