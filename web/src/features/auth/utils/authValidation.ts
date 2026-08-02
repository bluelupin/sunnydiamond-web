import {
  type FieldValidation,
  validateRequiredEmail,
  validateRequiredName,
  validateRequiredPassword,
} from "@/shared/utils/formValidation";

export const LOGIN_OTP_LENGTH = 6;

export const normalizeIndianPhoneDigits = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return digits.slice(2);
  }
  return digits;
};

export const isEmailIdentifier = (value: string): boolean => value.trim().includes("@");

/**
 * Sign-in identifier validation. Format checks are deferred until Magento auth is wired.
 * Sign-in identifier validation. A phone number continues to the SMS-OTP flow;
 * an email continues to the password flow.
 */
export const validateLoginIdentifier = (value: string): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, error: "Phone number or email is required" };
  }

  if (isEmailIdentifier(trimmed)) {
    return validateRequiredEmail(trimmed);
  }

  return { valid: true };
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
