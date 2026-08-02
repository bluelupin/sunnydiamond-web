"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";

type DfeInvestAuthGateProps = {
  children: ReactNode;
};

const DfeInvestAuthGate = ({ children }: DfeInvestAuthGateProps) => {
  const { status } = useAuth();
  const { openLoginModal } = useLoginModal();
  const router = useRouter();
  const pathname = usePathname() ?? "/diamonds-for-everyone/invest";
  const searchParams = useSearchParams();
  const promptedRef = useRef(false);

  const returnUrl = searchParams?.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  useEffect(() => {
    if (status !== "guest" || promptedRef.current) {
      return;
    }

    promptedRef.current = true;
    openLoginModal({ returnUrl });
  }, [openLoginModal, returnUrl, status]);

  useEffect(() => {
    if (status !== "guest") {
      return;
    }

    const handlePopState = () => {
      router.replace("/diamonds-for-everyone");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router, status]);

  if (status === "loading") {
    return (
      <section className="flex min-h-[calc(100dvh-4.5rem-env(safe-area-inset-top,0px))] items-center justify-center bg-gray300 md:landscape:min-h-[calc(100dvh-104px)] lg:landscape:min-h-[calc(100dvh-104px)]">
        <p className="sr-only" aria-live="polite">Loading your investment plan</p>
      </section>
    );
  }

  if (status !== "authenticated") {
    return (
      <section className="flex min-h-[calc(100dvh-4.5rem-env(safe-area-inset-top,0px))] items-center justify-center bg-gray300 md:landscape:min-h-[calc(100dvh-104px)] lg:landscape:min-h-[calc(100dvh-104px)]">
        <p className="font-gill text-base font-light text-neutral500">Sign in to continue</p>
      </section>
    );
  }

  return children;
};

export default DfeInvestAuthGate;
