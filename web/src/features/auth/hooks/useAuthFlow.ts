"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { formatLoginPhoneForMagento } from "@/lib/auth/magentoPhone";
import { DEFAULT_COUNTRY_CODE } from "@/shared/constants/appointmentForm";
import { sanitizePhoneInput } from "@/shared/utils/formValidation";
import {
  createCustomerAccount,
  loginWithPassword,
  registerWithEmail,
  requestLoginOtp,
  verifyLoginOtp,
} from "../services/auth.service";
import { runPostLoginSync } from "../services/postLoginSync";
import {
  isAppleSignInConfigured,
  isGoogleSignInConfigured,
  signInWithApple,
  signInWithGoogle,
} from "../services/socialSignIn";
import { useAuthFeatures } from "../context/AuthFeaturesContext";
import {
  isEmailIdentifier,
  isIndianCountryCode,
  isLoginIdentifierReadyForOtp,
  isOtpComplete,
  LOGIN_OTP_LENGTH,
  normalizeLoginPhoneDigits,
  validateCreateAccountForm,
  validateEmailRegisterForm,
  isEmailRegisterReady,
  validateLoginIdentifier,
} from "../utils/authValidation";
import { getLoginHrefForReturn, sanitizeReturnUrl } from "../utils/authNavigation";

export type AuthFlowStep = "sign-in" | "otp" | "create-account" | "password" | "email-create-account";

const RESEND_SECONDS = 60;

type UseAuthFlowOptions = {
  active: boolean;
  returnUrl?: string;
  initialIdentifier?: string;
  onComplete: (returnUrl: string) => void;
  onAbort: () => void;
  surface?: "modal" | "standalone";
};

export type AuthFlowContentProps = {
  step: AuthFlowStep;
  titleClassName?: string;
  signIn: {
    identifier: string;
    countryCode: string;
    identifierError?: string;
    emailOnly: boolean;
    otpBlockedForCountry: boolean;
    showGoogle: boolean;
    showApple: boolean;
    onIdentifierChange: (value: string) => void;
    onCountryCodeChange: (value: string) => void;
    onContinue: () => void;
    onGoogleContinue: () => void;
    onAppleContinue: () => void;
    onUseEmailInstead: () => void;
    onClose: () => void;
  };
  otp: {
    phone: string;
    countryCode: string;
    otp: string[];
    otpError?: string;
    secondsLeft: number;
    inputRefs: RefObject<Array<HTMLInputElement | null>>;
    onDigitChange: (index: number, value: string) => void;
    onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
    onBack: () => void;
    onClose: () => void;
    onEdit: () => void;
    onLogin: () => void;
    onResend: () => void;
  };
  createAccount: {
    fullName: string;
    email: string;
    termsAccepted: boolean;
    fullNameError?: string;
    emailError?: string;
    termsError?: string;
    onFullNameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onTermsAcceptedChange: (value: boolean) => void;
    onBack: () => void;
    onClose: () => void;
    onCreateAccount: () => void;
  };
  password: {
    email: string;
    password: string;
    passwordError?: string;
    onPasswordChange: (value: string) => void;
    onBack: () => void;
    onClose: () => void;
    onLogin: () => void;
    onCreateAccount: () => void;
  };
  emailCreateAccount: {
    email: string;
    fullName: string;
    password: string;
    termsAccepted: boolean;
    fullNameError?: string;
    emailError?: string;
    passwordError?: string;
    termsError?: string;
    onFullNameChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onTermsAcceptedChange: (value: boolean) => void;
    onBack: () => void;
    onClose: () => void;
    onCreateAccount: () => void;
  };
};

export function useAuthFlow({
  active,
  returnUrl: returnUrlInput,
  initialIdentifier = "",
  onAbort,
  surface = "standalone",
}: UseAuthFlowOptions) {
  const returnUrl = sanitizeReturnUrl(returnUrlInput);
  const flags = useAuthFeatures();
  const showGoogle = flags.googleLoginEnabled && isGoogleSignInConfigured();
  const showApple = flags.appleLoginEnabled && isAppleSignInConfigured();
  const [step, setStep] = useState<AuthFlowStep>("sign-in");
  const [identifier, setIdentifier] = useState("");
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY_CODE);
  /** Sticky "Use email instead" choice; survives switching country back to +91, cleared on reset. */
  const [emailModeForced, setEmailModeForced] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [verifiedCountryCode, setVerifiedCountryCode] = useState<string>(DEFAULT_COUNTRY_CODE);
  const [identifierError, setIdentifierError] = useState<string | undefined>();
  const [otp, setOtp] = useState<string[]>(Array(LOGIN_OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState<string | undefined>();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordError, setRegisterPasswordError] = useState<string | undefined>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fullNameError, setFullNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [termsError, setTermsError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  /** Server-provided resend cooldown; the timer effect reads this on entering the OTP step. */
  const cooldownRef = useRef(RESEND_SECONDS);

  const emailOnly = !flags.otpLoginEnabled || emailModeForced;
  const otpBlockedForCountry =
    !emailOnly && !isEmailIdentifier(identifier) && !isIndianCountryCode(countryCode);

  /** Session cookie is set — sync guest cart/wishlist, then full navigation so providers reboot. */
  const completeAuth = useCallback(async () => {
    await runPostLoginSync();
    window.location.assign(returnUrl);
  }, [returnUrl]);

  const resetState = useCallback(() => {
    setStep("sign-in");
    setIdentifier("");
    setCountryCode(DEFAULT_COUNTRY_CODE);
    setEmailModeForced(false);
    setVerifiedPhone("");
    setVerifiedCountryCode(DEFAULT_COUNTRY_CODE);
    setIdentifierError(undefined);
    setOtp(Array(LOGIN_OTP_LENGTH).fill(""));
    setOtpError(undefined);
    setSecondsLeft(RESEND_SECONDS);
    setPassword("");
    setPasswordError(undefined);
    setRegisterPassword("");
    setRegisterPasswordError(undefined);
    setFullName("");
    setEmail("");
    setTermsAccepted(false);
    setFullNameError(undefined);
    setEmailError(undefined);
    setTermsError(undefined);
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (!active) {
      resetState();
      return;
    }

    const seeded = initialIdentifier.trim();
    if (!seeded) {
      return;
    }

    setIdentifier(seeded);
    setIdentifierError(undefined);
    if (isEmailIdentifier(seeded)) {
      setStep("password");
    }
  }, [active, initialIdentifier, resetState]);

  useEffect(() => {
    if (!active || step !== "otp") return;

    setSecondsLeft(cooldownRef.current);
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [active, step]);

  useEffect(() => {
    if (!active || step !== "otp") return;
    inputRefs.current[0]?.focus();
  }, [active, step]);

  useEffect(() => {
    if (!active) return;

    if (step === "otp" && !isLoginIdentifierReadyForOtp(identifier, countryCode, { emailOnly })) {
      setStep("sign-in");
    }

    if (step === "create-account" && !verifiedPhone) {
      setStep(isLoginIdentifierReadyForOtp(identifier, countryCode, { emailOnly }) ? "otp" : "sign-in");
    }

    if (step === "password" && !isEmailIdentifier(identifier)) {
      setStep("sign-in");
    }

    if (step === "email-create-account" && !isEmailIdentifier(identifier)) {
      setStep("sign-in");
    }
  }, [active, step, identifier, countryCode, verifiedPhone, emailOnly]);

  const handleClose = useCallback(() => {
    onAbort();
  }, [onAbort]);

  const handleIdentifierChange = useCallback(
    (value: string) => {
      // Digits are legitimate email input in email-only mode — never phone-format them.
      const nextValue =
        emailOnly || /[a-zA-Z@]/.test(value) ? value : sanitizePhoneInput(value, countryCode);
      setIdentifier(nextValue);
      setIdentifierError(undefined);
    },
    [countryCode, emailOnly],
  );

  const handleCountryCodeChange = useCallback(
    (value: string) => {
      setCountryCode(value);
      if (!isEmailIdentifier(identifier)) {
        setIdentifier(sanitizePhoneInput(identifier, value));
      }
      setIdentifierError(undefined);
    },
    [identifier],
  );

  const handleUseEmailInstead = useCallback(() => {
    setEmailModeForced(true);
    setIdentifier("");
    setIdentifierError(undefined);
  }, []);

  const handleContinue = useCallback(async () => {
    if (isSubmitting || otpBlockedForCountry) return;
    const validation = validateLoginIdentifier(identifier, countryCode, { emailOnly });

    if (!validation.valid) {
      setIdentifierError(validation.error);
      return;
    }

    // emailOnly forces the password branch — requestLoginOtp must never fire with OTP disabled.
    if (emailOnly || isEmailIdentifier(identifier)) {
      setIdentifier(identifier.trim());
      setIdentifierError(undefined);
      setPassword("");
      setPasswordError(undefined);
      setStep("password");
      return;
    }

    const phoneDigits = normalizeLoginPhoneDigits(identifier, countryCode);
    const phoneForApi = formatLoginPhoneForMagento(countryCode, phoneDigits);
    setIsSubmitting(true);
    const result = await requestLoginOtp(phoneForApi);
    setIsSubmitting(false);

    if (!result.success) {
      setIdentifierError(result.error);
      return;
    }

    cooldownRef.current = result.resendAfterSeconds;
    setIdentifier(phoneDigits);
    setVerifiedCountryCode(countryCode);
    setIdentifierError(undefined);
    setOtp(Array(LOGIN_OTP_LENGTH).fill(""));
    setOtpError(undefined);
    setStep("otp");
  }, [countryCode, emailOnly, identifier, isSubmitting, otpBlockedForCountry]);

  const handleBackToSignIn = useCallback(() => {
    setStep("sign-in");
    setOtp(Array(LOGIN_OTP_LENGTH).fill(""));
    setOtpError(undefined);
    setSecondsLeft(RESEND_SECONDS);
  }, []);

  const handleBackToOtp = useCallback(() => {
    if (!verifiedPhone) {
      setStep("sign-in");
      return;
    }
    setStep("otp");
    setFullNameError(undefined);
    setEmailError(undefined);
    setTermsError(undefined);
  }, [verifiedPhone]);

  const updateDigit = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpError(undefined);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < LOGIN_OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handleResend = useCallback(async () => {
    if ((!otpError && secondsLeft > 0) || isSubmitting) return;
    if (!isLoginIdentifierReadyForOtp(identifier, countryCode, { emailOnly })) {
      setStep("sign-in");
      return;
    }

    const phoneDigits = normalizeLoginPhoneDigits(identifier, countryCode);
    const phoneForApi = formatLoginPhoneForMagento(countryCode, phoneDigits);

    setIsSubmitting(true);
    const result = await requestLoginOtp(phoneForApi);
    setIsSubmitting(false);

    if (!result.success) {
      setOtpError(result.error);
      return;
    }

    cooldownRef.current = result.resendAfterSeconds;
    setOtpError(undefined);
    setSecondsLeft(result.resendAfterSeconds);
    setOtp(Array(LOGIN_OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  }, [countryCode, emailOnly, identifier, isSubmitting, otpError, secondsLeft]);

  const handleLogin = useCallback(async () => {
    if (!isOtpComplete(otp) || isSubmitting) return;
    if (!isLoginIdentifierReadyForOtp(identifier, countryCode, { emailOnly })) {
      setStep("sign-in");
      setIdentifierError("Phone number or email is required");
      return;
    }

    const phoneDigits = normalizeLoginPhoneDigits(identifier, countryCode);
    const phoneForApi = formatLoginPhoneForMagento(countryCode, phoneDigits);

    setIsSubmitting(true);
    const result = await verifyLoginOtp(phoneForApi, otp.join(""));
    setIsSubmitting(false);

    if (!result.success) {
      setOtpError(result.error);
      return;
    }

    setOtpError(undefined);
    setVerifiedPhone(phoneDigits);
    setVerifiedCountryCode(countryCode);

    if (result.requiresAccountSetup) {
      setStep("create-account");
      return;
    }

    setIsSubmitting(true);
    await completeAuth();
  }, [completeAuth, countryCode, emailOnly, identifier, isSubmitting, otp]);

  const handleCreateAccount = useCallback(async () => {
    if (!verifiedPhone || isSubmitting) return;

    const { valid, errors } = validateCreateAccountForm({
      fullName,
      email,
      termsAccepted,
    });

    setFullNameError(errors.fullName);
    setEmailError(errors.email);
    setTermsError(errors.terms);

    if (!valid) return;

    const phoneForApi = formatLoginPhoneForMagento(verifiedCountryCode, verifiedPhone);

    setIsSubmitting(true);
    const result = await createCustomerAccount({
      phone: phoneForApi,
      otp: otp.join(""),
      fullName: fullName.trim(),
      email: email.trim(),
      marketingOptIn: termsAccepted,
    });

    if (!result.success) {
      setIsSubmitting(false);
      setEmailError(result.error);
      return;
    }

    await completeAuth();
  }, [completeAuth, email, fullName, isSubmitting, otp, termsAccepted, verifiedCountryCode, verifiedPhone]);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setPasswordError(undefined);
  }, []);

  const handleBackFromPassword = useCallback(() => {
    setStep("sign-in");
    setPassword("");
    setPasswordError(undefined);
  }, []);

  const handleGoToEmailCreateAccount = useCallback(() => {
    if (!isEmailIdentifier(identifier)) {
      setStep("sign-in");
      return;
    }

    setEmail(identifier.trim());
    setFullName("");
    setRegisterPassword("");
    setTermsAccepted(false);
    setFullNameError(undefined);
    setEmailError(undefined);
    setRegisterPasswordError(undefined);
    setTermsError(undefined);
    setStep("email-create-account");
  }, [identifier]);

  const handleBackFromEmailCreateAccount = useCallback(() => {
    setStep("password");
    setFullNameError(undefined);
    setEmailError(undefined);
    setRegisterPasswordError(undefined);
    setTermsError(undefined);
  }, []);

  const handleEmailRegister = useCallback(async () => {
    if (!isEmailIdentifier(identifier) || isSubmitting) return;

    const emailValue = identifier.trim();
    const { valid, errors } = validateEmailRegisterForm({
      fullName,
      email: emailValue,
      password: registerPassword,
      termsAccepted,
    });

    setFullNameError(errors.fullName);
    setEmailError(errors.email);
    setRegisterPasswordError(errors.password);
    setTermsError(errors.terms);

    if (!valid) return;

    setIsSubmitting(true);
    const result = await registerWithEmail({
      fullName: fullName.trim(),
      email: emailValue,
      password: registerPassword,
      marketingOptIn: termsAccepted,
    });

    if (!result.success) {
      setIsSubmitting(false);
      if (/same email address/i.test(result.error)) {
        setEmailError(result.error);
      } else if (/password/i.test(result.error)) {
        setRegisterPasswordError(result.error);
      } else {
        setEmailError(result.error);
      }
      return;
    }

    setIsSubmitting(false);
    await completeAuth();
  }, [
    completeAuth,
    fullName,
    identifier,
    isSubmitting,
    registerPassword,
    termsAccepted,
  ]);

  const handlePasswordLogin = useCallback(async () => {
    if (isSubmitting) return;
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    setIsSubmitting(true);
    const result = await loginWithPassword(identifier.trim(), password);

    if (!result.success) {
      setIsSubmitting(false);
      setPasswordError(result.error);
      return;
    }

    await completeAuth();
  }, [completeAuth, identifier, isSubmitting, password]);

  const handleGoogleContinue = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const result = await signInWithGoogle();

    if (!result.success) {
      setIsSubmitting(false);
      if (result.error) setIdentifierError(result.error);
      return;
    }

    await completeAuth();
  }, [completeAuth, isSubmitting]);

  const handleAppleContinue = useCallback(async () => {
    if (isSubmitting) return;

    if (surface === "modal") {
      onAbort();
      window.location.assign(getLoginHrefForReturn(returnUrl, { provider: "apple" }));
      return;
    }

    setIsSubmitting(true);
    const result = await signInWithApple();

    if (!result.success) {
      setIsSubmitting(false);
      if (result.error) setIdentifierError(result.error);
      return;
    }

    await completeAuth();
  }, [completeAuth, isSubmitting, onAbort, returnUrl, surface]);

  const contentProps: AuthFlowContentProps = {
    step,
    signIn: {
      identifier,
      countryCode,
      identifierError,
      emailOnly,
      otpBlockedForCountry,
      showGoogle,
      showApple,
      onIdentifierChange: handleIdentifierChange,
      onCountryCodeChange: handleCountryCodeChange,
      onContinue: handleContinue,
      onGoogleContinue: handleGoogleContinue,
      onAppleContinue: handleAppleContinue,
      onUseEmailInstead: handleUseEmailInstead,
      onClose: handleClose,
    },
    otp: {
      phone: identifier,
      countryCode,
      otp,
      otpError,
      secondsLeft,
      inputRefs,
      onDigitChange: updateDigit,
      onKeyDown: handleKeyDown,
      onBack: handleBackToSignIn,
      onClose: handleClose,
      onEdit: handleBackToSignIn,
      onLogin: handleLogin,
      onResend: handleResend,
    },
    createAccount: {
      fullName,
      email,
      termsAccepted,
      fullNameError,
      emailError,
      termsError,
      onFullNameChange: (value) => {
        setFullName(value);
        setFullNameError(undefined);
      },
      onEmailChange: (value) => {
        setEmail(value);
        setEmailError(undefined);
      },
      onTermsAcceptedChange: (value) => {
        setTermsAccepted(value);
        setTermsError(undefined);
      },
      onBack: handleBackToOtp,
      onClose: handleClose,
      onCreateAccount: handleCreateAccount,
    },
    password: {
      email: identifier,
      password,
      passwordError,
      onPasswordChange: handlePasswordChange,
      onBack: handleBackFromPassword,
      onClose: handleClose,
      onLogin: handlePasswordLogin,
      onCreateAccount: handleGoToEmailCreateAccount,
    },
    emailCreateAccount: {
      email: identifier.trim(),
      fullName,
      password: registerPassword,
      termsAccepted,
      fullNameError,
      emailError,
      passwordError: registerPasswordError,
      termsError,
      onFullNameChange: (value) => {
        setFullName(value);
        setFullNameError(undefined);
      },
      onPasswordChange: (value) => {
        setRegisterPassword(value);
        setRegisterPasswordError(undefined);
      },
      onTermsAcceptedChange: (value) => {
        setTermsAccepted(value);
        setTermsError(undefined);
      },
      onBack: handleBackFromEmailCreateAccount,
      onClose: handleClose,
      onCreateAccount: handleEmailRegister,
    },
  };

  return {
    step,
    contentProps,
    resetState,
  };
}
