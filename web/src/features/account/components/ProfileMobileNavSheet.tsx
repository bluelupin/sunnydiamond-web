"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, X } from "lucide-react";
import { Sheet, SheetContent } from "@/shared/ui/sheet";
import { cn } from "@/shared/utils/cn";
import {
  getProfileSectionMobileTitle,
  PROFILE_NAV_ITEMS,
  type ProfileNavItem,
} from "../data/profileSections";
import type { ProfileSectionId } from "../types";

type ProfileMobileNavSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSection: ProfileSectionId;
  onSectionChange: (section: ProfileSectionId) => void;
};

export function ProfileMobileNavSheet({
  open,
  onOpenChange,
  activeSection,
  onSectionChange,
}: ProfileMobileNavSheetProps) {
  const router = useRouter();
  const activeTitle = getProfileSectionMobileTitle(activeSection);

  const handleNavItem = (item: ProfileNavItem) => {
    if (item.kind === "link") {
      onOpenChange(false);
      router.push(item.href);
      return;
    }

    onSectionChange(item.id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        className="max-h-[min(85vh,100%)] w-full max-w-full gap-0 rounded-none border-neutral300 p-0 sm:max-w-full [&>button]:hidden"
      >
        <div className="flex items-center justify-between border-b border-neutral300 px-4 py-5">
          <h2 className="font-larken text-32 font-light leading-110 text-darkblack">{activeTitle}</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-darkblack"
            aria-label="Close profile navigation"
          >
            <X className="size-6" strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <nav aria-label="Profile sections" className="flex flex-col">
          {PROFILE_NAV_ITEMS.map((item) => {
            const isActive = item.kind === "section" && item.id === activeSection;
            const key = item.kind === "link" ? item.href : item.id;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleNavItem(item)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between border-b border-neutral300 px-4 py-5 text-left font-gill text-base leading-110 text-darkblack transition-colors",
                  isActive ? "bg-gray300 font-normal" : "font-light hover:bg-gray300/60",
                )}
              >
                <span>{item.label}</span>
                <ChevronRight className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
              </button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
