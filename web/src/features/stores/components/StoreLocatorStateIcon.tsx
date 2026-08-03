import { cn } from "@/shared/utils/cn";
import type { StoreLocatorStateFilter } from "../data/storeLocatorContent";

type StoreLocatorStateIconProps = {
  state: StoreLocatorStateFilter;
  variant?: "mobile" | "desktop";
};

const CmsIcon = ({
  state,
  className,
  width,
  height,
}: {
  state: StoreLocatorStateFilter;
  className?: string;
  width: number;
  height: number;
}) => {
  const src = state.iconUrl || state.spriteSrc;
  if (!src) return null;

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden", className)}
      style={{ width, height }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="size-full object-contain object-center"
      />
    </div>
  );
};

const StoreLocatorStateIcon = ({ state, variant = "desktop" }: StoreLocatorStateIconProps) => {
  const isMobile = variant === "mobile";
  const width = isMobile ? (state.mobileIconWidth ?? state.iconWidth) : state.iconWidth;
  const height = isMobile ? (state.mobileIconHeight ?? state.iconHeight) : state.iconHeight;

  if (state.iconUrl) {
    return (
      <CmsIcon
        state={state}
        className={cn(isMobile && "md:hidden")}
        width={width}
        height={height}
      />
    );
  }

  if (!state.spriteSrc) return null;

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
          width: `${state.imageWidthPct ?? 100}%`,
          height: `${state.imageHeightPct ?? 100}%`,
          left: `${state.imageLeftPct ?? 0}%`,
          top: `${state.imageTopPct ?? 0}%`,
        }}
      />
    </div>
  );
};

const StoreLocatorStateIconDesktop = ({ state }: { state: StoreLocatorStateFilter }) => {
  if (state.iconUrl) {
    return (
      <CmsIcon
        state={state}
        className="hidden md:block"
        width={state.iconWidth}
        height={state.iconHeight}
      />
    );
  }

  if (!state.spriteSrc) return null;

  return (
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
          width: `${state.imageWidthPct ?? 100}%`,
          height: `${state.imageHeightPct ?? 100}%`,
          left: `${state.imageLeftPct ?? 0}%`,
          top: `${state.imageTopPct ?? 0}%`,
        }}
      />
    </div>
  );
};

export { StoreLocatorStateIconDesktop };
export default StoreLocatorStateIcon;
