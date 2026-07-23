export type SocialSignInResult = { success: true } | { success: false; error: string };

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;

type GoogleAccountsId = {
  initialize: (config: Record<string, unknown>) => void;
  prompt: () => void;
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
    return { success: true };
  } catch {
    return { success: false, error: "Sign-in failed. Please try again." };
  }
}

/**
 * Google Identity Services flow. Resolves after the ID token has been exchanged
 * for a session, or with an error (including "not configured" and prompt dismissal).
 */
export async function signInWithGoogle(): Promise<SocialSignInResult> {
  if (!GOOGLE_CLIENT_ID) {
    return { success: false, error: "Google sign-in is not available yet." };
  }

  try {
    await loadScript("https://accounts.google.com/gsi/client");
  } catch {
    return { success: false, error: "Google sign-in failed to load. Please try again." };
  }

  const googleId = window.google?.accounts.id;
  if (!googleId) {
    return { success: false, error: "Google sign-in failed to load. Please try again." };
  }

  return new Promise<SocialSignInResult>((resolve) => {
    let settled = false;
    const settle = (result: SocialSignInResult) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    googleId.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential?: string }) => {
        if (!response.credential) {
          settle({ success: false, error: "Google sign-in failed. Please try again." });
          return;
        }
        void exchangeIdToken({ provider: "GOOGLE", idToken: response.credential }).then(settle);
      },
      // Fires when the prompt is skipped/dismissed without a credential.
      prompt_parent_id: undefined,
    });
    googleId.prompt();

    // The GIS prompt has no reliable dismissal callback across UX modes;
    // time out quietly so the button doesn't hang forever.
    window.setTimeout(() => settle({ success: false, error: "" }), 90_000);
  });
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
