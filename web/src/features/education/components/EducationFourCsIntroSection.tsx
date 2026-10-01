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
      className="bg-white px-4 md:px-10 md:pt-104 md:pb-104 pt-16 pb-[78px]"
    >
      <div className="mx-auto flex w-full max-w-[778px] flex-col items-center">
        <ScrollReveal
          as="h2"
          delayMs={0}
          className="w-full mb-6"
        >
          <span id="education-four-cs-intro-title" className="block w-full text-center font-larken text-darkblack font-light leading-110 text-32 md:text-4xl lg:text-5xl">
            {intro.desktopTitle}
          </span>
        </ScrollReveal>
        <div className="flex flex-col items-center gap-6">
          {intro.imageDesktopUrl || intro.imageMobileUrl ? (
            <ScrollReveal delayMs={100} className="relative overflow-hidden md:h-[192px] md:w-[309px] h-[77px] w-[124px]">
              <ResponsiveImage
                desktopSrc={intro.imageDesktopUrl ?? intro.imageMobileUrl ?? ""}
                mobileSrc={intro.imageMobileUrl}
                alt={intro.imageAlt ?? ""}
                width={intro.imageDesktopUrl ? 250 : 160}
                height={intro.imageDesktopUrl ? 202 : 130}
                quality={80}
                className="object-cover"
              />
            </ScrollReveal>
          ) : null}
          <VerticalScrollLine height={56} />
          <ScrollReveal delayMs={220}>
            <p className="text-center font-gill font-light leading-110 text-darkblack md:text-xl text-base">{intro.description}</p>
          </ScrollReveal>
          <div
            className="h-[2px] w-full md:max-w-[421px] max-w-[250px] bg-gradient-to-r from-transparent via-[#DDA957] via-50% to-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, #DDA957 25%, #722257 70%, transparent 100%)" }}
          ></div>
          <EducationFourCsIntroPillars pillars={intro.pillars} />
        </div>
      </div>
    </section>
  );
};

export default EducationFourCsIntroSection;
