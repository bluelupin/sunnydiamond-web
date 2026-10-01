export type AuthFeatureFlags = {
  /** SMS OTP, for the countries in otpCountryCodes. */
  otpLoginEnabled: boolean;
  /** Dial codes ("+91", "+1") that can get an SMS code; India always first. */
  otpCountryCodes: string[];
  /** Email OTP — the sign-in path for everyone, international customers included. */
  emailOtpLoginEnabled: boolean;
  googleLoginEnabled: boolean;
  appleLoginEnabled: boolean;
};

/** Fail-closed defaults: every optional login method stays hidden until Magento confirms it. */
export const DEFAULT_AUTH_FEATURE_FLAGS: AuthFeatureFlags = {
  otpLoginEnabled: false,
  otpCountryCodes: ["+91"],
  emailOtpLoginEnabled: false,
  googleLoginEnabled: false,
  appleLoginEnabled: false,
};
