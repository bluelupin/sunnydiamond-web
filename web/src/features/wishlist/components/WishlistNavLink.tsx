"use client";

import Link from "next/link";
import WishlistIcon from "@/assets/Icons/WishlistIcon";
import { useRequestAuth } from "@/features/auth/hooks/useRequestAuth";
import { useAuth } from "@/features/auth/context/AuthContext";
import { cn } from "@/shared/utils/cn";

type WishlistNavLinkProps = {
  className?: string;
  onNavigate?: () => void;
  returnUrl?: string;
};

const WishlistNavLink = ({
  className,
  onNavigate,
  returnUrl = "/wishlist",
}: WishlistNavLinkProps) => {
  const { status } = useAuth();
  const { requestAuth } = useRequestAuth();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        aria-label="Sign in to view wishlist"
        className={cn("relative inline-flex", className)}
        onClick={() => {
          onNavigate?.();
          requestAuth({ returnUrl });
        }}
      >
        <WishlistIcon className="size-6" />
      </button>
    );
  }

  return (
    <Link
      href="/wishlist"
      className={cn("relative inline-flex", className)}
      aria-label="Wishlist"
      onClick={onNavigate}
    >
      <WishlistIcon className="size-6" />
    </Link>
  );
};

export default WishlistNavLink;
