import Image from "next/image";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import type { NormalizedEducationCertificateSection } from "@/services/education/learn-about-diamonds-page.types";
import { cn } from "@/shared/utils/cn";
import {
  educationCertifiedSpec,
  educationPageImages,
  educationSectionTitleSpacingClassName,
} from "../data/content";

const spec = educationCertifiedSpec;
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
    <div className={`relative overflow-hidden ${logoClassName}`}>
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
      className={
        mobile
          ? "text-center font-gill text-sm font-light leading-110 text-darkblack"
          : "text-center font-gill text-sm leading-110 text-darkblack lg:text-base"
      }
    >
      {cert.label}
    </p>
  );
};

type EducationCertifiedSectionProps = {
  certificate: NormalizedEducationCertificateSection;
};

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
        "relative overflow-hidden bg-white px-4 py-16 max-md:h-[900px] md:bg-gray300 md:px-8 lg:px-10 lg:py-25",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute md:hidden"
        style={{
          left: spec.background.mobile.handLeft,
          top: spec.background.mobile.handTop,
          width: spec.background.mobile.handWidth,
          height: spec.background.mobile.handHeight,
        }}
      >
        <Image
          src={educationPageImages.certifiedHandBg}
          alt=""
          fill
          className="object-cover object-bottom"
          sizes="1091px"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_62%,rgba(251,250,246,0)_0%,rgba(251,250,246,0.65)_50%,rgba(251,250,246,1)_82%)] md:hidden"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute hidden md:block"
        style={{
          left: spec.background.desktop.handLeft,
          top: spec.background.desktop.handTop,
          width: spec.background.desktop.handWidth * 1.16,
          height: spec.background.desktop.handHeight * 1.24,
        }}
      >
        <div
          className="relative h-full w-full"
          style={{ transform: `rotate(${spec.background.desktop.handRotate}deg)` }}
        >
          <div
            className="relative"
            style={{
              width: spec.background.desktop.handWidth,
              height: spec.background.desktop.handHeight,
            }}
          >
            <Image
              src={educationPageImages.certifiedHandBg}
              alt=""
              fill
              className="object-cover object-bottom"
              sizes="1830px"
            />
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_72%_58%,rgba(244,243,238,0)_0%,rgba(244,243,238,0.55)_45%,rgba(244,243,238,1)_78%)] md:block"
      />

      <div className="relative mx-auto flex max-w-[1360px] flex-col items-center">
        <ScrollReveal
          as="h2"
          delayMs={0}
          className={`w-full ${educationSectionTitleSpacingClassName}`}
        >
          <span
            id="education-certified-title"
            className="block text-center font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px] lg:leading-none"
          >
            {certificate.title}
          </span>
        </ScrollReveal>

        <div className="flex w-full flex-col gap-6 md:hidden">
          <div className="grid grid-cols-2">
            {mobileCertifications.slice(0, 2).map((cert, index) => (
              <ScrollReveal key={cert.id} delayMs={80 + index * 80}>
                <div className="flex min-h-[101px] flex-col items-center justify-between gap-3">
                  <CertificationLogo cert={cert} mobile />
                  <CertificationLabel cert={cert} mobile />
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="grid grid-cols-2">
            {mobileCertifications.slice(2, 4).map((cert, index) => (
              <ScrollReveal key={cert.id} delayMs={240 + index * 80}>
                <div className="flex min-h-[101px] flex-col items-center justify-between gap-3">
                  <CertificationLogo cert={cert} mobile />
                  <CertificationLabel cert={cert} mobile />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="hidden w-full grid-cols-4 md:grid">
          {certificate.certifications.map((cert, index) => (
            <ScrollReveal key={cert.id} delayMs={80 + index * 80}>
              <div className="flex flex-col items-center justify-between gap-2 lg:min-h-[122px]">
                <CertificationLogo cert={cert} />
                <CertificationLabel cert={cert} />
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="flex w-full flex-col gap-8 md:hidden">
          <ScrollReveal delayMs={400}>
            <Image
              src={educationPageImages.certifiedDividerMobile}
              alt=""
              width={350}
              height={1}
              className="h-px w-[350px] max-w-full"
              aria-hidden
            />
          </ScrollReveal>

          <ScrollReveal delayMs={460}>
            <div className="flex w-full flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="font-gill text-base font-normal leading-110 text-darkblack">
                  {certificate.whyTitle}
                </h3>
                <p className="font-gill text-sm font-light leading-110 text-darkblack">
                  {certificate.whyDescription}
                </p>
              </div>

              <div className="flex flex-col gap-3">
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

        <div className="relative mt-4 hidden w-full md:mt-0 md:block md:h-[330px] lg:h-[330px]">
          <ScrollReveal
            delayMs={120}
            className="lg:absolute lg:left-0 lg:top-1/2 lg:w-[647px] lg:-translate-y-[calc(50%+42px)]"
          >
            <div className="flex flex-col gap-10">
              <div className="h-px w-full">
                <Image
                  src={educationPageImages.certifiedDivider}
                  alt=""
                  width={647}
                  height={1}
                  className="h-px w-full"
                  aria-hidden
                />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-gill text-24 font-normal leading-110 text-darkblack">
                  {certificate.whyTitle}
                </h3>
                <p className="font-gill text-[20px] font-light leading-110 text-neutral500 lg:max-w-[546px]">
                  {certificate.whyDescription}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-gill text-24 font-normal leading-110 text-darkblack">
                  {certificate.howTitle}
                </h3>
                <p className="font-gill text-[20px] font-light leading-110 text-neutral500 lg:max-w-[546px]">
                  {certificate.howDescription}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={220}>
            <div className="absolute left-[700px] top-[-189px] h-[548px] w-[641px]">
              <div
                className="absolute relative overflow-hidden rounded-full border-[#999999]"
                style={{
                  left: desktopVisual.calloutLeft,
                  top: desktopVisual.calloutTop,
                  width: desktopVisual.calloutSize,
                  height: desktopVisual.calloutSize,
                  borderWidth: desktopVisual.calloutBorder,
                }}
              >
                <Image
                  src={educationPageImages.girdleScreenshot}
                  alt="Diamond girdle laser inscription"
                  width={440}
                  height={448}
                  className="absolute max-w-none object-cover"
                  sizes="134px"
                  style={{
                    height: spec.visual.calloutCropHeight,
                    width: spec.visual.calloutCropWidth,
                    left: spec.visual.calloutCropLeft,
                    top: spec.visual.calloutCropTop,
                  }}
                />
              </div>

              <Image
                src={educationPageImages.certifiedCalloutLine}
                alt=""
                width={desktopVisual.lineWidth}
                height={desktopVisual.lineHeight}
                aria-hidden
                className="absolute"
                style={{
                  left: desktopVisual.lineLeft,
                  top: desktopVisual.lineTop,
                }}
              />
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 md:hidden" aria-hidden>
        <Image
          src={educationPageImages.certifiedCalloutLineMobile}
          alt=""
          width={mobileVisual.lineWidth}
          height={mobileVisual.lineHeight}
          className="absolute"
          style={{
            left: mobileVisual.lineLeft,
            top: mobileVisual.lineTop,
          }}
        />

        <div
          className="absolute z-10 overflow-hidden rounded-full border-[#999999]"
          style={{
            left: mobileVisual.calloutLeft,
            top: mobileVisual.calloutTop,
            width: mobileVisual.calloutSize,
            height: mobileVisual.calloutSize,
            borderWidth: mobileVisual.calloutBorder,
          }}
        >
          <Image
            src={educationPageImages.girdleScreenshot}
            alt=""
            width={440}
            height={448}
            className="absolute max-w-none object-cover"
            sizes="96px"
            style={{
              height: spec.visual.calloutCropHeight,
              width: spec.visual.calloutCropWidth,
              left: spec.visual.calloutCropLeft,
              top: spec.visual.calloutCropTop,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default EducationCertifiedSection;
