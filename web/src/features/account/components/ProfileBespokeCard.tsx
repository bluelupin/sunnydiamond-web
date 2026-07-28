"use client";

import Image from "next/image";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileBespokeItemUi } from "../types/profileUi.types";
import { cn } from "@/shared/utils/cn";

type ProfileBespokeCardProps = {
  item: ProfileBespokeItemUi;
  onRemove: () => void;
};

const overlayVisibility =
  "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100";

export function ProfileBespokeCard({ item, onRemove }: ProfileBespokeCardProps) {
  const content = profileTabsContent.bespoke;

  return (
    <article className="group relative h-[204px] overflow-hidden">
      <Image
        src={item.imageSrc}
        alt={item.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      <div className={cn("absolute inset-0 bg-black/20", overlayVisibility)} aria-hidden />

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex justify-center pb-3",
          overlayVisibility,
        )}
      >
        <button
          type="button"
          onClick={onRemove}
          className="border-b border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white"
          aria-label={`Remove ${item.title}`}
        >
          {content.removeLabel}
        </button>
      </div>
    </article>
  );
}
