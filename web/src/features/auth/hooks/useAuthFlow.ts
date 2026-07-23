"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { sanitizePhoneInput } from "@/shared/utils/formValidation";
import { createCustomerAccount, requestLoginOtp, verifyLoginOtp } from "../services/auth.service";
import { runPostLoginSync } from "../services/postLoginSync";
import { signInWithApple, signInWithGoogle } from "../services/socialSignIn";
import {
  isLoginIdentifierReadyForOtp,
  isOtpComplete,
  LOGIN_OTP_LENGTH,
  normalizeIndianPhoneDigits,
  validateCreateAccountForm,
  validateLoginIdentifier,
} from "../utils/authValidation";
import { sanitizeReturnUrl } from "../utils/authNavigation";

export type AuthFlowStep = "sign-in" | "otp" | "create-account";

const RESEND_SECONDS = 60;

type UseAuthFlowOptions = {
  active: boolean;
  returnUrl?: string;
  onComplete: (returnUrl: string) => void;
  onAbort: () => void;
};

export type AuthFlowContentProps = {
  step: AuthFlowStep;
  titleClassName?: string;
  signIn: {
    identifier: string;
    identifierError?: string;
    onIdentifierChange: (value: string) => void;
    onContinue: () => void;
    onGoogleContinue: () => void;
    onAppleContinue: () => void;
    onClose: () => void;
  };
  otp: {
    phone: string;
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
};

export function useAuthFlow({
  active,
  returnUrl: returnUrlInput,
  onAbort,
}: UseAuthFlowOptions) {
  const returnUrl = sanitizeReturnUrl(returnUrlInput);
  const [step, setStep] = useState<AuthFlowStep>("sign-in");
  const [identifier, setIdentifier] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [identifierError, setIdentifierError] = useState<string | undefined>();
  const [otp, setOtp] = useState<string[]>(Array(LOGIN_OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState<string | undefined>();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
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

  /** Session cookie is set — sync guest cart/wishlist, then full navigation so providers reboot. */
  const completeAuth = useCallback(async () => {
    await runPostLoginSync();
    window.location.assign(returnUrl);
  }, [returnUrl]);

  const resetState = useCallback(() => {
    setStep("sign-in");
    setIdentifier("");
    setVerifiedPhone("");
    setIdentifierError(undefined);
    setOtp(Array(LOGIN_OTP_LENGTH).fill(""));
    setOtpError(undefined);
    setSecondsLeft(RESEND_SECONDS);
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
    }
  }, [active, resetState]);

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

    if (step === "otp" && !isLoginIdentifierReadyForOtp(identifier)) {
      setStep("sign-in");
    }

    if (step === "create-account" && !verifiedPhone) {
      setStep(isLoginIdentifierReadyForOtp(identifier) ? "otp" : "sign-in");
    }
  }, [active, step, identifier, verifiedPhone]);

  const handleClose = useCallback(() => {
    onAbort();
  }, [onAbort]);

  const handleIdentifierChange = useCallback((value: string) => {
    const nextValue = value.includes("@") ? value : sanitizePhoneInput(value, "+91");
    setIdentifier(nextValue);
    setIdentifierError(undefined);
  }, []);

  const handleContinue = useCallback(async () => {
    if (isSubmitting) return;
    const validation = validateLoginIdentifier(identifier);

    if (!validation.valid) {
      setIdentifierError(validation.error);
      return;
    }

    const phoneDigits = normalizeIndianPhoneDigits(identifier);
    setIsSubmitting(true);
    const result = await requestLoginOtp(phoneDigits);
    setIsSubmitting(false);

    if (!result.success) {
      setIdentifierError(result.error);
      return;
    }

    cooldownRef.current = result.resendAfterSeconds;
    setIdentifier(phoneDigits);
    setIdentifierError(undefined);
    setOtp(Array(LOGIN_OTP_LENGTH).fill(""));
    setOtpError(undefined);
    setStep("otp");
  }, [identifier, isSubmitting]);

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
    if (!isLoginIdentifierReadyForOtp(identifier)) {
      setStep("sign-in");
      return;
    }

    setIsSubmitting(true);
    const result = await requestLoginOtp(normalizeIndianPhoneDigits(identifier));
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
  }, [identifier, isSubmitting, otpError, secondsLeft]);

  const handleLogin = useCallback(async () => {
    if (!isOtpComplete(otp) || isSubmitting) return;
    if (!isLoginIdentifierReadyForOtp(identifier)) {
      setStep("sign-in");
      setIdentifierError("Enter your mobile number to receive an OTP");
      return;
    }

    setIsSubmitting(true);
    const phoneDigits = normalizeIndianPhoneDigits(identifier);
    const result = await verifyLoginOtp(phoneDigits, otp.join(""));
    setIsSubmitting(false);

    if (!result.success) {
      setOtpError(result.error);
      return;
    }

    setOtpError(undefined);
    setVerifiedPhone(phoneDigits);

    if (result.requiresAccountSetup) {
      setStep("create-account");
      return;
    }

    setIsSubmitting(true);
    await completeAuth();
  }, [completeAuth, identifier, isSubmitting, otp]);

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

    setIsSubmitting(true);
    const result = await createCustomerAccount({
      phone: verifiedPhone,
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
  }, [completeAuth, email, fullName, isSubmitting, otp, termsAccepted, verifiedPhone]);

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
    setIsSubmitting(true);
    const result = await signInWithApple();

    if (!result.success) {
      setIsSubmitting(false);
      if (result.error) setIdentifierError(result.error);
      return;
    }

    await completeAuth();
  }, [completeAuth, isSubmitting]);

  const contentProps: AuthFlowContentProps = {
    step,
    signIn: {
      identifier,
      identifierError,
      onIdentifierChange: handleIdentifierChange,
      onContinue: handleContinue,
      onGoogleContinue: handleGoogleContinue,
      onAppleContinue: handleAppleContinue,
      onClose: handleClose,
    },
    otp: {
      phone: identifier,
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
  };

  return {
    step,
    contentProps,
    resetState,
  };
}
