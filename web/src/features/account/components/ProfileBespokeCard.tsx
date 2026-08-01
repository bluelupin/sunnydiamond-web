"use client";

import Image from "next/image";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileBespokeItemUi } from "../types/profileUi.types";
import { cn } from "@/shared/utils/cn";

type ProfileBespokeCardProps = {
  item: ProfileBespokeItemUi;
  onOpen: (item: ProfileBespokeItemUi) => void;
  onRemove: (item: ProfileBespokeItemUi) => void;
};

const overlayVisibility =
  "max-lg:opacity-100 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100";

export function ProfileBespokeCard({ item, onOpen, onRemove }: ProfileBespokeCardProps) {
  const content = profileTabsContent.bespoke;

  return (
    <article className="group relative h-[220px] w-full min-w-0 overflow-hidden lg:h-[204px]">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="absolute inset-0 z-0"
        aria-label={`View ${item.title}`}
      >
        <Image
          src={item.imageSrc}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 33vw"
        />
      </button>

      <div className={cn("pointer-events-none absolute inset-0 z-10 bg-black/20", overlayVisibility)} aria-hidden />

      <div
        className={cn(
          "absolute left-1/2 top-[185px] z-20 -translate-x-1/2 lg:top-[161px]",
          overlayVisibility,
        )}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(item);
          }}
          className="flex flex-col items-start border-b border-white pb-1 font-gill text-sm font-normal leading-110 text-white"
          aria-label={`Remove ${item.title}`}
        >
          {content.removeLabel}
        </button>
      </div>
    </article>
  );
}
