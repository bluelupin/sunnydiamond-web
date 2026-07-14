"use client";

import { wishlistHeadingMobileSpec, wishlistPageContent, type WishlistViewMode } from "@/features/wishlist/data/content";
import { cn } from "@/shared/utils/cn";

type WishlistViewToggleProps = {
  value: WishlistViewMode;
  onChange: (value: WishlistViewMode) => void;
};

const { activeColor, inactiveColor } = wishlistHeadingMobileSpec;

const GridIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="3" width="8" height="8" fill={active ? activeColor : "none"} stroke={active ? activeColor : inactiveColor} strokeWidth="1.2" />
    <rect x="13" y="3" width="8" height="8" fill={active ? activeColor : "none"} stroke={active ? activeColor : inactiveColor} strokeWidth="1.2" />
    <rect x="3" y="13" width="8" height="8" fill={active ? activeColor : "none"} stroke={active ? activeColor : inactiveColor} strokeWidth="1.2" />
    <rect x="13" y="13" width="8" height="8" fill={active ? activeColor : "none"} stroke={active ? activeColor : inactiveColor} strokeWidth="1.2" />
  </svg>
);

const ListIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="6" fill={active ? activeColor : "none"} stroke={active ? activeColor : inactiveColor} strokeWidth="1.2" />
    <rect x="3" y="13" width="18" height="6" fill={active ? activeColor : "none"} stroke={active ? activeColor : inactiveColor} strokeWidth="1.2" />
  </svg>
);

const WishlistViewToggle = ({ value, onChange }: WishlistViewToggleProps) => {
  return (
    <div
      className="flex items-center justify-center md:hidden"
      style={{ gap: wishlistHeadingMobileSpec.toggleGap }}
      role="group"
      aria-label="Wishlist layout"
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label={wishlistPageContent.gridViewLabel}
        aria-pressed={value === "grid"}
        className={cn(
          "inline-flex size-6 items-center justify-center transition-opacity",
          value === "grid" ? "opacity-100" : "opacity-70",
        )}
      >
        <GridIcon active={value === "grid"} />
      </button>

      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label={wishlistPageContent.listViewLabel}
        aria-pressed={value === "list"}
        className={cn(
          "inline-flex size-6 items-center justify-center transition-opacity",
          value === "list" ? "opacity-100" : "opacity-70",
        )}
      >
        <ListIcon active={value === "list"} />
      </button>
    </div>
  );
};

export default WishlistViewToggle;
