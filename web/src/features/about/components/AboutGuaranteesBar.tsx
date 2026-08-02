import { Fragment } from "react";
import PageContainer from "@/shared/ui/layout/PageContainer";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import type { NormalizedTrustBadge } from "@/services/about/about-page.types";
import Reveal from "@/shared/Animation/Reveal";
type AboutGuaranteesBarProps = {
  badges: NormalizedTrustBadge[];
};

const AboutGuaranteeDivider = ({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) => (
  <Reveal as="li" direction="up"
    aria-hidden
    className={cn(
      "flex list-none items-center justify-center",
      orientation === "vertical"
        ? "min-w-0 flex-1 self-stretch"
        : "lg:w-260 w-full shrink-0 lg:py-6 py-4",
    )}
  >
    <span
      className={cn(
        "shrink-0 bg-gray600",
        orientation === "vertical" ? "h-136 w-hairline" : "h-px w-full",
      )}
    />
  </Reveal>
);

type GuaranteeIconProps = {
  icon: NormalizedTrustBadge["icon"];
};

const GuaranteeIcon = ({ icon }: GuaranteeIconProps) => (
  <div className="md:h-16 md:w-16 h-10 w-10">
    <ResponsiveImage
      desktopSrc={icon.desktopUrl}
      mobileSrc={icon.mobileUrl}
      alt=""
      width={icon.desktopUrl ? 64 : 40}
      height={icon.desktopUrl ? 64 : 40}
      className="shrink-0 object-contain md:h-16 md:w-16 h-10 w-10"
    />
  </div>
);
type GuaranteeItemProps = {
  badge: NormalizedTrustBadge;
};

const AboutGuaranteeItem = ({ badge }: GuaranteeItemProps) => (
  <Reveal as="li" direction="up" className="flex lg:h-136 h-98 lg:w-260 w-full list-none flex-col items-center justify-center gap-3 rounded-figma text-center desktop:w-260 desktop:shrink-0">
    <GuaranteeIcon icon={badge.icon} />
    <p className="max-w-236 font-gill text-base font-normal leading-110 text-darkblack desktop:text-xl">
      {badge.label}
    </p>
  </Reveal>
);

const AboutGuaranteesBar = ({ badges }: AboutGuaranteesBarProps) => {
  return (
    <section aria-label="Shopping guarantees" className="bg-gray200">
      <PageContainer className="py-16">
        <ul className="m-0 flex w-full list-none flex-col items-center p-0 md:hidden">
          {badges.map((badge, index) => (
            <Fragment key={`${badge.label}-${index}`}>
              {index > 0 ? <AboutGuaranteeDivider orientation="horizontal" /> : null}
              <AboutGuaranteeItem badge={badge} />
            </Fragment>
          ))}
        </ul>

        <div className="scrollbar-none -mx-5 hidden overflow-x-auto px-5 md:-mx-8 md:block md:px-8 lg:-mx-10 lg:px-10 desktop:mx-0 desktop:overflow-visible desktop:px-0">
          <ul className="m-0 flex lg:gap-2 gap-6 w-1360 shrink-0 list-none items-stretch p-0 desktop:w-full desktop:shrink">
            {badges.map((badge, index) => (
              <Fragment key={`${badge.label}-${index}`}>
                {index > 0 ? <AboutGuaranteeDivider orientation="vertical" /> : null}
                <AboutGuaranteeItem badge={badge} />
              </Fragment>
            ))}
          </ul>
        </div>
      </PageContainer>
    </section>
  );
};

export default AboutGuaranteesBar;
