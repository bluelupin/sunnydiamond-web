"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { formatLoginPhoneForMagento } from "@/lib/auth/magentoPhone";
import { DEFAULT_COUNTRY_CODE } from "@/shared/constants/appointmentForm";
import { sanitizePhoneInput } from "@/shared/utils/formValidation";
import {
  createCustomerAccount,
  requestLoginOtp,
  verifyLoginOtp,
  type OtpChannel,
  type OtpTarget,
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
  isOtpComplete,
  LOGIN_OTP_LENGTH,
  normalizeLoginPhoneDigits,
  validateCreateAccountForm,
  validateLoginIdentifier,
} from "../utils/authValidation";
import { getLoginHrefForReturn, sanitizeReturnUrl } from "../utils/authNavigation";

/**
 * Sign-in is passwordless: every identifier — mobile or email — leads to a
 * one-time code. There is no password step.
 */
export type AuthFlowStep = "sign-in" | "otp" | "create-account";

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
    channel: OtpChannel;
    maskedDestination: string | null;
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
    emailReadOnly: boolean;
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
  initialIdentifier = "",
  onAbort,
  surface = "standalone",
}: UseAuthFlowOptions) {
  const returnUrl = sanitizeReturnUrl(returnUrlInput);
  const flags = useAuthFeatures();
  const showGoogle = flags.googleLoginEnabled && isGoogleSignInConfigured();
  const showApple = flags.appleLoginEnabled && isAppleSignInConfigured();
  const [requestedStep, setStep] = useState<AuthFlowStep>("sign-in");
  const [identifier, setIdentifier] = useState("");
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY_CODE);
  /** Sticky "Use email instead" choice; survives switching country back to +91, cleared on reset. */
  const [emailModeForced, setEmailModeForced] = useState(false);
  /**
   * The destination a code was actually sent to. Set only on a successful request,
   * and the single source of truth for verify, resend, and registration — so those
   * calls can never disagree with what the customer was told.
   */
  const [otpTarget, setOtpTarget] = useState<OtpTarget | null>(null);
  const [otpChannel, setOtpChannel] = useState<OtpChannel>("sms");
  const [maskedDestination, setMaskedDestination] = useState<string | null>(null);
  const [verifiedCountryCode, setVerifiedCountryCode] = useState<string>(DEFAULT_COUNTRY_CODE);
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

  /**
   * Both post-sign-in steps act on a code that is already in flight, so neither is
   * reachable without a target. Derived rather than corrected in an effect: the
   * transitions already maintain the invariant, and this way an inconsistent
   * state can never be rendered even for one frame.
   */
  const step: AuthFlowStep =
    requestedStep !== "sign-in" && !otpTarget ? "sign-in" : requestedStep;

  // With SMS off, the field accepts email only — there is no other code to send.
  const emailOnly = !flags.otpLoginEnabled || emailModeForced;
  const otpBlockedForCountry =
    !emailOnly && !isEmailIdentifier(identifier) && !isIndianCountryCode(countryCode);
  /** Registering by email: the address was already proven, so it is not editable. */
  const emailIsVerifiedIdentifier = otpTarget?.kind === "email";

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
    setOtpTarget(null);
    setOtpChannel("sms");
    setMaskedDestination(null);
    setVerifiedCountryCode(DEFAULT_COUNTRY_CODE);
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
      return;
    }

    const seeded = initialIdentifier.trim();
    if (!seeded) {
      return;
    }

    // Seed the field only. The customer still has to ask for a code — we cannot
    // send one on their behalf just because we know their address.
    setIdentifier(seeded);
    setIdentifierError(undefined);
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

  /** Which destination the typed identifier resolves to, or null if it is unusable. */
  const buildOtpTarget = useCallback((): OtpTarget | null => {
    if (emailOnly || isEmailIdentifier(identifier)) {
      return { kind: "email", email: identifier.trim().toLowerCase() };
    }

    const phoneDigits = normalizeLoginPhoneDigits(identifier, countryCode);
    return { kind: "phone", phone: formatLoginPhoneForMagento(countryCode, phoneDigits) };
  }, [countryCode, emailOnly, identifier]);

  /** Shared by first send and resend: fire the request, then record what was sent where. */
  const sendOtp = useCallback(
    async (target: OtpTarget): Promise<{ ok: true } | { ok: false; error: string }> => {
      setIsSubmitting(true);
      const result = await requestLoginOtp(target);
      setIsSubmitting(false);

      if (!result.success) {
        return { ok: false, error: result.error };
      }

      cooldownRef.current = result.resendAfterSeconds;
      setOtpTarget(target);
      setOtpChannel(result.channel);
      setMaskedDestination(result.maskedDestination);
      return { ok: true };
    },
    [],
  );

  const handleContinue = useCallback(async () => {
    if (isSubmitting || otpBlockedForCountry) return;
    const validation = validateLoginIdentifier(identifier, countryCode, { emailOnly });

    if (!validation.valid) {
      setIdentifierError(validation.error);
      return;
    }

    const target = buildOtpTarget();
    if (!target) return;

    // Never call the API for a channel Magento has switched off.
    if (target.kind === "email" && !flags.emailOtpLoginEnabled) {
      setIdentifierError("Email sign-in is unavailable right now. Please try another method.");
      return;
    }
    if (target.kind === "phone" && !flags.otpLoginEnabled) {
      setIdentifierError("Mobile sign-in is unavailable right now. Please use your email.");
      return;
    }

    const result = await sendOtp(target);
    if (!result.ok) {
      setIdentifierError(result.error);
      return;
    }

    if (target.kind === "phone") {
      setIdentifier(normalizeLoginPhoneDigits(identifier, countryCode));
      setVerifiedCountryCode(countryCode);
    }
    setIdentifierError(undefined);
    setOtp(Array(LOGIN_OTP_LENGTH).fill(""));
    setOtpError(undefined);
    setStep("otp");
  }, [
    buildOtpTarget,
    countryCode,
    emailOnly,
    flags.emailOtpLoginEnabled,
    flags.otpLoginEnabled,
    identifier,
    isSubmitting,
    otpBlockedForCountry,
    sendOtp,
  ]);

  const handleBackToSignIn = useCallback(() => {
    setStep("sign-in");
    setOtpTarget(null);
    setOtp(Array(LOGIN_OTP_LENGTH).fill(""));
    setOtpError(undefined);
    setSecondsLeft(RESEND_SECONDS);
  }, []);

  const handleBackToOtp = useCallback(() => {
    if (!otpTarget) {
      setStep("sign-in");
      return;
    }
    setStep("otp");
    setFullNameError(undefined);
    setEmailError(undefined);
    setTermsError(undefined);
  }, [otpTarget]);

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
    if (!otpTarget) {
      setStep("sign-in");
      return;
    }

    const result = await sendOtp(otpTarget);
    if (!result.ok) {
      setOtpError(result.error);
      return;
    }

    setOtpError(undefined);
    setSecondsLeft(cooldownRef.current);
    setOtp(Array(LOGIN_OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  }, [isSubmitting, otpError, otpTarget, secondsLeft, sendOtp]);

  const handleLogin = useCallback(async () => {
    if (!isOtpComplete(otp) || isSubmitting) return;
    if (!otpTarget) {
      setStep("sign-in");
      setIdentifierError("Phone number or email is required");
      return;
    }

    setIsSubmitting(true);
    const result = await verifyLoginOtp(otpTarget, otp.join(""));
    setIsSubmitting(false);

    if (!result.success) {
      setOtpError(result.error);
      return;
    }

    setOtpError(undefined);

    if (result.requiresAccountSetup) {
      // Registering by email? The verified address is the account address.
      if (otpTarget.kind === "email") {
        setEmail(otpTarget.email);
      }
      setStep("create-account");
      return;
    }

    setIsSubmitting(true);
    await completeAuth();
  }, [completeAuth, isSubmitting, otp, otpTarget]);

  const handleCreateAccount = useCallback(async () => {
    if (!otpTarget || isSubmitting) return;

    const accountEmail = otpTarget.kind === "email" ? otpTarget.email : email;
    const { valid, errors } = validateCreateAccountForm({
      fullName,
      email: accountEmail,
      termsAccepted,
    });

    setFullNameError(errors.fullName);
    setEmailError(errors.email);
    setTermsError(errors.terms);

    if (!valid) return;

    setIsSubmitting(true);
    const result = await createCustomerAccount({
      target: otpTarget,
      otp: otp.join(""),
      fullName: fullName.trim(),
      email: accountEmail.trim(),
      marketingOptIn: termsAccepted,
    });

    if (!result.success) {
      setIsSubmitting(false);
      setEmailError(result.error);
      return;
    }

    await completeAuth();
  }, [completeAuth, email, fullName, isSubmitting, otp, otpTarget, termsAccepted]);

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
      countryCode: otpChannel === "sms" ? verifiedCountryCode : countryCode,
      channel: otpChannel,
      maskedDestination,
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
      emailReadOnly: emailIsVerifiedIdentifier,
      termsAccepted,
      fullNameError,
      emailError,
      termsError,
      onFullNameChange: (value) => {
        setFullName(value);
        setFullNameError(undefined);
      },
      onEmailChange: (value) => {
        if (emailIsVerifiedIdentifier) return;
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
