"use client";

import Image from "next/image";
import { diamondsForEveryonePageContent } from "../data/content";

const DfeLifestyleSection = () => {
  const { lifestyle } = diamondsForEveryonePageContent;

  return (
    <section aria-hidden className="relative h-[320px] w-full overflow-hidden md:h-[550px]">
      <Image
        src={lifestyle.image.src}
        alt={lifestyle.image.alt}
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
    </section>
  );
};

export default DfeLifestyleSection;
