'use client';

import React from 'react';
import { AppStatusToastProvider } from '@/shared/context/AppStatusToastContext';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { CartProvider } from '@/features/cart/context/CartContext';
import { CartUIProvider } from '@/features/cart/context/CartUIContext';
import { FeatureErrorBoundary } from '@/shared/ui/FeatureErrorBoundary';
import { SavedInspirationsProvider } from '@/features/bespoke/context/SavedInspirationsContext';
import { WishlistProvider } from '@/features/wishlist/context/WishlistContext';
import { LoginModalProvider } from '@/features/auth/context/LoginModalContext';
import { PageLoadingProvider } from '@/shared/context/PageLoadingContext';
import { AuthFeaturesProvider } from '@/features/auth/context/AuthFeaturesContext';
import {
  DEFAULT_AUTH_FEATURE_FLAGS,
  type AuthFeatureFlags,
} from '@/features/auth/types/authFeatures.types';
import GiftingGiftCardFlowRoot from '@/features/gift-card/components/GiftingGiftCardFlowRoot';
import { UiPlatformProvider } from '@/shared/context/UiPlatformContext';
import type { UiPlatform } from '@/shared/utils/detectUiPlatform';
import DeferredGlobalOverlays from './DeferredGlobalOverlays';

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
                  <SavedInspirationsProvider>
                  <FeatureErrorBoundary featureName="GiftingGiftCardFlowRoot">
                    <GiftingGiftCardFlowRoot>
                      <PageLoadingProvider>
                        {children}
                      </PageLoadingProvider>
                    </GiftingGiftCardFlowRoot>
                  </FeatureErrorBoundary>
                  <DeferredGlobalOverlays />
                  </SavedInspirationsProvider>
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
