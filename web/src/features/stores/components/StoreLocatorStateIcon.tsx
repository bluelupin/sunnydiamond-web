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

  if (!state.iconUrl) return null;

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden", isMobile ? "md:hidden" : "hidden md:block")}
      style={{ width, height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={state.iconUrl}
        alt={state.iconAlt || ""}
        className="size-full object-contain object-center"
      />
    </div>
  );
};

const StoreLocatorStateIconDesktop = ({ state }: { state: StoreLocatorStateFilter }) => (
  <StoreLocatorStateIcon state={state} variant="desktop" />
);

export { StoreLocatorStateIconDesktop };
export default StoreLocatorStateIcon;
