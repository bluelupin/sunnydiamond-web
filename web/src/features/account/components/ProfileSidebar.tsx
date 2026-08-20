"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { PROFILE_NAV_ITEMS } from "../data/profileSections";
import type { ProfileSectionId } from "../types";
import {
  buildProfileSectionHref,
  getCurrentProfileHref,
} from "../utils/profileSectionNavigation";

type ProfileSidebarProps = {
  activeSection: ProfileSectionId;
};

const ProfileSidebar = ({ activeSection }: ProfileSidebarProps) => {
  const searchParams = useSearchParams();
  const currentHref = getCurrentProfileHref(searchParams);

  return (
    <nav
      aria-label="Profile sections"
      className="flex w-full flex-col border-r border-neutral300 bg-white"
    >
      {PROFILE_NAV_ITEMS.map((item) => {
        if (item.kind === "link") {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex w-full items-center p-6 font-gill text-xl font-light leading-110 text-darkblack transition-colors hover:bg-gray300/60"
            >
              {item.label}
            </Link>
          );
        }

        const isActive = item.id === activeSection;
        const href = buildProfileSectionHref(item.id, searchParams);

        return (
          <Link
            key={item.id}
            href={href}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            onClick={(event) => {
              if (href === currentHref) {
                event.preventDefault();
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              }
            }}
            className={cn(
              "flex w-full items-center p-6 font-gill text-xl leading-110 text-darkblack transition-colors",
              isActive
                ? "border-r-2 border-darkblack bg-gray300 font-normal"
                : "font-light hover:bg-gray300/50",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default ProfileSidebar;
