"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserIcon from "@/assets/Icons/UserIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useAuth } from "../context/AuthContext";
import { useRequestAuth } from "../hooks/useRequestAuth";

type AccountMenuProps = {
  className?: string;
  onNavigate?: () => void;
  /** Post-auth return path for guest sign-in. Defaults to the current route. */
  returnUrl?: string;
};

/** Header account icon: opens sign-in modal for guests, shows an account dropdown when signed in. */
const AccountMenu = ({ className, onNavigate, returnUrl }: AccountMenuProps) => {
  const pathname = usePathname() ?? "/";
  const { status, customer, logout } = useAuth();
  const { requestAuth } = useRequestAuth();

  if (status !== "authenticated" || !customer) {
    return (
      <button
        type="button"
        aria-label="Sign in"
        onClick={() => {
          onNavigate?.();
          requestAuth({ returnUrl: returnUrl ?? pathname });
        }}
        className={className}
      >
        <UserIcon className="size-6" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`Account, ${customer.firstname}`} className={className}>
        <UserIcon className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48 font-body">
        <DropdownMenuLabel className="font-normal">
          Hi, {customer.firstname}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" onClick={onNavigate}>
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            onNavigate?.();
            void logout();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountMenu;
