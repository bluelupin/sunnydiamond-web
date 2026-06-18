import Image from "next/image";
import {
  aboutHeirloomAssets,
  aboutHeirloomContent,
  aboutHeirloomFigmaSpec,
} from "../data/content";

const { flourish: flourishSpec } = aboutHeirloomFigmaSpec;

const AboutHeirloomQuoteSection = () => {
  return (
    <section aria-labelledby="about-heirloom-quote" className="bg-white">
      <div className="mx-auto flex w-full max-w-1440 items-center justify-center px-2.5 py-16 md:py-20 desktop:py-104">
        <div className="flex items-center justify-center gap-4">
          <Image
            src={aboutHeirloomAssets.flourishLeft}
            alt=""
            width={flourishSpec.width}
            height={flourishSpec.height}
            aria-hidden
            className="h-19 w-5 shrink-0"
          />

          <h2
            id="about-heirloom-quote"
            className="max-w-screen-gutter text-center font-larken text-28 font-light leading-110 text-darkblack sm:max-w-640 sm:text-36 md:max-w-760 md:text-42 desktop:max-w-none desktop:text-48"
          >
            {aboutHeirloomContent.quote}
          </h2>

          <Image
            src={aboutHeirloomAssets.flourishRight}
            alt=""
            width={flourishSpec.width}
            height={flourishSpec.height}
            aria-hidden
            className="h-19 w-5 shrink-0 -scale-x-100"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutHeirloomQuoteSection;
