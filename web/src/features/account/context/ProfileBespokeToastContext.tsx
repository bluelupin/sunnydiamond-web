"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ProfileBespokeRemovedToastBanner } from "../components/ProfileBespokeRemovedToast";

type BespokeRemovedToastState = {
  onUndo?: () => void | Promise<void>;
};

type ProfileBespokeToastContextValue = {
  toast: BespokeRemovedToastState | null;
  showBespokeRemovedToast: (options: BespokeRemovedToastState) => void;
  dismissBespokeRemovedToast: () => void;
};

const TOAST_DURATION_MS = 8000;

const ProfileBespokeToastContext = createContext<ProfileBespokeToastContextValue | null>(null);

export function ProfileBespokeToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<BespokeRemovedToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissBespokeRemovedToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  const showBespokeRemovedToast = useCallback((options: BespokeRemovedToastState) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast(options);
    timeoutRef.current = setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ProfileBespokeToastContext.Provider
      value={{ toast, showBespokeRemovedToast, dismissBespokeRemovedToast }}
    >
      {children}
      <ProfileBespokeRemovedToastBanner />
    </ProfileBespokeToastContext.Provider>
  );
}

export function useProfileBespokeToast() {
  const context = useContext(ProfileBespokeToastContext);

  if (!context) {
    throw new Error("useProfileBespokeToast must be used within ProfileBespokeToastProvider");
  }

  return context;
}
