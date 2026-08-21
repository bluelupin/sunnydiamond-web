"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { DetailDarkButton } from "./shared";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import { subscribeToStockAlert } from "@/services/customer/stock-alert.client";

type NotifyWhenAvailableButtonProps = {
  /**
   * SKU to watch — the selected variant when one drives the out-of-stock state.
   * Callers key the component by this SKU so a metal/purity switch starts over.
   */
  sku: string;
};

type NotifyPhase = "idle" | "submitting" | "success" | "hidden";

const NotifyWhenAvailableButton = ({ sku }: NotifyWhenAvailableButtonProps) => {
  const { status } = useAuth();
  const { openLoginModal } = useLoginModal();
  const pathname = usePathname() ?? "/";
  const [phase, setPhase] = useState<NotifyPhase>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleNotifyClick = async () => {
    if (phase === "submitting") {
      return;
    }

    // Same unauthenticated-action path as the wishlist toggle: open the login
    // modal and let the shopper retry once signed in.
    if (status !== "authenticated") {
      openLoginModal({ returnUrl: pathname });
      return;
    }

    setPhase("submitting");
    setError(null);

    const result = await subscribeToStockAlert(sku);

    switch (result.status) {
      case "subscribed":
        setPhase("success");
        return;
      case "unauthorized":
        // Cookie present client-side but rejected server-side (expired token).
        setPhase("idle");
        openLoginModal({ returnUrl: pathname });
        return;
      case "unavailable":
        // Backend cannot take alerts (flag off / schema missing) — stop offering it.
        setPhase("hidden");
        return;
      case "error":
        setPhase("idle");
        setError(result.message);
    }
  };

  if (phase === "hidden") {
    return null;
  }

  if (phase === "success") {
    return (
      <div role="status" className="flex flex-1 items-center">
        <p className="font-gill text-base font-light leading-110 text-darkblack">
          We&apos;ll email you when it&apos;s back
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <DetailDarkButton
        className="w-full uppercase disabled:cursor-not-allowed disabled:opacity-50"
        disabled={phase === "submitting"}
        onClick={() => {
          void handleNotifyClick();
        }}
      >
        {phase === "submitting" ? "SENDING..." : "NOTIFY ME WHEN AVAILABLE"}
      </DetailDarkButton>
      {error ? (
        <p className="font-gill text-sm font-light leading-110 text-[#F91616]">{error}</p>
      ) : null}
    </div>
  );
};

export default NotifyWhenAvailableButton;
