"use client";

import { cn } from "@/shared/utils/cn";
import { PROFILE_SECTIONS } from "../data/profileSections";
import type { ProfileSectionId } from "../types";

type ProfileSidebarProps = {
  activeSection: ProfileSectionId;
  onSectionChange: (section: ProfileSectionId) => void;
};

const ProfileSidebar = ({ activeSection, onSectionChange }: ProfileSidebarProps) => (
  <nav aria-label="Profile sections" className="flex flex-col gap-1">
    {PROFILE_SECTIONS.map((section) => {
      const isActive = section.id === activeSection;

      return (
        <button
          key={section.id}
          type="button"
          onClick={() => onSectionChange(section.id)}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "rounded-sm px-4 py-3 text-left font-gill text-base leading-110 transition-colors",
            isActive
              ? "bg-white font-normal text-darkblack shadow-[0_1px_0_rgba(0,0,0,0.04)]"
              : "font-light text-neutral500 hover:bg-white/60 hover:text-darkblack",
          )}
        >
          {section.label}
        </button>
      );
    })}
  </nav>
);

export default ProfileSidebar;
