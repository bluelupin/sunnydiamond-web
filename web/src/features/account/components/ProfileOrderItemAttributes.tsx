"use client";

import { Fragment, type ReactNode } from "react";
import { stripLineInstanceFromEngraving } from "@/features/cart/utils/cartLineInstance.utils";
import EngravingFontStyles from "@/features/products/components/detail/EngravingFontStyles";
import { resolveEngravingPreviewTypography } from "@/features/products/constants/engraving";
import { cn } from "@/shared/utils/cn";
import type { ProfileOrderItemUi } from "../types/profileUi.types";
import { ProfileMetaDivider } from "./profileUi";

type ProfileOrderItemAttributesProps = {
  item: Pick<ProfileOrderItemUi, "size" | "metal" | "engraving" | "engravingFont">;
  /** Order detail cards use neutral500 on desktop; listing rows stay darkblack. */
  className?: string;
};

function ProfileOrderEngravingValue({
  engraving,
  engravingFont,
}: {
  engraving: string;
  engravingFont?: string;
}) {
  const displayText =
    stripLineInstanceFromEngraving(engraving).trim() || engraving.trim();
  const typography = resolveEngravingPreviewTypography(engravingFont ?? "");

  return (
    <>
      Engraving:{" "}
      <span className={cn(typography.className, "text-sm font-light leading-110 text-darkblack")} style={typography.style}>
        {displayText}
      </span>
    </>
  );
}

/** Figma — `Size: 14 | White Gold | Engraving: DIYA` on one line; engraving text uses the shopper's font. */
export function ProfileOrderItemAttributes({
  item,
  className,
}: ProfileOrderItemAttributesProps) {
  const segments: ReactNode[] = [];

  if (item.size) {
    segments.push(<span key="size">Size: {item.size}</span>);
  }

  if (item.metal) {
    segments.push(<span key="metal">{item.metal}</span>);
  }

  if (item.engraving?.trim()) {
    segments.push(
      <span key="engraving" className="text-sm font-light leading-110 text-darkblack">
        <ProfileOrderEngravingValue
          engraving={item.engraving}
          engravingFont={item.engravingFont}
        />
      </span>,
    );
  }

  if (segments.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 font-gill text-sm font-light leading-110 text-darkblack",
        className,
      )}
    >
      <EngravingFontStyles />
      {segments.map((segment, index) => (
        <Fragment key={index}>
          {index > 0 ? <ProfileMetaDivider className="h-4 !w-[0.8px] !bg-neutral500" /> : null}
          {segment}
        </Fragment>
      ))}
    </div>
  );
}
