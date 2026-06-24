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
        className="relative h-[800px] w-full overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 mx-auto h-804 w-full max-w-1440">
          <Image
            src={imageSrc}
            alt=""
            fill
            priority={false}
            className="object-cover object-center"
            sizes="100vw"
            aria-hidden
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-400 w-full max-w-1440 bg-gradient-to-b from-transparent to-black/60 lg:backdrop-blur-[5px] lg:to-black/80"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[387px] mx-auto hidden h-417 w-full max-w-1440 backdrop-blur-[16px] lg:block"
        />

        <div className="absolute inset-x-0 bottom-[64px] flex justify-center px-4 md:px-8 lg:px-10">
          <div className="flex w-full max-w-[312px] flex-col items-center gap-6 lg:max-w-1360 lg:gap-40">
            <div className="flex flex-col items-center gap-3 text-center text-white lg:gap-4">
              <h2 id="visit-us-heading" className="font-larken text-32 font-light leading-110 lg:text-48">
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
              className="inline-flex border-b-[1.5px] border-white pb-2 font-gill text-sm uppercase leading-normal tracking-[0.252px] text-white max-lg:pb-2 lg:pb-1 lg:leading-110"
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
