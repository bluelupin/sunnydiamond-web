"use client";

import { wishlistPageContent, type WishlistViewMode } from "@/features/wishlist/data/content";
import { cn } from "@/shared/utils/cn";

type WishlistViewToggleProps = {
  value: WishlistViewMode;
  onChange: (value: WishlistViewMode) => void;
};

type ToggleIconProps = {
  active: boolean;
};

const GridIcon = ({ active }: ToggleIconProps) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="7" height="7" fill={`${active ? "#0A0A0A" : ""}`} stroke="#0A0A0A" />
    <rect x="10.5" y="0.5" width="7" height="7" fill={`${active ? "#0A0A0A" : ""}`} stroke="#0A0A0A" />
    <rect x="0.5" y="10.5" width="7" height="7" fill={`${active ? "#0A0A0A" : ""}`} stroke="#0A0A0A" />
    <rect x="10.5" y="10.5" width="7" height="7" fill={`${active ? "#0A0A0A" : ""}`} stroke="#0A0A0A" />
  </svg>
);

const ListIcon = ({ active }: ToggleIconProps) => (
  <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="16" height="7" fill={`${active ? "#0A0A0A" : ""}`} stroke="#0A0A0A" />
    <rect x="0.5" y="10.5" width="16" height="7" fill={`${active ? "#0A0A0A" : ""}`} stroke="#0A0A0A" />
  </svg>
);

const WishlistViewToggle = ({ value, onChange }: WishlistViewToggleProps) => {
  return (
    <div
      className="flex items-center justify-center gap-4 md:hidden"
      role="group"
      aria-label="Wishlist layout"
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label={wishlistPageContent.gridViewLabel}
        aria-pressed={value === "grid"}
        className="flex items-center justify-center p-0">
        <GridIcon active={value === "grid"} />
      </button>
      <svg width="1" height="24" viewBox="0 0 1 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[18px]">
        <line x1="0.5" y1="2.18556e-08" x2="0.499999" y2="24" stroke="#CCCCCC" />
      </svg>

      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label={wishlistPageContent.listViewLabel}
        aria-pressed={value === "list"}
        className="flex items-center justify-center p-0">
        <ListIcon active={value === "list"} />
      </button>
    </div>
  );
};

export default WishlistViewToggle;
