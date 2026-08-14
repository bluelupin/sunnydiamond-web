import {
  type FieldValidation,
  validatePhone,
  validateRequiredEmail,
  validateRequiredName,
  validateRequiredPassword,
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

export const isIndianCountryCode = (code: string): boolean => code === "+91";

export const formatLoginPhoneDisplay = (countryCode: string, nationalDigits: string): string => {
  const national = nationalDigits.replace(/\D/g, "");
  if (!national) {
    return countryCode;
  }

  return `${countryCode} ${national}`;
};

export type LoginIdentifierOptions = {
  /** Treat the identifier strictly as email — no phone interpretation (OTP login unavailable). */
  emailOnly?: boolean;
};

/**
 * Sign-in identifier validation. Phone numbers continue to SMS OTP; email continues to password.
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

export type CreateAccountFormValues = {
  fullName: string;
  email: string;
  termsAccepted: boolean;
};

export type CreateAccountFormErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  terms?: string;
};

export type EmailRegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  termsAccepted: boolean;
};

export const validateEmailRegisterForm = (
  values: EmailRegisterFormValues,
): { valid: boolean; errors: CreateAccountFormErrors } => {
  const nameValidation = validateRequiredName(values.fullName);
  const emailValidation = validateRequiredEmail(values.email);
  const passwordValidation = validateRequiredPassword(values.password);

  const errors: CreateAccountFormErrors = {
    fullName: nameValidation.valid ? undefined : nameValidation.error,
    email: emailValidation.valid ? undefined : emailValidation.error,
    password: passwordValidation.valid ? undefined : passwordValidation.error,
    terms: values.termsAccepted ? undefined : "Please accept the terms and conditions",
  };

  return {
    valid: !errors.fullName && !errors.email && !errors.password && !errors.terms,
    errors,
  };
};

export const isEmailRegisterReady = (values: EmailRegisterFormValues): boolean =>
  validateEmailRegisterForm(values).valid;

export const validateCreateAccountForm = (
  values: CreateAccountFormValues,
): { valid: boolean; errors: CreateAccountFormErrors } => {
  const nameValidation = validateRequiredName(values.fullName);
  const emailValidation = validateRequiredEmail(values.email);

  const errors: CreateAccountFormErrors = {
    fullName: nameValidation.valid ? undefined : nameValidation.error,
    email: emailValidation.valid ? undefined : emailValidation.error,
    terms: values.termsAccepted ? undefined : "Please accept the terms and conditions",
  };

  return {
    valid: !errors.fullName && !errors.email && !errors.terms,
    errors,
  };
};

export const isCreateAccountReady = (values: CreateAccountFormValues): boolean =>
  validateCreateAccountForm(values).valid;
