"use client";

import Image from "next/image";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import { DetailTextLink } from "@/features/products/components/detail/shared";
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
    <article className="group relative h-[220px] w-full min-w-0 overflow-hidden md:h-[276px]">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="absolute inset-0 z-0"
        aria-label={`View ${item.title}`}
      >
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gray300">
            <RingsTabIcon className="size-16 text-darkblack" />
          </div>
        )}
      </button>

      <div className={cn("pointer-events-none absolute inset-0 z-10 bg-black/20", overlayVisibility)} aria-hidden />

      <div
        className={cn(
          "absolute left-1/2 md:bottom-6 bottom-4 z-20 -translate-x-1/2",
          overlayVisibility,
        )}
      >
        <DetailTextLink
          light
          onClick={() => onRemove(item)}
          className="pointer-events-auto uppercase"
        >
          {content.removeLabel}
        </DetailTextLink>
      </div>
    </article>
  );
}
