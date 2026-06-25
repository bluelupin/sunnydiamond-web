import Image from "next/image";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { educationCertifiedContent, educationPageImages } from "../data/content";

const EducationCertifiedSection = () => {
  return (
    <section
      aria-labelledby="education-certified-title"
      className="relative overflow-hidden bg-[#F4F3EE] px-4 py-16 lg:px-10 lg:py-[104px]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30" aria-hidden>
        <Image src={educationPageImages.certifiedBg} alt="" fill className="object-cover" sizes="100vw" />
      </div>

      <div className="relative mx-auto flex max-w-[1360px] flex-col items-center gap-10">
        <ScrollReveal as="h2" delayMs={0}>
          <span
            id="education-certified-title"
            className="block text-center font-larken text-[32px] font-light leading-none text-darkblack lg:text-[48px]"
          >
            {educationCertifiedContent.title}
          </span>
        </ScrollReveal>

        <div className="grid w-full grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-0">
          {educationCertifiedContent.certifications.map((cert, index) => (
            <ScrollReveal key={cert.label} delayMs={80 + index * 80}>
              <div className="flex flex-col items-center justify-between gap-3 lg:min-h-[120px] lg:gap-2">
                <div className={`relative overflow-hidden ${cert.logoClassName}`}>
                  <Image
                    src={cert.logo}
                    alt=""
                    fill
                    className={cert.imageClassName}
                    sizes="120px"
                  />
                </div>
                <p className="text-center font-gill text-sm leading-110 text-darkblack lg:text-base">
                  {cert.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="relative mt-4 grid w-full gap-10 lg:grid-cols-[647px_1fr] lg:items-center lg:gap-0">
          <ScrollReveal delayMs={120} className="flex flex-col gap-10 lg:gap-10">
            <div className="h-px w-full bg-neutral300" aria-hidden />

            <div className="flex flex-col gap-3">
              <h3 className="font-gill text-base leading-110 text-darkblack lg:text-24">
                {educationCertifiedContent.whyTitle}
              </h3>
              <p className="font-gill text-sm font-light leading-110 text-neutral500 lg:max-w-[546px] lg:text-[20px]">
                {educationCertifiedContent.whyDescription}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-gill text-base leading-110 text-darkblack lg:text-24">
                {educationCertifiedContent.howTitle}
              </h3>
              <p className="font-gill text-sm font-light leading-110 text-neutral500 lg:max-w-[546px] lg:text-[20px]">
                {educationCertifiedContent.howDescription}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={220}>
            <div className="relative mx-auto h-[220px] w-full max-w-[320px] lg:mx-0 lg:h-[330px] lg:max-w-none">
              <div className="absolute bottom-0 left-1/2 size-[96px] -translate-x-1/2 overflow-hidden rounded-full border border-neutral400 lg:left-[66px] lg:size-[134px] lg:translate-x-0">
                <Image
                  src={educationPageImages.girdleScreenshot}
                  alt="Diamond girdle laser inscription"
                  fill
                  className="object-cover"
                  sizes="134px"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default EducationCertifiedSection;
