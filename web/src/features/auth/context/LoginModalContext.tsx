"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { sanitizeReturnUrl } from "../utils/authNavigation";

type OpenLoginModalOptions = {
  returnUrl?: string;
};

type LoginModalContextType = {
  isLoginModalOpen: boolean;
  returnUrl: string;
  openLoginModal: (options?: OpenLoginModalOptions) => void;
  closeLoginModal: () => void;
};

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [returnUrl, setReturnUrl] = useState("/");

  const openLoginModal = useCallback((options?: OpenLoginModalOptions) => {
    setReturnUrl(sanitizeReturnUrl(options?.returnUrl));
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setReturnUrl("/");
  }, []);

  return (
    <LoginModalContext.Provider
      value={{ isLoginModalOpen, returnUrl, openLoginModal, closeLoginModal }}
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
