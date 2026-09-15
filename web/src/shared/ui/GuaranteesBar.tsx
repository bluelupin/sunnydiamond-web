import { Fragment } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";

export type GuaranteeBarIcon = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
};

export type GuaranteeBarItem = {
  label: string;
  alt?: string;
  icon: GuaranteeBarIcon;
};

export const guaranteeBarSpec = {
  itemHeight: 136,
  itemPadding: 12,
  itemGap: 12,
  iconSize: 64,
  mobileIconSize: 40,
  dividerColor: "#999999",
} as const;

const hasIcon = (icon?: GuaranteeBarIcon): icon is GuaranteeBarIcon =>
  Boolean(icon?.desktopUrl?.trim() || icon?.mobileUrl?.trim());

const isRenderableGuaranteeItem = (item: GuaranteeBarItem): boolean => hasIcon(item.icon);

const GuaranteeIcon = ({
  item,
  size,
}: {
  item: GuaranteeBarItem;
  size: number;
}) => {
  if (!hasIcon(item.icon)) return null;

  const alt = item.alt?.trim() || item.icon.alt.trim() || "";

  return (
    <div className="flex shrink-0 items-center justify-center md:h-16 md:w-16 h-10 w-10">
      <ResponsiveImage
        desktopSrc={item.icon.desktopUrl}
        mobileSrc={item.icon.mobileUrl}
        alt={alt}
        width={size}
        height={size}
        className="md:h-16 md:w-16 h-10 w-10 object-contain"
      />
    </div>
  );
};

const GuaranteeDivider = ({ orientation }: { orientation: "vertical" | "horizontal" }) => (
  <li
    aria-hidden
    className={cn(
      "flex list-none items-center justify-center",
      orientation === "vertical"
        ? "self-stretch px-4 max-desktop:flex-none desktop:min-w-0 desktop:flex-1 desktop:px-0"
        : "w-full shrink-0 my-6",
    )}
  >
    <span
      className={cn(
        "shrink-0",
        orientation === "vertical" ? "h-[136px] w-hairline" : "h-[0.5px] w-full",
      )}
      style={{ backgroundColor: guaranteeBarSpec.dividerColor }}
    />
  </li>
);

const GuaranteeItem = (item: GuaranteeBarItem) => (
  <li
    className="list-none flex w-[200px] shrink-0 flex-col items-center justify-center text-center desktop:w-[260px]"
    style={{
      height: `${guaranteeBarSpec.itemHeight}px`,
      gap: `${guaranteeBarSpec.itemGap}px`,
      padding: `${guaranteeBarSpec.itemPadding}px`,
    }}
  >
    <GuaranteeIcon item={item} size={guaranteeBarSpec.iconSize} />
    <p className="whitespace-nowrap font-gill text-15 font-normal leading-110 text-darkblack desktop:text-xl desktop:whitespace-normal">
      {item.label}
    </p>
  </li>
);

type GuaranteesBarProps = {
  items: readonly GuaranteeBarItem[];
  ariaLabel?: string;
  className?: string;
};

const GuaranteesBar = ({
  items,
  ariaLabel = "Shopping guarantees",
  className,
}: GuaranteesBarProps) => {
  const visibleItems = items.filter(isRenderableGuaranteeItem);
  if (visibleItems.length === 0) return null;

  return (
    <section aria-label={ariaLabel} className={cn("relative z-10 bg-gray200", className)}>
      <ul className="m-0 flex list-none flex-col items-center p-0 px-4 py-10 md:hidden">
        {visibleItems.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? <GuaranteeDivider orientation="horizontal" /> : null}
            <li
              className="list-none flex w-full flex-col items-center justify-center text-center md:gap3 gap-2 md:py-5 py-4 px-4"
            >
              <GuaranteeIcon item={item} size={guaranteeBarSpec.mobileIconSize} />
              <p className="font-gill text-base font-normal leading-110 text-darkblack">{item.label}</p>
            </li>
          </Fragment>
        ))}
      </ul>

      <ul
        className={cn(
          "m-0 hidden list-none items-stretch justify-evenly p-0 md:flex",
          "px-10 py-16",
          "desktop:justify-between desktop:px-[180px] desktop:py-16",
        )}
      >
        {visibleItems.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? <GuaranteeDivider orientation="vertical" /> : null}
            <GuaranteeItem {...item} />
          </Fragment>
        ))}
      </ul>
    </section>
  );
};

export default GuaranteesBar;
