import { Fragment } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import {
  jewelleryListingGuarantees,
  jewelleryListingGuaranteesSpec,
} from "../data/content";

const {
  paddingX,
  paddingY,
  itemWidth,
  itemHeight,
  itemPadding,
  itemGap,
  iconSize,
  labelFontSize,
  dividerColor,
} = jewelleryListingGuaranteesSpec;

const GuaranteeDivider = ({ orientation }: { orientation: "vertical" | "horizontal" }) => (
  <li
    aria-hidden
    className={cn(
      "flex list-none items-center justify-center",
      orientation === "vertical"
        ? "min-w-0 flex-1 self-stretch"
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
    className="list-none flex flex-col items-center justify-center text-center"
    style={{
      width: `${itemWidth}px`,
      height: `${itemHeight}px`,
      gap: `${itemGap}px`,
      padding: `${itemPadding}px`,
    }}
  >
    <div
      className="shrink-0"
      style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
    >
      <Image src={iconSrc} alt="" width={iconSize} height={iconSize} className="size-full object-contain" aria-hidden />
    </div>
    <p
      className="font-gill font-normal leading-110 text-darkblack"
      style={{ fontSize: `${labelFontSize}px` }}
    >
      {label}
    </p>
  </li>
);

const JewelleryGuaranteesSection = () => {
  return (
    <section aria-label="Shopping guarantees" className="bg-gray200">
      <ul className="m-0 flex list-none flex-col items-center p-0 px-4 py-10 lg:hidden">
        {jewelleryListingGuarantees.map(({ iconSrc, label }, index) => (
          <Fragment key={label}>
            {index > 0 ? <GuaranteeDivider orientation="horizontal" /> : null}
            <li
              className="list-none flex w-full flex-col items-center justify-center text-center"
              style={{ gap: `${itemGap}px`, padding: `${itemPadding}px` }}
            >
              <div className="flex size-10 shrink-0 items-center justify-center">
                <Image src={iconSrc} alt="" width={40} height={40} className="size-full object-contain" aria-hidden />
              </div>
              <p className="font-gill text-base font-normal leading-110 text-darkblack">{label}</p>
            </li>
          </Fragment>
        ))}
      </ul>

      <ul
        className="m-0 hidden list-none items-start justify-between p-0 lg:flex"
        style={{
          paddingLeft: `${paddingX}px`,
          paddingRight: `${paddingX}px`,
          paddingTop: `${paddingY}px`,
          paddingBottom: `${paddingY}px`,
        }}
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
