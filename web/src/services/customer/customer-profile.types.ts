/**
 * Contact fields shared by My Profile and appointment-style forms.
 * Keep this shape stable so forms can prefill without knowing the auth layer.
 */
export type CustomerProfileContact = {
  fullName?: string | null;
  email?: string | null;
  /** National number only when countryCode is provided separately */
  phone?: string | null;
  countryCode?: string | null;
};
