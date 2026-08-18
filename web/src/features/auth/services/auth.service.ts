import { splitProfileFullName } from "@/shared/utils/customerName";

/**
 * What the login code is sent to. Sign-in is passwordless, so this is the whole
 * of the customer's identity until the code comes back verified.
 */
export type OtpTarget =
  | { kind: "phone"; phone: string }
  | { kind: "email"; email: string };

export type OtpChannel = "sms" | "email";

const toRequestBody = (target: OtpTarget): Record<string, unknown> =>
  target.kind === "phone" ? { phone: target.phone } : { email: target.email };

export type RequestOtpResult =
  | {
      success: true;
      resendAfterSeconds: number;
      channel: OtpChannel;
      /** Obfuscated destination for the "we sent a code to…" line, e.g. an****@example.com. */
      maskedDestination: string | null;
    }
  | { success: false; error: string };

export type VerifyOtpResult =
  | { success: true; requiresAccountSetup: boolean }
  | { success: false; error: string };

export type CreateAccountResult = { success: true } | { success: false; error: string };

export type EmailRegisterResult =
  | { success: true; loggedIn: boolean }
  | { success: false; error: string };

async function postJson(
  url: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; data: Record<string, unknown> | null }> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    return { ok: response.ok, data };
  } catch {
    return { ok: false, data: null };
  }
}

export type PasswordLoginResult = { success: true } | { success: false; error: string };

/*
 * Password sign-in and registration below are no longer reachable from the UI —
 * the storefront is passwordless (see the Authentication & Registration Flow
 * document). They are kept as a QA and admin escape hatch: /api/auth/login and
 * /api/auth/register still work for accounts that predate OTP, and for testing
 * when mail delivery is the thing under investigation.
 */

/** Email + password sign in against Magento (native generateCustomerToken). */
export async function loginWithPassword(
  email: string,
  password: string,
): Promise<PasswordLoginResult> {
  const { ok, data } = await postJson("/api/auth/login", { email, password });

  if (!ok || !data?.ok) {
    return {
      success: false,
      error: (data?.error as string) ?? "The email or password is incorrect",
    };
  }

  return { success: true };
}

/**
 * Sends a login OTP by SMS or email. Phone should be E.164 (e.g. +919876543210);
 * the backend normalizes if needed.
 */
export async function requestLoginOtp(target: OtpTarget): Promise<RequestOtpResult> {
  const { ok, data } = await postJson("/api/auth/otp/request", toRequestBody(target));

  if (!ok || !data?.ok) {
    return {
      success: false,
      error: (data?.error as string) ?? "We could not send the code. Please try again.",
    };
  }

  return {
    success: true,
    resendAfterSeconds: (data.resendAfterSeconds as number) ?? 60,
    // Narrowed, not cast: ?? only catches null/undefined, so an empty or
    // unexpected channel would flow through and make the OTP screen render an
    // email address through the phone formatter, which strips it to nothing.
    channel: data.channel === "email" ? "email" : "sms",
    maskedDestination: (data.maskedDestination as string | null) ?? null,
  };
}

/** Verifies the OTP for passwordless sign in against Magento. */
export async function verifyLoginOtp(
  target: OtpTarget,
  code: string,
): Promise<VerifyOtpResult> {
  const { ok, data } = await postJson("/api/auth/otp/verify", {
    ...toRequestBody(target),
    otp: code,
  });

  if (!ok || !data?.ok) {
    return { success: false, error: (data?.error as string) ?? "Incorrect code" };
  }

  return { success: true, requiresAccountSetup: Boolean(data.registrationRequired) };
}

/**
 * Completes first-time registration: re-verifies the same OTP with the details
 * from the "Enter Details" screen, creating the Magento account.
 *
 * Registering by phone sends both identifiers — the phone is what was verified,
 * the email is the address for the new account. Registering by email sends only
 * the email, which is both.
 */
export async function createCustomerAccount(input: {
  target: OtpTarget;
  otp: string;
  fullName: string;
  email: string;
  marketingOptIn: boolean;
}): Promise<CreateAccountResult> {
  const { firstname, lastname } = splitProfileFullName(input.fullName);

  // Kept explicit rather than spread-then-override: for an email target the
  // identifier and the account address are the same field, and a stray second
  // "email" key would silently decide which one Magento sees.
  const identity =
    input.target.kind === "phone"
      ? { phone: input.target.phone, email: input.email }
      : { email: input.target.email };

  const { ok, data } = await postJson("/api/auth/otp/verify", {
    ...identity,
    otp: input.otp,
    firstName: firstname,
    lastName: lastname,
  });

  if (!ok || !data?.ok || data.registrationRequired) {
    return {
      success: false,
      error: (data?.error as string) ?? "We could not create your account. Please try again.",
    };
  }

  if (!data.loggedIn) {
    return {
      success: false,
      error:
        (data?.error as string) ??
        "Your account may have been created, but sign-in failed. Try logging in again.",
    };
  }

  return { success: true };
}

/** Email + password registration via Magento createCustomerV2. */
export async function registerWithEmail(input: {
  fullName: string;
  email: string;
  password: string;
  marketingOptIn?: boolean;
}): Promise<EmailRegisterResult> {
  const { firstname, lastname } = splitProfileFullName(input.fullName);

  const { ok, data } = await postJson("/api/auth/register", {
    firstname,
    lastname,
    email: input.email.trim(),
    password: input.password,
    isSubscribed: Boolean(input.marketingOptIn),
  });

  if (!ok || !data?.ok) {
    return {
      success: false,
      error: (data?.error as string) ?? "We could not create your account. Please try again.",
    };
  }

  if (data.loggedIn) {
    return { success: true, loggedIn: true };
  }

  const login = await loginWithPassword(input.email.trim(), input.password);
  if (login.success) {
    return { success: true, loggedIn: true };
  }

  return {
    success: false,
    error:
      (data.error as string) ??
      "Your account may have been created, but sign-in failed. Try logging in with your email and password.",
  };
}
