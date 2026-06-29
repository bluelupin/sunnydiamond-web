import Image from "next/image";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import EducationFourCsIntroPillars from "./EducationFourCsIntroPillars";
import {
  educationFourCsIntroContent,
  educationFourCsIntroSpec,
  educationPageImages,
  educationSectionTitleSpacingClassName,
} from "../data/content";

const spec = educationFourCsIntroSpec;

const EducationFourCsIntroSection = () => {
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
            <span className="md:hidden">{educationFourCsIntroContent.mobileTitle}</span>
            <span className="hidden md:inline">{educationFourCsIntroContent.desktopTitle}</span>
          </span>
        </ScrollReveal>

        <div className={spec.stackClassName}>
          <ScrollReveal delayMs={100}>
            <div className={spec.imageClassName}>
              <Image
                src={educationPageImages.diamondOval}
                alt=""
                fill
                className="object-cover"
                sizes={spec.imageSizes}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={180} className="max-md:hidden">
            <div className={spec.verticalRuleClassName} aria-hidden />
          </ScrollReveal>

          <ScrollReveal delayMs={220}>
            <p className={spec.descriptionClassName}>
              {educationFourCsIntroContent.description}
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={300}>
            <div className={spec.gradientRuleClassName} aria-hidden />
          </ScrollReveal>

          <EducationFourCsIntroPillars pillars={educationFourCsIntroContent.pillars} />
        </div>
      </div>
    </section>
  );
};

export default EducationFourCsIntroSection;
