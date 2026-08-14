"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  DEFAULT_AUTH_FEATURE_FLAGS,
  type AuthFeatureFlags,
} from "../types/authFeatures.types";

const AuthFeaturesContext = createContext<AuthFeatureFlags>(DEFAULT_AUTH_FEATURE_FLAGS);

export function AuthFeaturesProvider({
  flags,
  children,
}: {
  flags: AuthFeatureFlags;
  children: ReactNode;
}) {
  return <AuthFeaturesContext.Provider value={flags}>{children}</AuthFeaturesContext.Provider>;
}

/** Falls back to DEFAULT_AUTH_FEATURE_FLAGS (all disabled) when no provider is mounted. */
export function useAuthFeatures(): AuthFeatureFlags {
  return useContext(AuthFeaturesContext);
}
