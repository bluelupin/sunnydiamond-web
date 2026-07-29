import type { StoreLocatorStateFilter } from "../data/storeLocatorContent";

type StoreLocatorStateIconProps = {
  state: StoreLocatorStateFilter;
};

const StoreLocatorStateIcon = ({ state }: StoreLocatorStateIconProps) => {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
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
};

export default StoreLocatorStateIcon;
