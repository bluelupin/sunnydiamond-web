import {
  type FieldValidation,
  validatePhone,
  validateRequiredEmail,
  validateRequiredName,
} from "@/shared/utils/formValidation";
import { DEFAULT_COUNTRY_CODE } from "@/shared/constants/appointmentForm";

export const LOGIN_OTP_LENGTH = 6;

export const normalizeIndianPhoneDigits = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return digits.slice(2);
  }
  return digits;
};

export const normalizeLoginPhoneDigits = (value: string, countryCode: string): string => {
  if (countryCode === "+91") {
    return normalizeIndianPhoneDigits(value);
  }

  return value.replace(/\D/g, "");
};

export const isEmailIdentifier = (value: string): boolean => value.trim().includes("@");

export const formatLoginPhoneDisplay = (countryCode: string, nationalDigits: string): string => {
  const national = nationalDigits.replace(/\D/g, "");
  if (!national) {
    return countryCode;
  }

  return `${countryCode} ${national}`;
};

export type LoginIdentifierOptions = {
  /** Treat the identifier strictly as email — no phone interpretation (SMS OTP unavailable). */
  emailOnly?: boolean;
};

/**
 * Sign-in identifier validation. Both branches lead to a one-time code: phone
 * numbers to SMS, email addresses to email.
 */
export const validateLoginIdentifier = (
  value: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
  options?: LoginIdentifierOptions,
): FieldValidation => {
  const trimmed = value.trim();

  if (options?.emailOnly) {
    return validateRequiredEmail(trimmed);
  }

  if (!trimmed) {
    return { valid: false, error: "Phone number or email is required" };
  }

  if (isEmailIdentifier(trimmed)) {
    return validateRequiredEmail(trimmed);
  }

  return validatePhone(trimmed, countryCode);
};

export const isLoginIdentifierReadyForOtp = (
  value: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
  options?: LoginIdentifierOptions,
): boolean => validateLoginIdentifier(value, countryCode, options).valid;

export const isOtpComplete = (otp: string[]): boolean =>
  otp.length === LOGIN_OTP_LENGTH && otp.every((digit) => /^\d$/.test(digit));

/** Maps a single keypress, paste, or SMS autofill string into OTP digit boxes. */
export function applyOtpInput(
  current: string[],
  startIndex: number,
  rawValue: string,
  length: number = LOGIN_OTP_LENGTH,
): { next: string[]; focusIndex: number } {
  const digits = rawValue.replace(/\D/g, "");
  const next = [...current];

  if (digits.length === 0) {
    next[startIndex] = "";
    return { next, focusIndex: startIndex };
  }

  if (digits.length === 1) {
    next[startIndex] = digits;
    return {
      next,
      focusIndex: Math.min(startIndex + 1, length - 1),
    };
  }

  for (let offset = 0; offset < digits.length && startIndex + offset < length; offset += 1) {
    next[startIndex + offset] = digits[offset]!;
  }

  const lastFilled = Math.min(startIndex + digits.length - 1, length - 1);
  return { next, focusIndex: lastFilled };
}

export type CreateAccountSecondaryField = "email" | "phone";

export type CreateAccountFormValues = {
  fullName: string;
  termsAccepted: boolean;
  /** Identifier collected on create-account when it was not used to sign in. */
  secondaryField: CreateAccountSecondaryField;
  email: string;
  phone: string;
  countryCode: string;
};

export type CreateAccountFormErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  terms?: string;
};

export const validateCreateAccountForm = (
  values: CreateAccountFormValues,
): { valid: boolean; errors: CreateAccountFormErrors } => {
  const nameValidation = validateRequiredName(values.fullName);
  const emailValidation =
    values.secondaryField === "email" ? validateRequiredEmail(values.email) : { valid: true as const };
  const phoneValidation =
    values.secondaryField === "phone"
      ? validatePhone(values.phone, values.countryCode)
      : { valid: true as const };

  const errors: CreateAccountFormErrors = {
    fullName: nameValidation.valid ? undefined : nameValidation.error,
    email: emailValidation.valid ? undefined : emailValidation.error,
    phone: phoneValidation.valid ? undefined : phoneValidation.error,
    terms: values.termsAccepted
      ? undefined
      : "Please agree to the Terms & Conditions and Privacy Policy.",
  };

  return {
    valid: !errors.fullName && !errors.email && !errors.phone && !errors.terms,
    errors,
  };
};

export const isCreateAccountReady = (values: CreateAccountFormValues): boolean =>
  validateCreateAccountForm(values).valid;
