"use client";

import Link from "next/link";
import WishlistIcon from "@/assets/Icons/WishlistIcon";
import { cn } from "@/shared/utils/cn";

type WishlistNavLinkProps = {
  className?: string;
  onNavigate?: () => void;
};

const WishlistNavLink = ({ className, onNavigate }: WishlistNavLinkProps) => (
  <Link
    href="/wishlist"
    className={cn("relative inline-flex", className)}
    aria-label="Wishlist"
    onClick={onNavigate}
  >
    <WishlistIcon className="size-6" />
  </Link>
);

export default WishlistNavLink;
