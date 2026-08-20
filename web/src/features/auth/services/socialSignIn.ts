export type SocialSignInResult =
  | { success: true; customerCreated: boolean }
  | { success: false; error: string };

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;

type GoogleAccountsId = {
  initialize: (config: Record<string, unknown>) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
};

type AppleSignInResponse = {
  authorization: { id_token: string };
  user?: { name?: { firstName?: string; lastName?: string } };
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
    AppleID?: {
      auth: {
        init: (config: Record<string, unknown>) => void;
        signIn: () => Promise<AppleSignInResponse>;
      };
    };
  }
}

const scriptPromises = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const existing = scriptPromises.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromises.delete(src);
      reject(new Error(`Failed to load ${src}`));
    };
    document.head.appendChild(script);
  });
  scriptPromises.set(src, promise);
  return promise;
}

async function exchangeIdToken(body: Record<string, unknown>): Promise<SocialSignInResult> {
  try {
    const response = await fetch("/api/auth/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      return { success: false, error: data?.error ?? "Sign-in failed. Please try again." };
    }
    const data = (await response.json().catch(() => null)) as {
      customerCreated?: boolean;
    } | null;
    return { success: true, customerCreated: Boolean(data?.customerCreated) };
  } catch {
    return { success: false, error: "Sign-in failed. Please try again." };
  }
}

export function isGoogleSignInConfigured(): boolean {
  return Boolean(GOOGLE_CLIENT_ID);
}

export function isAppleSignInConfigured(): boolean {
  return Boolean(APPLE_CLIENT_ID);
}

/**
 * Google's rendered button has a fixed maximum width; GoogleSignInButton draws it
 * at that width and scales the result over the storefront button.
 */
export const GOOGLE_BUTTON_RENDER_WIDTH = 400;

/**
 * Google keeps a single callback per client, so every mounted button routes
 * through one dispatcher and the live one registers itself here.
 */
let googleCredentialHandler: ((credential: string) => void) | null = null;
let googleInitialized = false;

async function loadGoogleIdentityServices(): Promise<GoogleAccountsId | null> {
  if (!GOOGLE_CLIENT_ID) return null;

  try {
    await loadScript("https://accounts.google.com/gsi/client");
  } catch {
    return null;
  }

  const googleId = window.google?.accounts.id;
  if (!googleId) return null;

  if (!googleInitialized) {
    googleId.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential?: string }) => {
        if (response.credential) googleCredentialHandler?.(response.credential);
      },
      // Never sign someone in from a stored session without them asking.
      auto_select: false,
    });
    googleInitialized = true;
  }

  return googleId;
}

/**
 * Mounts Google's own button inside `container` — the only supported way to get
 * an ID token from a click.
 *
 * The alternative, One Tap via `prompt()`, cannot back a button: under FedCM it
 * displays nothing at all for a visitor with no active Google session, and the
 * callbacks that used to report why are no longer invoked, so the click has
 * nothing to show and nothing to report.
 *
 * @returns false when Google's script is unavailable (blocked, offline, or no
 *          client ID configured), so the caller can drop the button entirely
 *          rather than leave a control that cannot work.
 */
export async function renderGoogleSignInButton(
  container: HTMLElement,
  onCredential: (credential: string) => void,
): Promise<boolean> {
  const googleId = await loadGoogleIdentityServices();
  if (!googleId) return false;

  googleCredentialHandler = onCredential;
  container.replaceChildren();
  googleId.renderButton(container, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    width: GOOGLE_BUTTON_RENDER_WIDTH,
  });

  return true;
}

/** Exchanges a Google ID token for a storefront session. */
export function exchangeGoogleCredential(credential: string): Promise<SocialSignInResult> {
  return exchangeIdToken({ provider: "GOOGLE", idToken: credential });
}

/** Sign in with Apple popup flow. Nonce is verified server-side against the token. */
export async function signInWithApple(): Promise<SocialSignInResult> {
  if (!APPLE_CLIENT_ID) {
    return { success: false, error: "Apple sign-in is not available yet." };
  }

  try {
    await loadScript(
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
    );
  } catch {
    return { success: false, error: "Apple sign-in failed to load. Please try again." };
  }

  const appleId = window.AppleID;
  if (!appleId) {
    return { success: false, error: "Apple sign-in failed to load. Please try again." };
  }

  const nonce = crypto.randomUUID();

  try {
    appleId.auth.init({
      clientId: APPLE_CLIENT_ID,
      scope: "name email",
      redirectURI: APPLE_REDIRECT_URI ?? `${window.location.origin}/login`,
      usePopup: true,
      nonce,
    });
    const response = await appleId.auth.signIn();

    return exchangeIdToken({
      provider: "APPLE",
      idToken: response.authorization.id_token,
      nonce,
      // Apple returns the name only on the FIRST authorization — forward it.
      firstName: response.user?.name?.firstName,
      lastName: response.user?.name?.lastName,
    });
  } catch {
    // User closed the popup.
    return { success: false, error: "" };
  }
}
