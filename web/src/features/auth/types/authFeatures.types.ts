export type AuthFeatureFlags = {
  otpLoginEnabled: boolean;
  googleLoginEnabled: boolean;
  appleLoginEnabled: boolean;
};

/** Fail-closed defaults: every optional login method stays hidden until Magento confirms it. */
export const DEFAULT_AUTH_FEATURE_FLAGS: AuthFeatureFlags = {
  otpLoginEnabled: false,
  googleLoginEnabled: false,
  appleLoginEnabled: false,
};
