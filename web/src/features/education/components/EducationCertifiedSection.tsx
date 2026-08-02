import Image from "next/image";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import type { NormalizedEducationCertificateSection } from "@/services/education/learn-about-diamonds-page.types";
import { cn } from "@/shared/utils/cn";
import {
  educationCertifiedSpec,
  educationPageImages,
} from "../data/content";

const spec = educationCertifiedSpec;
const sectionSpec = spec.section;
const logosSpec = spec.logos;
const copySpec = spec.copy;
const desktopVisual = spec.visual.desktop;
const mobileVisual = spec.visual.mobile;

type CertificationItem = NormalizedEducationCertificateSection["certifications"][number];

const CertificationLogo = ({
  cert,
  mobile = false,
}: {
  cert: CertificationItem;
  mobile?: boolean;
}) => {
  const logoClassName = mobile ? cert.mobileLogoClassName : cert.logoClassName;
  const imageClassName = cert.usesCmsLogo
    ? "size-full object-contain"
    : cert.imageClassName;

  const logoImage = (
    <div className={cn("relative overflow-hidden", logoClassName)}>
      <Image
        src={cert.logoUrl}
        alt=""
        fill
        className={imageClassName}
        sizes="120px"
      />
    </div>
  );

  if (!mobile && cert.logoWrapClassName) {
    return <div className={cert.logoWrapClassName}>{logoImage}</div>;
  }

  return logoImage;
};

const CertificationLabel = ({
  cert,
  mobile = false,
}: {
  cert: CertificationItem;
  mobile?: boolean;
}) => {
  if (mobile && cert.mobileLabelLines) {
    return (
      <div className="max-w-[100px] mx-auto text-center font-gill text-sm font-light leading-110 text-darkblack">
        {cert.mobileLabelLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    );
  }

  return (
    <p
      className={cn(
        "text-center font-gill leading-110 text-darkblack",
        mobile ? "text-sm font-light" : "lg:text-base text-sm font-normal",
      )}
    >
      {cert.label}
    </p>
  );
};

type EducationCertifiedSectionProps = {
  certificate: NormalizedEducationCertificateSection;
};

/** Figma 692:28885 — Certified Brilliance (692:29096 desktop / 692:28735 mobile) */
const EducationCertifiedSection = ({ certificate }: EducationCertifiedSectionProps) => {
  const certificationMap = Object.fromEntries(
    certificate.certifications.map((cert) => [cert.id, cert]),
  );

  const mobileCertifications = certificate.mobileLogoOrder
    .map((id) => certificationMap[id])
    .filter((cert): cert is CertificationItem => cert != null);

  return (
    <section
      aria-labelledby="education-certified-title"
      className={cn(
        "education-certified-section relative overflow-hidden",
        "min-h-[900px] px-4 py-16",
        "lg:min-h-[791px] md:px-0 md:py-104",
      )}
    >
      <div className="relative flex flex-col items-center md:gap[40px] gap-8 mx-auto w-full 2xl:max-w-1920 max-w-1440 px-0 md:px-8 lg:px-10 2xl:px-[60px]">
        <ScrollReveal
          as="h2"
          delayMs={0}
          className="mb-8 w-full text-center md:mb-10"
        >
          <span
            id="education-certified-title"
            className="block font-larken text-32 font-light leading-110 text-darkblack md:text-5xl md:leading-none"
          >
            {certificate.title}
          </span>
        </ScrollReveal>

        {/* Mobile logos — Figma 692:28735 */}
        <div
          className="mb-8 flex w-full flex-col md:hidden"
          style={{ gap: logosSpec.mobile.rowGap }}
        >
          <div className="grid grid-cols-2">
            {mobileCertifications.slice(0, 2).map((cert, index) => (
              <ScrollReveal key={cert.id} delayMs={80 + index * 80}>
                <div
                  className="flex flex-col items-center justify-between gap-3"
                  style={{ minHeight: logosSpec.mobile.rowMinHeight }}
                >
                  <CertificationLogo cert={cert} mobile />
                  <CertificationLabel cert={cert} mobile />
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="grid grid-cols-2">
            {mobileCertifications.slice(2, 4).map((cert, index) => (
              <ScrollReveal key={cert.id} delayMs={240 + index * 80}>
                <div
                  className="flex flex-col items-center justify-between gap-3"
                  style={{ minHeight: logosSpec.mobile.rowMinHeight }}
                >
                  <CertificationLogo cert={cert} mobile />
                  <CertificationLabel cert={cert} mobile />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Desktop logos — Figma 692:29096 */}
        <div className="mb-10 hidden w-full grid-cols-4 md:grid">
          {certificate.certifications.map((cert, index) => (
            <ScrollReveal key={cert.id} delayMs={80 + index * 80}>
              <div
                className="flex flex-col items-center justify-between gap-2"
                style={{ minHeight: logosSpec.desktop.columnMinHeight }}
              >
                <CertificationLogo cert={cert} />
                <CertificationLabel cert={cert} />
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile copy */}
        <div
          className="flex w-full flex-col md:hidden"
          style={{ gap: copySpec.mobile.blockGap }}
        >
          <ScrollReveal delayMs={400}>
            <Image
              src={educationPageImages.certifiedDividerMobile}
              alt=""
              width={copySpec.mobile.dividerWidth}
              height={1}
              className="h-px max-w-full"
              style={{ width: copySpec.mobile.dividerWidth }}
              aria-hidden
            />
          </ScrollReveal>

          <ScrollReveal delayMs={460}>
            <div className="flex flex-col" style={{ gap: copySpec.mobile.blockGap }}>
              {certificate.whyTitle || certificate.whyDescription ? (
                <div className="flex flex-col" style={{ gap: copySpec.mobile.itemGap }}>
                  {certificate.whyTitle ? (
                    <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                      {certificate.whyTitle}
                    </h3>
                  ) : null}
                  {certificate.whyDescription ? (
                    <p className="font-gill text-sm font-light leading-110 text-darkblack">
                      {certificate.whyDescription}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {certificate.howTitle || certificate.howDescription ? (
                <div className="flex flex-col" style={{ gap: copySpec.mobile.itemGap }}>
                  {certificate.howTitle ? (
                    <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                      {certificate.howTitle}
                    </h3>
                  ) : null}
                  {certificate.howDescription ? (
                    <p className="font-gill text-sm font-light leading-110 text-darkblack">
                      {certificate.howDescription}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </ScrollReveal>
        </div>

        {/* Desktop copy + girdle visual — Figma 692:29096 */}
        <div className="relative hidden w-full md:block">
          <ScrollReveal delayMs={120} className="w-full max-w-[647px]">
            <div className="flex flex-col" style={{ gap: copySpec.desktop.blockGap }}>
              <div className="h-px w-full">
                <Image
                  src={educationPageImages.certifiedDivider}
                  alt=""
                  width={copySpec.desktop.width}
                  height={1}
                  className="h-px w-full"
                  aria-hidden
                />
              </div>

              <div className="flex flex-col" style={{ gap: copySpec.desktop.itemGap }}>
                {certificate.whyTitle ? (
                  <h3 className="font-gill text-2xl font-normal leading-110 text-darkblack">
                    {certificate.whyTitle}
                  </h3>
                ) : null}
                {certificate.whyDescription ? (
                  <p
                    className="font-gill text-xl font-light leading-110 text-neutral500"
                    style={{ maxWidth: copySpec.desktop.bodyMaxWidth }}
                  >
                    {certificate.whyDescription}
                  </p>
                ) : null}
              </div>

              {certificate.howTitle || certificate.howDescription ? (
                <div className="flex flex-col" style={{ gap: copySpec.desktop.itemGap }}>
                  {certificate.howTitle ? (
                    <h3 className="font-gill text-2xl font-normal leading-110 text-darkblack">
                      {certificate.howTitle}
                    </h3>
                  ) : null}
                  {certificate.howDescription ? (
                    <p
                      className="font-gill text-xl font-light leading-110 text-neutral500"
                      style={{ maxWidth: copySpec.desktop.bodyMaxWidth }}
                    >
                      {certificate.howDescription}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default EducationCertifiedSection;
