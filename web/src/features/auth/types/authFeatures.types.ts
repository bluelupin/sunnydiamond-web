export type AuthFeatureFlags = {
  /** SMS OTP — Indian mobile numbers only. */
  otpLoginEnabled: boolean;
  /** Email OTP — the sign-in path for everyone, international customers included. */
  emailOtpLoginEnabled: boolean;
  googleLoginEnabled: boolean;
  appleLoginEnabled: boolean;
};

/** Fail-closed defaults: every optional login method stays hidden until Magento confirms it. */
export const DEFAULT_AUTH_FEATURE_FLAGS: AuthFeatureFlags = {
  otpLoginEnabled: false,
  emailOtpLoginEnabled: false,
  googleLoginEnabled: false,
  appleLoginEnabled: false,
};
