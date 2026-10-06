"use client";

import type { ProfileOrderDetailItemUi } from "../types/profileUi.types";
import { ProfileOrderDetailItemCard } from "./ProfileOrderDetailItemCard";

type ProfileOrderDetailItemsSectionProps = {
  items: ProfileOrderDetailItemUi[];
};

/** One product card per line — gift bag/note only on lines that carry a gift note (Figma). */
export function ProfileOrderDetailItemsSection({ items }: ProfileOrderDetailItemsSectionProps) {
  return (
    <>
      {items.map((item) => (
        <ProfileOrderDetailItemCard key={item.id} item={item} />
      ))}
    </>
  );
}
