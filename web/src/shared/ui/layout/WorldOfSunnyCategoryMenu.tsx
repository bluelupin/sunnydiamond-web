"use client";

import Image from "next/image";
import Link from "next/link";
import { WORLD_OF_SUNNY_NAV_ITEMS } from "@/shared/data/worldOfSunnyNav";
import { cn } from "@/shared/utils/cn";

type WorldOfSunnyNavVariant = "desktop" | "mobile";

type WorldOfSunnyCategoryMenuProps = {
  variant: WorldOfSunnyNavVariant;
  onClose: () => void;
  className?: string;
};
function WorldOfSunnyNavCard({
  item,
  imageClassName,
  imageSizes,
  labelClassName,
  itemClassName,
  imageCoverClassName,
  onClose,
}: {
  item: (typeof WORLD_OF_SUNNY_NAV_ITEMS)[number];
  imageClassName: string;
  imageSizes: string;
  labelClassName: string;
  itemClassName: string;
  imageCoverClassName: string;
  onClose: () => void;
}) {
  return (
    <Link href={item.href} onClick={onClose} className={itemClassName}>
      <div className={imageClassName}>
        <Image
          src={item.imageSrc}
          alt=""
          fill
          className={imageCoverClassName}
          sizes={imageSizes}
        />
      </div>
      <span className={labelClassName}>{item.label}</span>
    </Link>
  );
}

export function WorldOfSunnyCategoryMenu({
  variant,
  onClose,
  className,
}: WorldOfSunnyCategoryMenuProps) {
  if (variant === "desktop") {
    return (
      <div className={cn("flex items-center justify-center gap-3", className)}>
        {WORLD_OF_SUNNY_NAV_ITEMS.map((item, index) => (
          <WorldOfSunnyNavCard
            key={item.id}
            item={item}
            itemClassName="group flex flex-col md:gap-2 gap-1"
            imageClassName="relative lg:w-[291px] md:w-[200px] w-[166px] lg:h-[204px] md:h-[160px] h-[104px] shrink-0 overflow-hidden"
            imageSizes="(max-width: 1440px) 25vw, 300px"
            imageCoverClassName={cn(index === 2 ? "object-bottom" : "object-top", "object-cover transition-transform duration-300 group-hover:scale-105")}
            labelClassName="font-gill lg:text-xl md:text-lg text-sm leading-110 text-darkblack transition-opacity group-hover:opacity-80"
            onClose={onClose}
          />
        ))}
      </div>
    );
  }

  const [first, second, third] = WORLD_OF_SUNNY_NAV_ITEMS;

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
