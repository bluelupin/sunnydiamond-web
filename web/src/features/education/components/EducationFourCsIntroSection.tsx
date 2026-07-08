import ScrollReveal from "@/shared/ui/ScrollReveal";
import type { NormalizedEducationFourCsIntro } from "@/services/education/learn-about-diamonds-page.types";
import EducationFourCsIntroPillars from "./EducationFourCsIntroPillars";
// import { educationFourCsIntroSpec } from "../data/content";
import VerticalScrollLine from "@/features/about/components/VerticalScrollLine";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";

// const spec = educationFourCsIntroSpec;

type EducationFourCsIntroSectionProps = {
  intro: NormalizedEducationFourCsIntro;
};

const EducationFourCsIntroSection = ({ intro }: EducationFourCsIntroSectionProps) => {
  return (
    <section
      aria-labelledby="education-four-cs-intro-title"
      className="bg-white px-4 md:px-8 lg:px-10 lg:py-100 py-16"
    >
      <div className="mx-auto flex w-full max-w-760 flex-col items-center">
        <ScrollReveal
          as="h2"
          delayMs={0}
          className="w-full mb-8 lg:mb-40"
        >
          <span id="education-four-cs-intro-title" className="block w-full text-center font-larken text-darkblack font-light leading-110 text-3xl sm:text-3xl md:text-4xl lg:text-5xl">
            {intro.desktopTitle}
          </span>
        </ScrollReveal>
        <div className="flex flex-col items-center gap-6 lg:gap-8">
          <ScrollReveal delayMs={100} className="relative overflow-hidden lg:h-202 lg:w-250 h-130 w-[160px]">
            <ResponsiveImage
              desktopSrc={intro.imageDesktopUrl}
              mobileSrc={intro.imageMobileUrl}
              alt={intro.imageAlt}
              width={intro.imageDesktopUrl ? 250 : 160}
              height={intro.imageDesktopUrl ? 202 : 130}
              quality={80}
              className="object-cover"
            />
          </ScrollReveal>
          <VerticalScrollLine />
          <ScrollReveal delayMs={220}>
            <p className="max-w-350 text-center font-gill text-base font-light leading-110 text-darkblack lg:max-w-640 lg:text-xl">{intro.description}</p>
          </ScrollReveal>
          <div
            className="h-[2px] w-full max-w-445 bg-gradient-to-r from-transparent via-[#DDA957] via-50% to-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, #DDA957 25%, #722257 70%, transparent 100%)" }}
          ></div>
          <EducationFourCsIntroPillars pillars={intro.pillars} />
        </div>
      </div>
    </section>
  );
};

export default EducationFourCsIntroSection;
