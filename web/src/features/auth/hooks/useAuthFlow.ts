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
  applyOtpInput,
  isOtpComplete,
  LOGIN_OTP_LENGTH,
  normalizeLoginPhoneDigits,
  validateCreateAccountForm,
  validateLoginIdentifier,
} from "../utils/authValidation";
import { getLoginHrefForReturn, getPostSignupReturnUrl, sanitizeReturnUrl } from "../utils/authNavigation";
import { setAuthLoginIdentifierKind } from "../utils/authLoginIdentifier";
import type { AuthCreateAccountResume } from "../context/LoginModalContext";
import {
  isRegistrationSessionExpiredError,
  REGISTRATION_SESSION_EXPIRED_MESSAGE,
} from "@/services/auth/authErrorMessages";

/**
 * Sign-in is passwordless: every identifier — mobile or email — leads to a
 * one-time code. There is no password step.
 */
export type AuthFlowStep = "sign-in" | "otp" | "create-account";

const RESEND_SECONDS = 60;
const REGISTRATION_SESSION_REFRESH_SECONDS = 5;

type UseAuthFlowOptions = {
  active: boolean;
  returnUrl?: string;
  initialIdentifier?: string;
  createAccountResume?: AuthCreateAccountResume | null;
  onComplete: (returnUrl: string) => void;
  onAbort: () => void;
  surface?: "modal" | "standalone";
  /** Guest checkout create-account: reopen checkout OTP instead of in-modal OTP. */
  onCheckoutRegistrationSessionExpired?: () => boolean;
};

function otpCodeToDigitArray(code: string): string[] {
  const chars = code.replace(/\D/g, "").slice(0, LOGIN_OTP_LENGTH).split("");
  return Array.from({ length: LOGIN_OTP_LENGTH }, (_, index) => chars[index] ?? "");
}

export type AuthFlowContentProps = {
  step: AuthFlowStep;
  titleClassName?: string;
  signIn: {
    identifier: string;
    countryCode: string;
    identifierError?: string;
    emailOnly: boolean;
    otpBlockedForCountry: boolean;
    otpCountryCodes: readonly string[];
    offerEmailFallback: boolean;
    /** No code channel and no social provider is available — nothing here can work. */
    noSignInMethod: boolean;
    showGoogle: boolean;
    showApple: boolean;
    submitting: boolean;
    identifierInputRef: RefObject<HTMLInputElement | null>;
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
    submitting: boolean;
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
    missingIdentifier: "email" | "phone";
    phone: string;
    countryCode: string;
    otpCountryCodes: readonly string[];
    termsAccepted: boolean;
    marketingOptIn: boolean;
    fullNameError?: string;
    emailError?: string;
    phoneError?: string;
    termsError?: string;
    /** Failures that belong to no single field — an expired code, a rejected save. */
    formError?: string;
    /** Countdown before a full page refresh after registration session expiry. */
    registrationSessionRefreshSeconds?: number | null;
    submitting: boolean;
    onFullNameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    onCountryCodeChange: (value: string) => void;
    onTermsAcceptedChange: (value: boolean) => void;
    onMarketingOptInChange: (value: boolean) => void;
    onBack: () => void;
    onClose: () => void;
    onCreateAccount: () => void;
  };
};


export function useAuthFlow({
  active,
  returnUrl: returnUrlInput,
  initialIdentifier = "",
  createAccountResume = null,
  onAbort,
  onCheckoutRegistrationSessionExpired,
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
  /** The last SMS request failed; cleared when the number or country changes. */
  const [smsSendFailed, setSmsSendFailed] = useState(false);
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
  const [createAccountPhone, setCreateAccountPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [fullNameError, setFullNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [termsError, setTermsError] = useState<string | undefined>();
  const [createAccountFormError, setCreateAccountFormError] = useState<string | undefined>();
  const [registrationSessionRefreshSeconds, setRegistrationSessionRefreshSeconds] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const identifierInputRef = useRef<HTMLInputElement | null>(null);
  /** Focus the identifier only on a return to the step — an initial render must
   *  not steal focus (or pop the keyboard on mobile) on the standalone page. */
  const hasLeftSignIn = useRef(false);
  /** Synchronous guard for create-account reachability right after OTP acceptance. */
  const otpAcceptedForRegistrationRef = useRef(false);
  const resumeAppliedKeyRef = useRef<string | null>(null);
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
    || (requestedStep === "create-account"
      && otpTarget !== null
      && (otpVerified || otpAcceptedForRegistrationRef.current));
  const step: AuthFlowStep = stepIsReachable ? requestedStep : "sign-in";

  // With SMS off, the field accepts email only — there is no other code to send.
  const emailOnly = !flags.otpLoginEnabled || emailModeForced;
  const otpBlockedForCountry =
    !emailOnly
    && !isEmailIdentifier(identifier)
    && !flags.otpCountryCodes.includes(countryCode);
  const offerEmailFallback = smsSendFailed && !emailOnly && flags.emailOtpLoginEnabled;
  /** Sign-in channel — create-account collects the other identifier (email ↔ phone). */
  const createAccountMissingIdentifier: "email" | "phone" =
    otpTarget?.kind === "email" ? "phone" : "email";
  /**
   * Every channel is off — which is also the fail-closed state when the flag fetch
   * errors. Without this the form would look usable and could only ever produce an
   * error, with the social buttons hidden by the same flags.
   */
  const noSignInMethod =
    !flags.otpLoginEnabled && !flags.emailOtpLoginEnabled && !showGoogle && !showApple;

  /**
   * Session cookie is set — sync guest cart/wishlist, then full navigation so providers reboot.
   *
   * Standalone only: replace, not assign. /login must not stay in history — a pushed entry
   * sends Back there, and because this is a document navigation the browser restores it from
   * bfcache with its state intact (otpVerified still true), reopening the completed step.
   * The modal has no entry of its own: it sits on a real content page, so replacing would
   * delete the page the customer signed in from (cart, a DFE landing page) instead.
   */
  const completeAuth = useCallback(
    async (destination: string = returnUrl) => {
      await runPostLoginSync();

      if (surface === "standalone") {
        window.location.replace(destination);
        return;
      }

      window.location.assign(destination);
    },
    [returnUrl, surface],
  );

  const resetState = useCallback(() => {
    setStep("sign-in");
    setIdentifier("");
    setCountryCode(DEFAULT_COUNTRY_CODE);
    setEmailModeForced(false);
    setSmsSendFailed(false);
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
    setCreateAccountPhone("");
    setTermsAccepted(false);
    setMarketingOptIn(false);
    setFullNameError(undefined);
    setEmailError(undefined);
    setPhoneError(undefined);
    setTermsError(undefined);
    setCreateAccountFormError(undefined);
    setRegistrationSessionRefreshSeconds(null);
    setIsSubmitting(false);
    hasLeftSignIn.current = false;
    otpAcceptedForRegistrationRef.current = false;
    resumeAppliedKeyRef.current = null;
  }, []);

  useEffect(() => {
    if (!active) {
      resetState();
      return;
    }

    const seeded = initialIdentifier.trim();
    if (!seeded || createAccountResume) {
      return;
    }

    // Seed the field only. The customer still has to ask for a code — we cannot
    // send one on their behalf just because we know their address.
    setIdentifier(seeded);
    setIdentifierError(undefined);
  }, [active, createAccountResume, initialIdentifier, resetState]);

  useEffect(() => {
    if (!active || !createAccountResume) {
      return;
    }

    const resumeKey = `${createAccountResume.target.kind}:${createAccountResume.otp}`;
    if (resumeAppliedKeyRef.current === resumeKey) {
      return;
    }
    resumeAppliedKeyRef.current = resumeKey;

    const {
      target,
      otp: otpCode,
      fullName: seededName,
      email: seededEmail,
      countryCode: seededCountry,
      phoneDisplay,
    } = createAccountResume;

    otpAcceptedForRegistrationRef.current = true;
    setOtpTarget(target);
    setOtpVerified(true);
    setOtp(otpCodeToDigitArray(otpCode));
    setOtpError(undefined);
    setOtpChannel(target.kind === "email" ? "email" : "sms");

    if (target.kind === "email") {
      setIdentifier(target.email);
      setEmail(target.email);
    } else {
      const cc = seededCountry ?? DEFAULT_COUNTRY_CODE;
      setCountryCode(cc);
      setVerifiedCountryCode(cc);
      setIdentifier(phoneDisplay ?? target.phone.replace(/\D/g, ""));
      if (seededEmail) {
        setEmail(seededEmail);
      }
    }

    if (seededName?.trim()) {
      setFullName(seededName.trim());
    }

    setStep("create-account");
  }, [active, createAccountResume]);

  /**
   * Back onto /login restores it from bfcache with the state it was left in — a completed
   * create-account step, verification and all. Reset on restore so a finished registration
   * can never be reopened out of history.
   *
   * Standalone only. The modal is restored on top of an ordinary page and can carry a
   * seeded identifier (checkout hands it the email it just recognised); the seeding effect
   * does not re-run on a bfcache restore, so resetting there would just blank the field.
   */
  useEffect(() => {
    if (surface !== "standalone") {
      return;
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        resetState();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [resetState, surface]);

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
    if (step !== "sign-in") hasLeftSignIn.current = true;
  }, [step]);

  useEffect(() => {
    if (!active || step !== "sign-in" || !hasLeftSignIn.current) return;
    identifierInputRef.current?.focus();
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
      setSmsSendFailed(false);
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
      setSmsSendFailed(false);
    },
    [identifier],
  );

  const handleUseEmailInstead = useCallback(() => {
    setEmailModeForced(true);
    setSmsSendFailed(false);
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
      setSmsSendFailed(false);
      setOtpTarget(target);
      setOtpChannel(result.channel);
      setMaskedDestination(result.maskedDestination);
      setOtpVerified(false);
      return { ok: true };
    },
    [],
  );

  const recoverRegistrationSession = useCallback(async () => {
    setRegistrationSessionRefreshSeconds(null);
    setCreateAccountFormError(undefined);
    otpAcceptedForRegistrationRef.current = false;
    setOtpVerified(false);
    setOtp(Array(LOGIN_OTP_LENGTH).fill(""));
    setOtpError(undefined);

    if (onCheckoutRegistrationSessionExpired?.()) {
      return;
    }

    if (!otpTarget) {
      setStep("sign-in");
      return;
    }

    setStep("otp");
    const result = await sendOtp(otpTarget);
    if (!result.ok) {
      setOtpError(result.error);
      return;
    }

    setSecondsLeft(cooldownRef.current);
    inputRefs.current[0]?.focus();
  }, [onCheckoutRegistrationSessionExpired, otpTarget, sendOtp]);

  useEffect(() => {
    if (registrationSessionRefreshSeconds === null) {
      return;
    }

    if (registrationSessionRefreshSeconds <= 0) {
      void recoverRegistrationSession();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRegistrationSessionRefreshSeconds((current) =>
        current === null ? null : current - 1,
      );
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [recoverRegistrationSession, registrationSessionRefreshSeconds]);

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
      // Offered for numbers abroad (IN-6), where the email code is the realistic way in.
      setSmsSendFailed(target.kind === "phone" && countryCode !== "+91");
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

  const updateDigit = useCallback((index: number, value: string) => {
    setOtpError(undefined);
    setOtp((prev) => {
      const { next, focusIndex } = applyOtpInput(prev, index, value, LOGIN_OTP_LENGTH);
      queueMicrotask(() => {
        inputRefs.current[focusIndex]?.focus();
      });
      return next;
    });
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
    // The cooldown holds even after an invalid attempt: resending inside it makes
    // Magento suppress the send and return the REMAINING seconds of the existing
    // code, which the client would misread as a fresh timer (QA bug #15).
    if (secondsLeft > 0 || isSubmitting) return;
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
  }, [isSubmitting, otpTarget, secondsLeft, sendOtp]);

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
    otpAcceptedForRegistrationRef.current = true;
    setOtpVerified(true);

    if (result.requiresAccountSetup) {
      // Registering by email? The verified address is the account address.
      if (otpTarget.kind === "email") {
        setEmail(otpTarget.email);
      }
      setStep("create-account");
      return;
    }

    otpAcceptedForRegistrationRef.current = false;

    setAuthLoginIdentifierKind(otpTarget.kind === "email" ? "email" : "phone");
    setIsSubmitting(true);
    await completeAuth();
  }, [completeAuth, isSubmitting, otp, otpTarget]);

  const handleCreateAccount = useCallback(async () => {
    if (!otpTarget || isSubmitting) return;

    const missingIdentifier = otpTarget.kind === "email" ? "phone" : "email";
    const accountEmail = otpTarget.kind === "email" ? otpTarget.email : email;
    const { valid, errors } = validateCreateAccountForm({
      fullName,
      termsAccepted,
      secondaryField: missingIdentifier,
      email: missingIdentifier === "email" ? email : "",
      phone: missingIdentifier === "phone" ? createAccountPhone : "",
      countryCode,
    });

    setFullNameError(errors.fullName);
    setEmailError(errors.email);
    setPhoneError(errors.phone);
    setTermsError(errors.terms);
    setCreateAccountFormError(undefined);

    if (!valid) return;

    setIsSubmitting(true);
    const supplementalPhone =
      otpTarget.kind === "email" && createAccountPhone.trim()
        ? formatLoginPhoneForMagento(
            countryCode,
            normalizeLoginPhoneDigits(createAccountPhone, countryCode),
          )
        : undefined;

    const result = await createCustomerAccount({
      target: otpTarget,
      otp: otp.join(""),
      fullName: fullName.trim(),
      email: accountEmail.trim(),
      phone: supplementalPhone,
      marketingOptIn,
    });

    if (!result.success) {
      setIsSubmitting(false);
      if (isRegistrationSessionExpiredError(result.error)) {
        setCreateAccountFormError(REGISTRATION_SESSION_EXPIRED_MESSAGE);
        setRegistrationSessionRefreshSeconds(REGISTRATION_SESSION_REFRESH_SECONDS);
        return;
      }
      // Not setEmailError: on the email path that field is read-only, so an
      // expired-code message would land on an input the customer cannot act on.
      setCreateAccountFormError(result.error);
      return;
    }

    setAuthLoginIdentifierKind(otpTarget.kind === "email" ? "email" : "phone");
    await completeAuth(getPostSignupReturnUrl(returnUrl));
  }, [
    completeAuth,
    countryCode,
    createAccountPhone,
    email,
    fullName,
    isSubmitting,
    marketingOptIn,
    otp,
    otpTarget,
    returnUrl,
    termsAccepted,
  ]);

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

      setAuthLoginIdentifierKind("email");
      await completeAuth(result.customerCreated ? getPostSignupReturnUrl(returnUrl) : returnUrl);
    },
    [completeAuth, isSubmitting, returnUrl],
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

    setAuthLoginIdentifierKind("email");
    await completeAuth(result.customerCreated ? getPostSignupReturnUrl(returnUrl) : returnUrl);
  }, [completeAuth, isSubmitting, onAbort, returnUrl, surface]);

  const contentProps: AuthFlowContentProps = {
    step,
    signIn: {
      identifier,
      countryCode,
      identifierError,
      emailOnly,
      otpBlockedForCountry,
      otpCountryCodes: flags.otpCountryCodes,
      offerEmailFallback,
      noSignInMethod,
      showGoogle,
      showApple,
      submitting: isSubmitting,
      identifierInputRef,
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
      submitting: isSubmitting,
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
      missingIdentifier: createAccountMissingIdentifier,
      phone: createAccountPhone,
      countryCode,
      otpCountryCodes: flags.otpCountryCodes,
      termsAccepted,
      marketingOptIn,
      fullNameError,
      emailError,
      phoneError,
      termsError,
      formError: createAccountFormError,
      registrationSessionRefreshSeconds,
      submitting: isSubmitting,
      onFullNameChange: (value) => {
        setFullName(value);
        setFullNameError(undefined);
      },
      onEmailChange: (value) => {
        setEmail(value);
        setEmailError(undefined);
      },
      onPhoneChange: (value) => {
        setCreateAccountPhone(value);
        setPhoneError(undefined);
      },
      onCountryCodeChange: (value) => {
        setCountryCode(value);
        setPhoneError(undefined);
      },
      onTermsAcceptedChange: (value) => {
        setTermsAccepted(value);
        setTermsError(undefined);
      },
      onMarketingOptInChange: setMarketingOptIn,
      onBack: handleBackToSignIn,
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
