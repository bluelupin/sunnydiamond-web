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
      <div className="text-center font-gill text-sm font-light leading-110 text-darkblack">
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
        mobile ? "text-sm font-light" : "text-base font-normal",
      )}
    >
      {cert.label}
    </p>
  );
};

const GirdleCallout = ({ mobile = false }: { mobile?: boolean }) => {
  const visual = mobile ? mobileVisual : desktopVisual;

  return (
    <>
      <div
        className="absolute overflow-hidden rounded-full"
        style={{
          left: visual.calloutLeft,
          top: visual.calloutTop,
          width: visual.calloutSize,
          height: visual.calloutSize,
          borderWidth: visual.calloutBorder,
          borderColor: desktopVisual.calloutBorderColor,
          borderStyle: "solid",
        }}
      >
        <Image
          src={educationPageImages.girdleScreenshot}
          alt={mobile ? "" : "Diamond girdle laser inscription"}
          width={440}
          height={448}
          className="absolute max-w-none object-cover"
          sizes={`${Math.round(visual.calloutSize)}px`}
          style={{
            height: spec.visual.calloutCropHeight,
            width: spec.visual.calloutCropWidth,
            left: spec.visual.calloutCropLeft,
            top: spec.visual.calloutCropTop,
          }}
        />
      </div>

      <Image
        src={
          mobile
            ? educationPageImages.certifiedCalloutLineMobile
            : educationPageImages.certifiedCalloutLine
        }
        alt=""
        width={visual.lineWidth}
        height={visual.lineHeight}
        aria-hidden
        className="absolute"
        style={{
          left: visual.lineLeft,
          top: visual.lineTop,
        }}
      />
    </>
  );
};

const CertifiedHandBackground = ({ mobile = false }: { mobile?: boolean }) => {
  const background = mobile ? spec.background.mobile : spec.background.desktop;

  if (mobile) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute md:hidden left-[-560px] top-[200px]"
        style={{
          left: background.handLeft,
          top: background.handTop,
          width: background.handWidth,
          height: background.handHeight,
        }}
      >
        <Image
          src={educationPageImages.certifiedHandBg}
          alt=""
          fill
          className="object-cover object-bottom"
          sizes={`${background.handWidth}px`}
        />
      </div>
    );
  }

  const { handWrapperWidthScale, handWrapperHeightScale } = spec.background.desktop;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute hidden md:block left-[-190px] top-[-300px]"
      style={{
        // left: background.handLeft,
        // top: background.handTop,
        width: background.handWidth * handWrapperWidthScale,
        height: background.handHeight * handWrapperHeightScale,
      }}
    >
      <div
        className="relative h-full w-full"
        style={{ transform: `rotate(${spec.background.desktop.handRotate}deg)` }}
      >
        <div
          className="relative"
          style={{
            width: background.handWidth,
            height: background.handHeight,
          }}
        >
          <Image
            src={educationPageImages.certifiedHandBg}
            alt=""
            fill
            className="object-cover object-bottom"
            sizes={`${background.handWidth}px`}
          />
        </div>
      </div>
    </div>
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
        "relative overflow-hidden bg-white",
        "min-h-[900px] px-4 py-16",
        "md:min-h-[791px] md:bg-gray300 md:px-0 md:py-104",
      )}
    >
      <CertifiedHandBackground mobile />
      <CertifiedHandBackground />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_62%,rgba(251,250,246,0)_0%,rgba(251,250,246,0.65)_50%,rgba(251,250,246,1)_82%)] md:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_72%_58%,rgba(244,243,238,0)_0%,rgba(244,243,238,0.55)_45%,rgba(244,243,238,1)_78%)] md:block"
      />

      <div className="relative flex flex-col items-center md:gap[40px] gap-8 mx-auto w-full 2xl:max-w-1920 max-w-1440 px-5 md:px-8 lg:px-[40px] 2xl:px-[60px]">
        <ScrollReveal
          as="h2"
          delayMs={0}
          className="mb-8 w-full text-center md:mb-[40px]"
        >
          <span
            id="education-certified-title"
            className="block font-larken text-[32px] font-light leading-110 text-darkblack md:text-[48px] md:leading-none"
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
        <div className="mb-[40px] hidden w-full grid-cols-4 md:grid">
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
              <div className="flex flex-col" style={{ gap: copySpec.mobile.itemGap }}>
                <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                  {certificate.whyTitle}
                </h3>
                <p className="font-gill text-sm font-light leading-110 text-darkblack">
                  {certificate.whyDescription}
                </p>
              </div>

              <div className="flex flex-col" style={{ gap: copySpec.mobile.itemGap }}>
                <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                  {certificate.howTitle}
                </h3>
                <p className="font-gill text-sm font-light leading-110 text-darkblack">
                  {certificate.howDescription}
                </p>
              </div>
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
                <h3 className="font-gill text-2xl font-normal leading-110 text-darkblack">
                  {certificate.whyTitle}
                </h3>
                <p
                  className="font-gill text-xl font-light leading-110 text-neutral500"
                  style={{ maxWidth: copySpec.desktop.bodyMaxWidth }}
                >
                  {certificate.whyDescription}
                </p>
              </div>

              <div className="flex flex-col" style={{ gap: copySpec.desktop.itemGap }}>
                <h3 className="font-gill text-2xl font-normal leading-110 text-darkblack">
                  {certificate.howTitle}
                </h3>
                <p
                  className="font-gill text-xl font-light leading-110 text-neutral500"
                  style={{ maxWidth: copySpec.desktop.bodyMaxWidth }}
                >
                  {certificate.howDescription}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div
            className="pointer-events-none absolute"
            style={{
              left: desktopVisual.left,
              top: desktopVisual.top,
              width: desktopVisual.width,
              height: desktopVisual.height,
            }}
          >
            <GirdleCallout />
          </div>
        </div>
      </div>

      {/* Mobile girdle callout — Figma 692:28735 */}
      <div className="pointer-events-none absolute inset-0 md:hidden" aria-hidden>
        <GirdleCallout mobile />
      </div>
    </section>
  );
};

export default EducationCertifiedSection;
