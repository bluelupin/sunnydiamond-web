"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { PROFILE_NAV_ITEMS } from "../data/profileSections";
import type { ProfileSectionId } from "../types";

type ProfileSidebarProps = {
  activeSection: ProfileSectionId;
  onSectionChange: (section: ProfileSectionId) => void;
};

const ProfileSidebar = ({ activeSection, onSectionChange }: ProfileSidebarProps) => (
  <nav
    aria-label="Profile sections"
    className="flex w-full max-w-[440px] flex-col border-r border-neutral300 lg:w-[440px]"
  >
    {PROFILE_NAV_ITEMS.map((item) => {
      if (item.kind === "link") {
        return (
          <Link
            key={item.href}
            href={item.href}
            className="px-6 py-6 font-gill text-xl font-light leading-110 text-darkblack transition-colors hover:bg-gray300/60"
          >
            {item.label}
          </Link>
        );
      }

      const isActive = item.id === activeSection;

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onSectionChange(item.id)}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "px-6 py-6 text-left font-gill text-xl leading-110 transition-colors",
            isActive
              ? "border-r-2 border-darkblack bg-gray300 font-normal text-darkblack"
              : "font-light text-darkblack hover:bg-gray300/60",
          )}
        >
          {item.label}
        </button>
      );
    })}
  </nav>
);

export default ProfileSidebar;
