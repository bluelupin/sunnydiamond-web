"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import type { NormalizedDfeEditorialBanner } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";

type DfeLifestyleSectionProps = {
  editorialBanner: NormalizedDfeEditorialBanner;
};

const DfeLifestyleSection = ({ editorialBanner }: DfeLifestyleSectionProps) => {
  const { image } = editorialBanner;

  return (
    <section aria-hidden className="relative h-[320px] w-full overflow-hidden md:h-[550px]">
      <ResponsiveImage
        desktopSrc={image.desktopUrl}
        mobileSrc={image.mobileUrl}
        alt={image.desktopAlt || image.mobileAlt || ""}
        desktopAlt={image.desktopAlt}
        mobileAlt={image.mobileAlt}
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
    </section>
  );
};

export default DfeLifestyleSection;
