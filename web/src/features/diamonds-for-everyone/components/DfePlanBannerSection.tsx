import VerticalScrollLine from "@/features/about/components/VerticalScrollLine";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { NormalizedDfePlanIntro } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";

/** Figma 4453:39473 — radial gradient overlay (SVG export, 374×220 artboard). */
const PLAN_INTRO_MOBILE_GRADIENT = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg viewBox="0 0 374 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(18.9 16.428 -10.274 1.7049 101.5 70.131)"><stop stop-color="rgba(244,243,238,0)" offset="0"/><stop stop-color="rgba(255,255,255,1)" offset="1"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#grad)"/></svg>`,
)}")`;

const planIntroMobileGradientStyle = {
  backgroundImage: PLAN_INTRO_MOBILE_GRADIENT,
  backgroundSize: "100% 100%",
  backgroundRepeat: "no-repeat",
} as const;

type DfePlanBannerSectionProps = {
  planIntro: NormalizedDfePlanIntro;
};

const DfePlanBannerSection = ({ planIntro }: DfePlanBannerSectionProps) => {
  const texture = planIntro.textureImage;
  const textureMobileUrl =
    texture?.mobileUrl?.trim() || texture?.desktopUrl?.trim() || "";
  const textureDesktopUrl =
    texture?.desktopUrl?.trim() || texture?.mobileUrl?.trim() || "";
  const background = planIntro.backgroundImage;
  const desktopProductUrl =
    background?.desktopUrl?.trim() || background?.mobileUrl?.trim() || "";
  const desktopProductAlt =
    background?.desktopAlt?.trim() ||
    background?.mobileAlt?.trim() ||
    "";
  const hasMobileTexture = Boolean(textureMobileUrl);
  const hasDesktopProduct = Boolean(desktopProductUrl);

  return (
    <section
      aria-labelledby="dfe-plan-banner-title"
      className="relative flex flex-col items-center overflow-hidden bg-white py-16 md:min-h-[700px] md:py-104"
    >
      {/* Mobile — Figma 4453:39473 (texture + radial gradient) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 md:hidden"
      >
        {hasMobileTexture ? (
          <ResponsiveImage
            desktopSrc={textureDesktopUrl}
            mobileSrc={textureMobileUrl}
            alt=""
            width={374}
            height={220}
            sizes="100vw"
            quality={80}
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        ) : null}
        <div className="absolute inset-0" style={planIntroMobileGradientStyle} />
      </div>

      <PageContainer className="relative flex w-full justify-center max-md:px-0">
        <div className="flex w-full max-w-[592px] flex-col items-center px-6 text-center md:px-0">
          <ScrollReveal as="h2" delayMs={0} className="w-full">
            <span
              id="dfe-plan-banner-title"
              className="block font-larken text-2xl font-light leading-110 text-darkblack md:text-5xl"
            >
              {planIntro.title}
            </span>
          </ScrollReveal>

          {hasDesktopProduct ? (
            <ScrollReveal
              delayMs={100}
              className="relative mt-6 hidden h-[223px] w-[240px] overflow-hidden md:block"
            >
              <ResponsiveImage
                desktopSrc={desktopProductUrl}
                mobileSrc={desktopProductUrl}
                alt={desktopProductAlt}
                width={240}
                height={223}
                quality={80}
                sizes="240px"
                className="absolute top-[-17.89%] left-[-42.4%] h-[134.34%] max-w-none w-[187.23%] object-cover"
              />
            </ScrollReveal>
          ) : null}

          <VerticalScrollLine height={56} className="mt-6 hidden md:flex" />

          {planIntro.description ? (
            <ScrollReveal delayMs={220}>
              <p className="mt-3 w-full font-gill text-base font-light leading-110 text-neutral500 md:mt-6 md:text-xl md:text-darkblack">
                {planIntro.description}
              </p>
            </ScrollReveal>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
};

export default DfePlanBannerSection;
