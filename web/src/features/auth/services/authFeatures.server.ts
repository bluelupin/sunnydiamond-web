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
      sd_email_otp_login_enabled
      sd_google_login_enabled
      sd_apple_login_enabled
    }
  }
` as const;

type MagentoAuthFeaturesResponse = {
  storeConfig: {
    sd_otp_login_enabled: boolean | null;
    sd_email_otp_login_enabled: boolean | null;
    sd_google_login_enabled: boolean | null;
    sd_apple_login_enabled: boolean | null;
  } | null;
};

/**
 * Same query without the newest field, for the window where the frontend has
 * deployed ahead of Magento. GraphQL rejects the whole document over one unknown
 * field, so without this fallback a single missing field fails every login method
 * closed at once — which is exactly what happened on the first deploy of
 * sd_email_otp_login_enabled.
 */
const MAGENTO_AUTH_FEATURES_LEGACY_QUERY = `
  query MagentoAuthFeaturesLegacy {
    storeConfig {
      sd_otp_login_enabled
      sd_google_login_enabled
      sd_apple_login_enabled
    }
  }
` as const;

const toFlags = (
  config: MagentoAuthFeaturesResponse["storeConfig"] | undefined,
): AuthFeatureFlags => ({
  otpLoginEnabled: config?.sd_otp_login_enabled === true,
  emailOtpLoginEnabled: config?.sd_email_otp_login_enabled === true,
  googleLoginEnabled: config?.sd_google_login_enabled === true,
  appleLoginEnabled: config?.sd_apple_login_enabled === true,
});

const isUnknownFieldError = (error: unknown): boolean =>
  error instanceof Error && /cannot query field/i.test(error.message);

export async function fetchAuthFeatureFlags(): Promise<AuthFeatureFlags> {
  // Runs in the root layout: a lower revalidate here would drag the whole
  // route's ISR interval down with it, so never go below the catalog value.
  const options = {
    revalidateSeconds: MAGENTO_CATALOG_REVALIDATE_SECONDS,
    tags: [AUTH_FEATURES_CACHE_TAG],
  };

  try {
    const data = await magentoGraphqlFetch<MagentoAuthFeaturesResponse>({
      query: MAGENTO_AUTH_FEATURES_QUERY,
      ...options,
    });
    return toFlags(data.storeConfig ?? undefined);
  } catch (error) {
    if (!isUnknownFieldError(error)) {
      console.warn("[auth] Failed to fetch auth feature flags", error);
      return DEFAULT_AUTH_FEATURE_FLAGS;
    }

    // Magento predates the email OTP field — keep the older methods working
    // rather than dropping the customer into a sign-in page with no channels.
    console.warn("[auth] storeConfig missing a field; retrying without it", error);
    try {
      const data = await magentoGraphqlFetch<MagentoAuthFeaturesResponse>({
        query: MAGENTO_AUTH_FEATURES_LEGACY_QUERY,
        ...options,
      });
      return toFlags(data.storeConfig ?? undefined);
    } catch (fallbackError) {
      console.warn("[auth] Failed to fetch auth feature flags", fallbackError);
      return DEFAULT_AUTH_FEATURE_FLAGS;
    }
  }
}
