"use client";

import { useState } from "react";
import Image from "next/image";
import BookStoreVisitPanel from "./BookStoreVisitPanel";

type ProductDetailVisitUsSectionProps = {
  imageSrc: string;
};

const ProductDetailVisitUsSection = ({ imageSrc }: ProductDetailVisitUsSectionProps) => {
  const [isBookVisitOpen, setIsBookVisitOpen] = useState(false);

  return (
    <>
      <section
        aria-labelledby="visit-us-heading"
        className="grid h-804 w-full overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1"
      >
        <Image
          src={imageSrc}
          alt=""
          width={1440}
          height={804}
          priority={false}
          className="mx-auto h-full w-full max-w-1440 object-cover object-center"
          sizes="100vw"
          aria-hidden
        />

        <div
          aria-hidden
          className="pointer-events-none mx-auto h-400 w-full max-w-1440 self-end bg-gradient-to-t from-black/80 to-transparent"
        />

        <div className="z-10 flex self-end justify-center px-4 pb-16 md:px-8 lg:px-10">
          <div className="flex w-full max-w-311 flex-col items-center gap-6 lg:max-w-1360 lg:gap-40">
            <div className="flex flex-col items-center gap-3 text-center text-white lg:gap-4">
              <h2 id="visit-us-heading" className="font-larken text-32 font-light leading-110 lg:text-5xl">
                Visit Us
              </h2>
              <p className="font-gill text-base font-light leading-110 lg:text-20">
                <span className="lg:hidden">
                  Schedule your store visit and we&apos;ll be ready to welcome you.
                </span>
                <span className="hidden lg:inline">
                  Designs thoughtfully crafted to bring your vision to life
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsBookVisitOpen(true)}
              className="text-link-underline inline-flex border-b-[1.5px] border-white pb-2 font-gill text-sm uppercase leading-normal tracking-caption text-white max-lg:pb-2 lg:pb-1 lg:leading-110"
            >
              Book a Visit
            </button>
          </div>
        </div>
      </section>

      <BookStoreVisitPanel open={isBookVisitOpen} onClose={() => setIsBookVisitOpen(false)} />
    </>
  );
};

export default ProductDetailVisitUsSection;
