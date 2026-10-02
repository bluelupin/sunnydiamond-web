"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { OtpTarget } from "../services/auth.service";
import { sanitizeReturnUrl } from "../utils/authNavigation";

/** Resume the login modal on "Enter Details" after checkout contact OTP. */
export type AuthCreateAccountResume = {
  target: OtpTarget;
  otp: string;
  fullName?: string;
  email?: string;
  countryCode?: string;
  /** Local phone digits as entered on checkout (phone registration path). */
  phoneDisplay?: string;
};

type OpenLoginModalOptions = {
  returnUrl?: string;
  /** Prefills sign-in when opened from guest checkout email check. */
  identifier?: string;
  createAccountResume?: AuthCreateAccountResume;
};

type LoginModalContextType = {
  isLoginModalOpen: boolean;
  returnUrl: string;
  initialIdentifier: string;
  createAccountResume: AuthCreateAccountResume | null;
  openLoginModal: (options?: OpenLoginModalOptions) => void;
  closeLoginModal: () => void;
};

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [returnUrl, setReturnUrl] = useState("/");
  const [initialIdentifier, setInitialIdentifier] = useState("");
  const [createAccountResume, setCreateAccountResume] = useState<AuthCreateAccountResume | null>(
    null,
  );

  const openLoginModal = useCallback((options?: OpenLoginModalOptions) => {
    setReturnUrl(sanitizeReturnUrl(options?.returnUrl));
    setInitialIdentifier(options?.identifier?.trim() ?? "");
    setCreateAccountResume(options?.createAccountResume ?? null);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setReturnUrl("/");
    setInitialIdentifier("");
    setCreateAccountResume(null);
  }, []);

  return (
    <LoginModalContext.Provider
      value={{
        isLoginModalOpen,
        returnUrl,
        initialIdentifier,
        createAccountResume,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }
  return context;
}
