import { Fragment } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";

export type GuaranteeBarItem = {
  iconSrc: string;
  label: string;
  alt?: string;
};

export const guaranteeBarSpec = {
  itemHeight: 136,
  itemPadding: 12,
  itemGap: 12,
  iconSize: 64,
  mobileIconSize: 40,
  dividerColor: "#999999",
} as const;

const GuaranteeIcon = ({
  iconSrc,
  alt,
  size,
}: {
  iconSrc: string;
  alt: string;
  size: number;
}) => (
  <div
    className="flex shrink-0 items-center justify-center"
    style={{ width: `${size}px`, height: `${size}px` }}
  >
    <Image
      src={iconSrc}
      alt={alt}
      width={size}
      height={size}
      className="size-full object-contain"
    />
  </div>
);

const GuaranteeDivider = ({ orientation }: { orientation: "vertical" | "horizontal" }) => (
  <li
    aria-hidden
    className={cn(
      "flex list-none items-center justify-center",
      orientation === "vertical"
        ? "self-stretch px-4 max-desktop:flex-none desktop:min-w-0 desktop:flex-1 desktop:px-0"
        : "w-full shrink-0 py-4",
    )}
  >
    <span
      className={cn(
        "shrink-0",
        orientation === "vertical" ? "h-[136px] w-hairline" : "h-px w-full",
      )}
      style={{ backgroundColor: guaranteeBarSpec.dividerColor }}
    />
  </li>
);

const GuaranteeItem = ({ iconSrc, label, alt }: GuaranteeBarItem) => (
  <li
    className="list-none flex w-[200px] shrink-0 flex-col items-center justify-center text-center desktop:w-[260px]"
    style={{
      height: `${guaranteeBarSpec.itemHeight}px`,
      gap: `${guaranteeBarSpec.itemGap}px`,
      padding: `${guaranteeBarSpec.itemPadding}px`,
    }}
  >
    <GuaranteeIcon
      iconSrc={iconSrc}
      alt={alt?.trim() || ""}
      size={guaranteeBarSpec.iconSize}
    />
    <p className="whitespace-nowrap font-gill text-15 font-normal leading-110 text-darkblack desktop:text-xl desktop:whitespace-normal">
      {label}
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
  if (items.length === 0) return null;

  return (
    <section aria-label={ariaLabel} className={cn("relative z-10 bg-gray200", className)}>
      <ul className="m-0 flex list-none flex-col items-center p-0 px-4 py-10 md:hidden">
        {items.map(({ iconSrc, label, alt }, index) => (
          <Fragment key={label}>
            {index > 0 ? <GuaranteeDivider orientation="horizontal" /> : null}
            <li
              className="list-none flex w-full flex-col items-center justify-center text-center"
              style={{
                gap: `${guaranteeBarSpec.itemGap}px`,
                padding: `${guaranteeBarSpec.itemPadding}px`,
              }}
            >
              <GuaranteeIcon
                iconSrc={iconSrc}
                alt={alt?.trim() || ""}
                size={guaranteeBarSpec.mobileIconSize}
              />
              <p className="font-gill text-base font-normal leading-110 text-darkblack">{label}</p>
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
        {items.map(({ iconSrc, label, alt }, index) => (
          <Fragment key={label}>
            {index > 0 ? <GuaranteeDivider orientation="vertical" /> : null}
            <GuaranteeItem iconSrc={iconSrc} label={label} alt={alt} />
          </Fragment>
        ))}
      </ul>
    </section>
  );
};

export default GuaranteesBar;
