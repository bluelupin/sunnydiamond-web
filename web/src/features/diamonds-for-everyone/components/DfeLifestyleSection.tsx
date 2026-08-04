"use client";

import Image from "next/image";
import type { NormalizedDfeEditorialBanner } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";

type DfeLifestyleSectionProps = {
  editorialBanner: NormalizedDfeEditorialBanner;
};

const DfeLifestyleSection = ({ editorialBanner }: DfeLifestyleSectionProps) => {
  return (
    <section aria-hidden className="relative h-[320px] w-full overflow-hidden md:h-[550px]">
      <Image
        src={editorialBanner.image.desktopUrl}
        alt={editorialBanner.image.alt}
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
    </section>
  );
};

export default DfeLifestyleSection;
