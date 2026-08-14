// Server-only: fetches Magento storeConfig — never import from client components.
// Client code reads the flags via AuthFeaturesContext instead.
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MAGENTO_CATALOG_REVALIDATE_SECONDS } from "@/services/magento/config";
import {
  DEFAULT_AUTH_FEATURE_FLAGS,
  type AuthFeatureFlags,
} from "../types/authFeatures.types";

export { DEFAULT_AUTH_FEATURE_FLAGS, type AuthFeatureFlags };

export const AUTH_FEATURES_CACHE_TAG = "auth-features";

const MAGENTO_AUTH_FEATURES_QUERY = `
  query MagentoAuthFeatures {
    storeConfig {
      sd_otp_login_enabled
      sd_google_login_enabled
      sd_apple_login_enabled
    }
  }
` as const;

type MagentoAuthFeaturesResponse = {
  storeConfig: {
    sd_otp_login_enabled: boolean | null;
    sd_google_login_enabled: boolean | null;
    sd_apple_login_enabled: boolean | null;
  } | null;
};

export async function fetchAuthFeatureFlags(): Promise<AuthFeatureFlags> {
  try {
    const data = await magentoGraphqlFetch<MagentoAuthFeaturesResponse>({
      query: MAGENTO_AUTH_FEATURES_QUERY,
      // Runs in the root layout: a lower revalidate here would drag the whole
      // route's ISR interval down with it, so never go below the catalog value.
      revalidateSeconds: MAGENTO_CATALOG_REVALIDATE_SECONDS,
      tags: [AUTH_FEATURES_CACHE_TAG],
    });

    const config = data.storeConfig;
    return {
      otpLoginEnabled: config?.sd_otp_login_enabled === true,
      googleLoginEnabled: config?.sd_google_login_enabled === true,
      appleLoginEnabled: config?.sd_apple_login_enabled === true,
    };
  } catch (error) {
    console.warn("[auth] Failed to fetch auth feature flags", error);
    return DEFAULT_AUTH_FEATURE_FLAGS;
  }
}
