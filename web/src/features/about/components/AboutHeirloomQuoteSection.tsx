import Image from "next/image";
import PageContainer from "@/shared/ui/layout/PageContainer";
import {
  aboutHeirloomAssets,
  aboutHeirloomContent,
  aboutHeirloomFigmaSpec,
} from "../data/content";

const { flourish: flourishSpec } = aboutHeirloomFigmaSpec;

const AboutHeirloomQuoteSection = () => {
  return (
    <section aria-labelledby="about-heirloom-quote" className="bg-white">
      <PageContainer className="py-16 md:py-20 desktop:py-100">
        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
          <Image
            src={aboutHeirloomAssets.flourishIcon}
            alt=""
            width={flourishSpec.width}
            height={flourishSpec.height}
            aria-hidden
            className="sm:h-19 sm:w-5 w-4 h-4 shrink-0"
          />

          <h2
            id="about-heirloom-quote"
            className="text-center font-larken text-32 font-light leading-110 text-darkblack sm:text-36 md:text-42 desktop:text-48"
          >
            {aboutHeirloomContent.quote}
          </h2>

          <Image
            src={aboutHeirloomAssets.flourishIcon}
            alt=""
            width={flourishSpec.width}
            height={flourishSpec.height}
            aria-hidden
            className="h-19 w-5 shrink-0 -scale-x-100"
          />
        </div>
      </PageContainer>
    </section>
  );
};

export default AboutHeirloomQuoteSection;
