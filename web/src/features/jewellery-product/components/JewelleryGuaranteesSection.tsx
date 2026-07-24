import { Fragment } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import {
  jewelleryListingGuarantees,
  jewelleryListingGuaranteesSpec,
} from "../data/content";

const {
  itemHeight,
  itemPadding,
  itemGap,
  iconSize,
  mobileIconSize,
  dividerColor,
} = jewelleryListingGuaranteesSpec;

const GuaranteeIcon = ({ iconSrc, size }: { iconSrc: string; size: number }) => (
  <div
    className="flex shrink-0 items-center justify-center"
    style={{ width: `${size}px`, height: `${size}px` }}
  >
    <Image
      src={iconSrc}
      alt=""
      width={size}
      height={size}
      className="size-full object-contain"
      aria-hidden
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
      style={{ backgroundColor: dividerColor }}
    />
  </li>
);

const GuaranteeItem = ({ iconSrc, label }: { iconSrc: string; label: string }) => (
  <li
    className="list-none flex w-[200px] shrink-0 flex-col items-center justify-center text-center desktop:w-[260px]"
    style={{
      height: `${itemHeight}px`,
      gap: `${itemGap}px`,
      padding: `${itemPadding}px`,
    }}
  >
    <GuaranteeIcon iconSrc={iconSrc} size={iconSize} />
    <p className="whitespace-nowrap font-gill text-15 font-normal leading-110 text-darkblack desktop:text-xl desktop:whitespace-normal">
      {label}
    </p>
  </li>
);

const JewelleryGuaranteesSection = () => {
  return (
    <section aria-label="Shopping guarantees" className="bg-gray200">
      <ul className="m-0 flex list-none flex-col items-center p-0 px-4 py-10 md:hidden">
        {jewelleryListingGuarantees.map(({ iconSrc, label }, index) => (
          <Fragment key={label}>
            {index > 0 ? <GuaranteeDivider orientation="horizontal" /> : null}
            <li
              className="list-none flex w-full flex-col items-center justify-center text-center"
              style={{ gap: `${itemGap}px`, padding: `${itemPadding}px` }}
            >
              <GuaranteeIcon iconSrc={iconSrc} size={mobileIconSize} />
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
        {jewelleryListingGuarantees.map(({ iconSrc, label }, index) => (
          <Fragment key={label}>
            {index > 0 ? <GuaranteeDivider orientation="vertical" /> : null}
            <GuaranteeItem iconSrc={iconSrc} label={label} />
          </Fragment>
        ))}
      </ul>
    </section>
  );
};

export default JewelleryGuaranteesSection;
