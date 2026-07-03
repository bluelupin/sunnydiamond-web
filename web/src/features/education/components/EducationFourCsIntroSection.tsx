import ScrollReveal from "@/shared/ui/ScrollReveal";
import type { NormalizedEducationFourCsIntro } from "@/services/education/learn-about-diamonds-page.types";
import EducationFourCsIntroPillars from "./EducationFourCsIntroPillars";
import { educationFourCsIntroSpec, educationSectionTitleSpacingClassName } from "../data/content";
import VerticalScrollLine from "@/features/about/components/VerticalScrollLine";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";

const spec = educationFourCsIntroSpec;

type EducationFourCsIntroSectionProps = {
  intro: NormalizedEducationFourCsIntro;
};

const EducationFourCsIntroSection = ({ intro }: EducationFourCsIntroSectionProps) => {
  return (
    <section
      aria-labelledby="education-four-cs-intro-title"
      className={spec.sectionClassName}
    >
      <div className={spec.contentClassName}>
        <ScrollReveal
          as="h2"
          delayMs={0}
          className={`w-full ${educationSectionTitleSpacingClassName}`}
        >
          <span id="education-four-cs-intro-title" className="block w-full text-center font-larken text-32 font-light leading-110 text-darkblack lg:text-48">
            <span className="md:hidden">{intro.mobileTitle}</span>
            <span className="hidden md:inline">{intro.desktopTitle}</span>
          </span>
        </ScrollReveal>
        <div className="flex flex-col items-center gap-6 lg:gap-8">
          <ScrollReveal delayMs={100} className="relative overflow-hidden lg:h-202 lg:w-250 h-130 w-40 imageTestContainer">
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
            <p className={spec.descriptionClassName}>{intro.description}</p>
          </ScrollReveal>
          <ScrollReveal delayMs={300}>
            <div className={spec.gradientRuleClassName} aria-hidden />
          </ScrollReveal>
          <EducationFourCsIntroPillars pillars={intro.pillars} />
        </div>
      </div>
    </section>
  );
};

export default EducationFourCsIntroSection;
