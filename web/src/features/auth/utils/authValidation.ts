import {
  type FieldValidation,
  validatePhone,
  validateRequiredEmail,
  validateRequiredName,
} from "@/shared/utils/formValidation";

export const LOGIN_OTP_LENGTH = 6;

export const normalizeIndianPhoneDigits = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return digits.slice(2);
  }
  return digits;
};

/**
 * Sign-in identifier validation. OTP flow requires a valid Indian mobile number.
 * Email is rejected with a clear message because this step sends an SMS OTP.
 */
export const validateLoginIdentifier = (value: string): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, error: "Phone number or email is required" };
  }

  if (trimmed.includes("@")) {
    return {
      valid: false,
      error: "Enter your mobile number to receive an OTP",
    };
  }

  return validatePhone(normalizeIndianPhoneDigits(trimmed), "+91");
};

export const isLoginIdentifierReadyForOtp = (value: string): boolean =>
  validateLoginIdentifier(value).valid;

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
  terms?: string;
};

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
