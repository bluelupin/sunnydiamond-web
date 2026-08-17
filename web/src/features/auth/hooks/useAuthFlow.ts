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
  exchangeGoogleCredential,
  isAppleSignInConfigured,
  isGoogleSignInConfigured,
  signInWithApple,
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
    /** No code channel and no social provider is available — nothing here can work. */
    noSignInMethod: boolean;
    showGoogle: boolean;
    showApple: boolean;
    onIdentifierChange: (value: string) => void;
    onCountryCodeChange: (value: string) => void;
    onContinue: () => void;
    onGoogleCredential: (credential: string) => void;
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
    /** Failures that belong to no single field — an expired code, a rejected save. */
    formError?: string;
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
  /** Set only once a code has actually been accepted, which is what the
   *  create-account step depends on — a code merely being in flight is not enough. */
  const [otpVerified, setOtpVerified] = useState(false);
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
  const [createAccountFormError, setCreateAccountFormError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  /** Server-provided resend cooldown; the timer effect reads this on entering the OTP step. */
  const cooldownRef = useRef(RESEND_SECONDS);

  /**
   * Each step states its own precondition, so neither can be rendered — even for
   * one frame — without the thing it acts on. Derived rather than corrected in an
   * effect, and the create-account guard checks the accepted code rather than just
   * a sent one, so the screen cannot be reached without a verification.
   */
  const stepIsReachable =
    requestedStep === "sign-in"
    || (requestedStep === "otp" && otpTarget !== null)
    || (requestedStep === "create-account" && otpTarget !== null && otpVerified);
  const step: AuthFlowStep = stepIsReachable ? requestedStep : "sign-in";

  // With SMS off, the field accepts email only — there is no other code to send.
  const emailOnly = !flags.otpLoginEnabled || emailModeForced;
  const otpBlockedForCountry =
    !emailOnly && !isEmailIdentifier(identifier) && !isIndianCountryCode(countryCode);
  /** Registering by email: the address was already proven, so it is not editable. */
  const emailIsVerifiedIdentifier = otpTarget?.kind === "email";
  /**
   * Every channel is off — which is also the fail-closed state when the flag fetch
   * errors. Without this the form would look usable and could only ever produce an
   * error, with the social buttons hidden by the same flags.
   */
  const noSignInMethod =
    !flags.otpLoginEnabled && !flags.emailOtpLoginEnabled && !showGoogle && !showApple;

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
    setOtpVerified(false);
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
    setCreateAccountFormError(undefined);
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
      setOtpVerified(false);
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
    // Clear what was sent and where together: leaving the channel or the masked
    // address behind would let a later screen describe the wrong destination.
    setOtpTarget(null);
    setOtpChannel("sms");
    setMaskedDestination(null);
    setOtpVerified(false);
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
    setOtpVerified(true);

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
    setCreateAccountFormError(undefined);

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
      // Not setEmailError: on the email path that field is read-only, so an
      // expired-code message would land on an input the customer cannot act on.
      setCreateAccountFormError(result.error);
      return;
    }

    await completeAuth();
  }, [completeAuth, email, fullName, isSubmitting, otp, otpTarget, termsAccepted]);

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      const result = await exchangeGoogleCredential(credential);

      if (!result.success) {
        setIsSubmitting(false);
        if (result.error) setIdentifierError(result.error);
        return;
      }

      await completeAuth();
    },
    [completeAuth, isSubmitting],
  );

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
      noSignInMethod,
      showGoogle,
      showApple,
      onIdentifierChange: handleIdentifierChange,
      onCountryCodeChange: handleCountryCodeChange,
      onContinue: handleContinue,
      onGoogleCredential: handleGoogleCredential,
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
      formError: createAccountFormError,
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
