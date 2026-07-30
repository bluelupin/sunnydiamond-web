"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserIcon from "@/assets/Icons/UserIcon";
import { AccountAvatarIcon } from "./AccountAvatarIcon";
import { useAuth } from "../context/AuthContext";
import { useRequestAuth } from "../hooks/useRequestAuth";

type AccountMenuProps = {
  className?: string;
  onNavigate?: () => void;
  /** Post-auth return path for guest sign-in. Defaults to the current route. */
  returnUrl?: string;
};

/** Header account icon: opens login for guests, navigates to profile when signed in. */
const AccountMenu = ({ className, onNavigate, returnUrl }: AccountMenuProps) => {
  const pathname = usePathname() ?? "/";
  const { status, customer } = useAuth();
  const { requestAuth } = useRequestAuth();

  if (status !== "authenticated" || !customer) {
    return (
      <button
        type="button"
        aria-label="Sign in"
        onClick={() => {
          onNavigate?.();
          requestAuth({
            returnUrl: returnUrl ?? pathname,
            mode: "page",
          });
        }}
        className={className}
      >
        <UserIcon className="size-6" />
      </button>
    );
  }

  return (
    <Link
      href="/profile"
      aria-label={`My profile, ${customer.firstname}`}
      className={className}
      onClick={onNavigate}
    >
      <AccountAvatarIcon firstName={customer.firstname} />
    </Link>
  );
};

export default AccountMenu;
