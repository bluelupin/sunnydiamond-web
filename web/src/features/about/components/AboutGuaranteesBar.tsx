import Image from "next/image";
import { Fragment } from "react";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";
import {
  aboutGuaranteeIconPaths,
  aboutGuarantees,
  aboutGuaranteesFigmaSpec,
} from "../data/content";

const { icon: iconSpec } = aboutGuaranteesFigmaSpec;

const guaranteeIconDimensions = {
  diamond: { width: iconSpec.defaultSize, height: iconSpec.defaultSize, className: "md:h-16 md:w-16 h-[40px] w-[40px]" },
  moneyback: { width: iconSpec.defaultSize, height: iconSpec.defaultSize, className: "md:h-16 md:w-16 h-[40px] w-[40px]" },
  hallmark: {
    width: iconSpec.hallmarkWidth,
    height: iconSpec.hallmarkHeight,
    className: "md:h-16 md:w-16 h-[40px] w-[40px]",
  },
  return: { width: iconSpec.defaultSize, height: iconSpec.defaultSize, className: "md:h-16 md:w-16 h-[40px] w-[40px]" },
  cod: { width: iconSpec.defaultSize, height: iconSpec.defaultSize, className: "md:h-16 md:w-16 h-[40px] w-[40px]" },
} as const;

const AboutGuaranteeDivider = ({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) => (
  <li
    aria-hidden
    className={cn(
      "flex list-none items-center justify-center",
      orientation === "vertical"
        ? "min-w-0 flex-1 self-stretch"
        : "w-full max-w-260 shrink-0 py-6",
    )}
  >
    <span
      className={cn(
        "shrink-0 bg-gray600",
        orientation === "vertical" ? "h-136 w-hairline" : "h-px w-full",
      )}
    />
  </li>
);

type GuaranteeItemProps = {
  label: string;
  icon: keyof typeof aboutGuaranteeIconPaths;
};

const AboutGuaranteeItem = ({ label, icon }: GuaranteeItemProps) => {
  const iconSrc = aboutGuaranteeIconPaths[icon];
  const iconDimensions = guaranteeIconDimensions[icon];

  return (
    <li className="flex lg:h-136 h-98 w-full max-w-260 list-none flex-col items-center justify-center gap-3 rounded-figma text-center desktop:w-260 desktop:shrink-0">
      <Image
        src={iconSrc}
        alt=""
        width={iconDimensions.width}
        height={iconDimensions.height}
        aria-hidden
        className={cn("shrink-0 object-contain", iconDimensions.className)}
      />
      <p className="max-w-236 font-gill text-base font-normal leading-110 text-darkblack desktop:text-20">
        {label}
      </p>
    </li>
  );
};

const AboutGuaranteesBar = () => {
  return (
    <section aria-label="Shopping guarantees" className="bg-gray200">
      <PageContainer className="py-16">
        <ul className="m-0 flex w-full list-none flex-col items-center p-0 lg:hidden">
          {aboutGuarantees.map((guarantee, index) => (
            <Fragment key={guarantee.label}>
              {index > 0 ? <AboutGuaranteeDivider orientation="horizontal" /> : null}
              <AboutGuaranteeItem label={guarantee.label} icon={guarantee.icon} />
            </Fragment>
          ))}
        </ul>

        <div className="scrollbar-none -mx-5 hidden overflow-x-auto px-5 md:-mx-8 md:px-8 lg:-mx-10 lg:block lg:px-10 desktop:mx-0 desktop:overflow-visible desktop:px-0">
          <ul className="m-0 flex lg:gap-2 gap-6 w-1360 shrink-0 list-none items-stretch p-0 desktop:w-full desktop:shrink">
            {aboutGuarantees.map((guarantee, index) => (
              <Fragment key={guarantee.label}>
                {index > 0 ? <AboutGuaranteeDivider orientation="vertical" /> : null}
                <AboutGuaranteeItem label={guarantee.label} icon={guarantee.icon} />
              </Fragment>
            ))}
          </ul>
        </div>
      </PageContainer>
    </section>
  );
};

export default AboutGuaranteesBar;
