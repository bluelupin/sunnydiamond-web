"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import {
  resolveShellHeaderNavigationLinks,
  resolveWorldOfSunnyNavItems,
  type WorldOfSunnyNavItem,
} from "@/shared/data/worldOfSunnyNav";
import { cn } from "@/shared/utils/cn";

type WorldOfSunnyNavVariant = "desktop" | "mobile";

type WorldOfSunnyCategoryMenuProps = {
  variant: WorldOfSunnyNavVariant;
  onClose: () => void;
  className?: string;
};

function shouldOpenCtaInNewTab(item: WorldOfSunnyNavItem): boolean {
  if (item.cta.openInNewTab) return true;
  const targetType = item.cta.targetType?.trim().toLowerCase();
  return targetType === "external" || targetType === "_blank";
}

function resolveCardImageSrc(item: WorldOfSunnyNavItem): string | undefined {
  return item.image.desktopImageUrl ?? item.image.mobileImageUrl;
}

function WorldOfSunnyNavCard({
  item,
  imageClassName,
  imageSizes,
  labelClassName,
  itemClassName,
  imageCoverClassName,
  onClose,
}: {
  item: WorldOfSunnyNavItem;
  imageClassName: string;
  imageSizes: string;
  labelClassName: string;
  itemClassName: string;
  imageCoverClassName: string;
  onClose: () => void;
}) {
  const imageSrc = resolveCardImageSrc(item);
  const openInNewTab = shouldOpenCtaInNewTab(item);
  const imageAlt = item.image.alt?.trim() || item.cta.label;

  return (
    <Link
      href={item.cta.url}
      onClick={onClose}
      className={itemClassName}
      {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <div className={imageClassName}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={imageCoverClassName}
            sizes={imageSizes}
          />
        ) : null}
      </div>
      <span className={labelClassName}>{item.cta.label}</span>
    </Link>
  );
}

export function WorldOfSunnyCategoryMenu({
  variant,
  onClose,
  className,
}: WorldOfSunnyCategoryMenuProps) {
  const { data: shellData } = useHomepageShell();
  const items = useMemo(
    () => resolveWorldOfSunnyNavItems(resolveShellHeaderNavigationLinks(shellData)),
    [shellData],
  );

  if (!items.length) {
    return null;
  }

  if (variant === "desktop") {
    return (
      <div className={cn("flex items-center justify-center gap-3", className)}>
        {items.map((item, index) => (
          <WorldOfSunnyNavCard
            key={item.id}
            item={item}
            itemClassName="group flex flex-col md:gap-2 gap-1"
            imageClassName="relative lg:w-[291px] md:w-[200px] w-[166px] lg:h-[204px] md:h-[160px] h-[104px] shrink-0 overflow-hidden"
            imageSizes="(max-width: 1440px) 25vw, 300px"
            imageCoverClassName={cn(
              index === 2 ? "object-bottom" : "object-top",
              "object-cover transition-transform duration-300 group-hover:scale-105",
            )}
            labelClassName="font-gill lg:text-xl md:text-lg text-sm leading-110 text-darkblack transition-opacity group-hover:opacity-80"
            onClose={onClose}
          />
        ))}
      </div>
    );
  }

  const [first, second, third] = items;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {first && second ? (
        <div className="flex items-stretch gap-3">
          {[first, second].map((item) => (
            <WorldOfSunnyNavCard
              key={item.id}
              item={item}
              itemClassName="flex min-w-0 flex-1 flex-col gap-1"
              imageClassName="relative h-[104px] w-full shrink-0 overflow-hidden"
              imageSizes="50vw"
              imageCoverClassName="object-cover"
              labelClassName="font-gill text-sm leading-110 text-darkblack"
              onClose={onClose}
            />
          ))}
        </div>
      ) : null}
      {third ? (
        <WorldOfSunnyNavCard
          item={third}
          itemClassName="flex w-full max-w-[calc(50%-6px)] flex-col gap-1"
          imageClassName="relative h-[104px] w-full shrink-0 overflow-hidden"
          imageSizes="50vw"
          imageCoverClassName="object-cover object-[center_20%]"
          labelClassName="font-gill text-sm leading-110 text-darkblack"
          onClose={onClose}
        />
      ) : null}
    </div>
  );
}
