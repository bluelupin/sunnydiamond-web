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
  diamond: { width: iconSpec.defaultSize, height: iconSpec.defaultSize, className: "h-16 w-16" },
  moneyback: { width: iconSpec.defaultSize, height: iconSpec.defaultSize, className: "h-16 w-16" },
  hallmark: {
    width: iconSpec.hallmarkWidth,
    height: iconSpec.hallmarkHeight,
    className: "h-16 w-hallmark",
  },
  return: { width: iconSpec.defaultSize, height: iconSpec.defaultSize, className: "h-16 w-16" },
  cod: { width: iconSpec.defaultSize, height: iconSpec.defaultSize, className: "h-16 w-16" },
} as const;

const AboutGuaranteeDivider = () => (
  <li
    aria-hidden
    className="flex min-w-0 flex-1 list-none items-center justify-center self-stretch"
  >
    <span className="h-136 w-hairline shrink-0 bg-gray600" />
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
    <li className="flex h-136 w-260 shrink-0 list-none flex-col items-center justify-center gap-3 rounded-figma p-3 text-center">
      <Image
        src={iconSrc}
        alt=""
        width={iconDimensions.width}
        height={iconDimensions.height}
        aria-hidden
        className={cn("shrink-0 object-contain", iconDimensions.className)}
      />
      <p className="max-w-236 font-gill text-20 font-normal leading-110 text-darkblack">
        {label}
      </p>
    </li>
  );
};

const AboutGuaranteesBar = () => {
  return (
    <section aria-label="Shopping guarantees" className="bg-gray200">
      <PageContainer className="py-10 md:py-12 desktop:py-16">
        <div className="scrollbar-none -mx-5 overflow-x-auto px-5 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10 desktop:mx-0 desktop:overflow-visible desktop:px-0">
          <ul className="m-0 flex w-1360 shrink-0 list-none items-stretch p-0 desktop:w-full desktop:shrink">
            {aboutGuarantees.map((guarantee, index) => (
              <Fragment key={guarantee.label}>
                {index > 0 ? <AboutGuaranteeDivider /> : null}
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
