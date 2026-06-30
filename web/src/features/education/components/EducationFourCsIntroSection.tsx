import Image from "next/image";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import type { NormalizedEducationFourCsIntro } from "@/services/education/learn-about-diamonds-page.types";
import EducationFourCsIntroPillars from "./EducationFourCsIntroPillars";
import { educationFourCsIntroSpec, educationSectionTitleSpacingClassName } from "../data/content";

const spec = educationFourCsIntroSpec;

type EducationFourCsIntroSectionProps = {
  intro: NormalizedEducationFourCsIntro;
};

const EducationFourCsIntroSection = ({ intro }: EducationFourCsIntroSectionProps) => {
  const hasDistinctMobileImage = intro.imageMobileUrl !== intro.imageDesktopUrl;

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
          <span id="education-four-cs-intro-title" className={spec.titleClassName}>
            <span className="md:hidden">{intro.mobileTitle}</span>
            <span className="hidden md:inline">{intro.desktopTitle}</span>
          </span>
        </ScrollReveal>

        <div className={spec.stackClassName}>
          <ScrollReveal delayMs={100}>
            <div className={spec.imageClassName}>
              {hasDistinctMobileImage ? (
                <>
                  <Image
                    src={intro.imageMobileUrl}
                    alt={intro.imageAlt}
                    fill
                    className="object-cover md:hidden"
                    sizes={spec.imageSizes}
                  />
                  <Image
                    src={intro.imageDesktopUrl}
                    alt={intro.imageAlt}
                    fill
                    className="hidden object-cover md:block"
                    sizes={spec.imageSizes}
                  />
                </>
              ) : (
                <Image
                  src={intro.imageDesktopUrl}
                  alt={intro.imageAlt}
                  fill
                  className="object-cover"
                  sizes={spec.imageSizes}
                />
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={180} className="max-md:hidden">
            <div className={spec.verticalRuleClassName} aria-hidden />
          </ScrollReveal>

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
