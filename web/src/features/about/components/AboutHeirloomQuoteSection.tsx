import Image from "next/image";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { NormalizedBrandTagline } from "@/services/about/about-page.types";
import {
  aboutHeirloomFigmaSpec,
} from "../data/content";
import Reveal from "@/shared/Animation/Reveal";

const { flourish: flourishSpec } = aboutHeirloomFigmaSpec;

type AboutHeirloomQuoteSectionProps = NormalizedBrandTagline;

const AboutHeirloomQuoteSection = ({ quote, iconUrl }: AboutHeirloomQuoteSectionProps) => {
  // const flourishSrc = iconUrl ?? aboutHeirloomAssets.flourishIcon;

  return (
    <section aria-labelledby="about-heirloom-quote" className="bg-white">
      <PageContainer className="py-16 md:py-20 md:py-104 !px-4 md:!px-[26px] 2xl:!px-[60px]">
        <Reveal direction="up" className="flex flex-col items-center justify-center gap-4 lg:flex-row">
          <Image
            src="/icons/flourishIcon.svg"
            alt={quote}
            width={flourishSpec.width}
            height={flourishSpec.height}
            aria-hidden
            unoptimized={Boolean(iconUrl)}
            className="size-4 shrink-0 sm:size-5"
          />

          <h2
            id="about-heirloom-quote"
            className="text-center font-larken font-light leading-110 tracking-[0%] text-darkblack text-32 md:text-4xl lg:text-5xl"
          >
            {quote}
          </h2>

          <Image
            src="/icons/flourishIcon.svg"
            alt={quote}
            width={flourishSpec.width}
            height={flourishSpec.height}
            aria-hidden
            unoptimized={Boolean(iconUrl)}
            className="size-4 shrink-0 sm:size-5"
          />
        </Reveal>
      </PageContainer>
    </section>
  );
};

export default AboutHeirloomQuoteSection;
