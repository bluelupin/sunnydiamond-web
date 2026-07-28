"use client";

import Image from "next/image";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileBespokeItemUi } from "../types/profileUi.types";
import { cn } from "@/shared/utils/cn";

type ProfileBespokeCardProps = {
  item: ProfileBespokeItemUi;
  onRemove: (item: ProfileBespokeItemUi) => void;
};

const overlayVisibility =
  "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100";

export function ProfileBespokeCard({ item, onRemove }: ProfileBespokeCardProps) {
  const content = profileTabsContent.bespoke;

  return (
    <article className="group relative h-[204px] w-full min-w-0 overflow-hidden">
      <Image
        src={item.imageSrc}
        alt={item.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className={cn("absolute inset-0 bg-black/20", overlayVisibility)} aria-hidden />

      <div
        className={cn(
          "absolute left-1/2 top-[161px] -translate-x-1/2",
          overlayVisibility,
        )}
      >
        <button
          type="button"
          onClick={() => onRemove(item)}
          className="flex flex-col items-start border-b border-white pb-1 font-gill text-sm font-normal leading-110 text-white"
          aria-label={`Remove ${item.title}`}
        >
          {content.removeLabel}
        </button>
      </div>
    </article>
  );
}
