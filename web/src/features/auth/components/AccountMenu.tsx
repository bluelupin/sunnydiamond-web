"use client";

import Link from "next/link";
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

type AccountMenuProps = {
  className?: string;
  onNavigate?: () => void;
  /** Guest destination, e.g. getLoginHref(pathname) so the return URL is preserved. */
  loginHref?: string;
};

/** Header account icon: links to the login page for guests, shows an account dropdown when signed in. */
const AccountMenu = ({ className, onNavigate, loginHref = "/login" }: AccountMenuProps) => {
  const { status, customer, logout } = useAuth();

  if (status !== "authenticated" || !customer) {
    return (
      <Link href={loginHref} aria-label="Sign in" onClick={onNavigate} className={className}>
        <UserIcon className="size-6" />
      </Link>
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
