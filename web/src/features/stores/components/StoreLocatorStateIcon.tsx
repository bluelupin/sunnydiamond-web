import { cn } from "@/shared/utils/cn";
import type { StoreLocatorStateFilter } from "../data/storeLocatorContent";

type StoreLocatorStateIconProps = {
  state: StoreLocatorStateFilter;
  variant?: "mobile" | "desktop";
};

const StoreLocatorStateIcon = ({ state, variant = "desktop" }: StoreLocatorStateIconProps) => {
  const isMobile = variant === "mobile";
  const width = isMobile ? (state.mobileIconWidth ?? state.iconWidth) : state.iconWidth;
  const height = isMobile ? (state.mobileIconHeight ?? state.iconHeight) : state.iconHeight;

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden", isMobile && "md:hidden")}
      style={{ width, height }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={state.spriteSrc}
        alt=""
        className="absolute max-w-none"
        style={{
          width: `${state.imageWidthPct}%`,
          height: `${state.imageHeightPct}%`,
          left: `${state.imageLeftPct}%`,
          top: `${state.imageTopPct}%`,
        }}
      />
    </div>
  );
};

const StoreLocatorStateIconDesktop = ({ state }: { state: StoreLocatorStateFilter }) => (
  <div
    className="relative hidden shrink-0 overflow-hidden md:block"
    style={{ width: state.iconWidth, height: state.iconHeight }}
    aria-hidden
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={state.spriteSrc}
      alt=""
      className="absolute max-w-none"
      style={{
        width: `${state.imageWidthPct}%`,
        height: `${state.imageHeightPct}%`,
        left: `${state.imageLeftPct}%`,
        top: `${state.imageTopPct}%`,
      }}
    />
  </div>
);

export { StoreLocatorStateIconDesktop };
export default StoreLocatorStateIcon;
