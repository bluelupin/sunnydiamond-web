"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import BespokeShareVisionPanel from "@/features/bespoke/components/BespokeShareVisionPanel";
import type { NormalizedBespokeCustomDesignForm } from "@/services/bespoke/contact-bespoke-page.types";

type BespokeShareVisionContextValue = {
  openShareVision: () => void;
  closeShareVision: () => void;
  /** True when the custom design form is available (panel can open). */
  canOpenShareVision: boolean;
};

const BespokeShareVisionContext = createContext<BespokeShareVisionContextValue | null>(null);

type BespokeShareVisionProviderProps = {
  form: NormalizedBespokeCustomDesignForm | null;
  children: ReactNode;
};

export function BespokeShareVisionProvider({ form, children }: BespokeShareVisionProviderProps) {
  const [open, setOpen] = useState(false);

  const openShareVision = useCallback(() => {
    if (!form) {
      return;
    }
    setOpen(true);
  }, [form]);

  const closeShareVision = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    (): BespokeShareVisionContextValue => ({
      openShareVision,
      closeShareVision,
      canOpenShareVision: Boolean(form),
    }),
    [closeShareVision, form, openShareVision],
  );

  return (
    <BespokeShareVisionContext.Provider value={value}>
      {children}
      {form ? (
        <BespokeShareVisionPanel open={open} onClose={closeShareVision} form={form} />
      ) : null}
    </BespokeShareVisionContext.Provider>
  );
}

export function useBespokeShareVision(): BespokeShareVisionContextValue {
  const context = useContext(BespokeShareVisionContext);
  if (!context) {
    throw new Error("useBespokeShareVision must be used within BespokeShareVisionProvider");
  }
  return context;
}
