export type RequestOtpResult =
  | { success: true; resendAfterSeconds: number }
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

/** Sends a login OTP. Phone should be E.164 (e.g. +919876543210); the backend normalizes if needed. */
export async function requestLoginOtp(phone: string): Promise<RequestOtpResult> {
  const { ok, data } = await postJson("/api/auth/otp/request", { phone });

  if (!ok || !data?.ok) {
    return {
      success: false,
      error: (data?.error as string) ?? "We could not send the OTP. Please try again.",
    };
  }

  return { success: true, resendAfterSeconds: (data.resendAfterSeconds as number) ?? 60 };
}

/** Verifies the OTP for phone-based sign in against Magento. */
export async function verifyLoginOtp(phone: string, code: string): Promise<VerifyOtpResult> {
  const { ok, data } = await postJson("/api/auth/otp/verify", { phone, otp: code });

  if (!ok || !data?.ok) {
    return { success: false, error: (data?.error as string) ?? "Incorrect code" };
  }

  return { success: true, requiresAccountSetup: Boolean(data.registrationRequired) };
}

/**
 * Completes first-time registration: re-verifies the same OTP with the
 * customer's details, creating the Magento account with the verified phone.
 */
export async function createCustomerAccount(input: {
  phone: string;
  otp: string;
  fullName: string;
  email: string;
  marketingOptIn: boolean;
}): Promise<CreateAccountResult> {
  const [firstName, ...rest] = input.fullName.trim().split(/\s+/);
  const lastName = rest.join(" ") || "Customer";

  const { ok, data } = await postJson("/api/auth/otp/verify", {
    phone: input.phone,
    otp: input.otp,
    email: input.email,
    firstName,
    lastName,
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
  const [firstName, ...rest] = input.fullName.trim().split(/\s+/);
  const lastName = rest.join(" ") || "Customer";

  const { ok, data } = await postJson("/api/auth/register", {
    firstname: firstName,
    lastname: lastName,
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
