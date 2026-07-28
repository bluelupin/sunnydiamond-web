"use client";

import { ChevronDown } from "lucide-react";

type ProfileMobileSectionHeaderProps = {
  title: string;
  onOpenNav: () => void;
};

export function ProfileMobileSectionHeader({
  title,
  onOpenNav,
}: ProfileMobileSectionHeaderProps) {
  return (
    <button
      type="button"
      onClick={onOpenNav}
      className="mb-6 flex w-full items-center justify-between gap-4 text-left lg:hidden"
      aria-haspopup="dialog"
    >
      <h1 className="font-larken text-32 font-light leading-110 text-darkblack">{title}</h1>
      <ChevronDown className="size-6 shrink-0 text-darkblack" strokeWidth={1.5} aria-hidden />
    </button>
  );
}
