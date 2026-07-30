"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import CareersChevronDownIcon from "@/features/careers/components/shared/CareersChevronDownIcon";
import { careersFormSelectChevronClassName } from "@/features/careers/constants/careersApplicationForm";
import { buildJewelleryCategoryHref } from "@/features/jewellery-product/utils/jewelleryRoutes";
import Reveal from "@/shared/Animation/Reveal";
import { giftingPageContent } from "../data/content";

const fieldLabelClass = "font-gill text-base font-normal leading-110 text-[#2B2B2B]";
const fieldSelectClass =
  "h-14 w-full appearance-none bg-aboutInactive p-3 pr-10 font-gill text-base font-normal leading-110 text-darkblack outline-none";

function buildGiftFinderHref({
  categoryUrlKey,
  occasion,
}: {
  categoryUrlKey: string;
  occasion: string;
}): string {
  const baseHref = categoryUrlKey
    ? buildJewelleryCategoryHref(categoryUrlKey)
    : "/jewellery";

  if (!occasion) {
    return baseHref;
  }

  const separator = baseHref.includes("?") ? "&" : "?";
  return `${baseHref}${separator}occasion=${encodeURIComponent(occasion)}`;
}

const GiftingDiscoverSection = () => {
  const { discover } = giftingPageContent;
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [occasion, setOccasion] = useState("");

  const handleSubmit = () => {
    router.push(
      buildGiftFinderHref({
        categoryUrlKey: category,
        occasion,
      }),
    );
  };

  return (
    <section
      id="discover-ideal-gift"
      aria-labelledby="gifting-discover-title"
      className="flex flex-col items-center gap-10 px-4 pb-16 md:flex-row md:items-center md:justify-between md:gap-0 md:pl-0 md:pr-10 md:pb-100"
    >
      <Reveal direction="up" className="relative h-[320px] w-full shrink-0 md:h-[521px] md:w-[732px]">
        <Image
          src={discover.image.src}
          alt={discover.image.alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 732px"
        />
      </Reveal>

      <div className="flex w-full max-w-[530px] flex-col gap-10 md:shrink-0">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Reveal
              as="h2"
              id="gifting-discover-title"
              direction="up"
              className="font-larken text-5xl font-light leading-110 text-darkblack"
            >
              {discover.title}
            </Reveal>
            <Reveal
              as="p"
              direction="up"
              className="font-gill text-xl font-light leading-110 text-neutral500"
            >
              {discover.description}
            </Reveal>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className={fieldLabelClass} htmlFor="gifting-finder-category">
                {discover.categoryLabel}
              </label>
              <div className="relative">
                <select
                  id="gifting-finder-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={cn(fieldSelectClass, !category && "text-gray600")}
                >
                  <option value="">{discover.categoryPlaceholder}</option>
                  {discover.categories.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <CareersChevronDownIcon className={careersFormSelectChevronClassName} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={fieldLabelClass} htmlFor="gifting-finder-price">
                {discover.priceLabel}
              </label>
              <div className="relative">
                <select
                  id="gifting-finder-price"
                  value={priceRange}
                  onChange={(event) => setPriceRange(event.target.value)}
                  className={cn(fieldSelectClass, !priceRange && "text-gray600")}
                >
                  <option value="">{discover.pricePlaceholder}</option>
                  {discover.priceRanges.map((option) => (
                    <option key={option.label} value={option.label}>{option.label}</option>
                  ))}
                </select>
                <CareersChevronDownIcon className={careersFormSelectChevronClassName} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={fieldLabelClass} htmlFor="gifting-finder-occasion">
                {discover.occasionLabel}
              </label>
              <div className="relative">
                <select
                  id="gifting-finder-occasion"
                  value={occasion}
                  onChange={(event) => setOccasion(event.target.value)}
                  className={cn(fieldSelectClass, !occasion && "text-gray600")}
                >
                  <option value="">{discover.occasionPlaceholder}</option>
                  {discover.occasions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <CareersChevronDownIcon className={careersFormSelectChevronClassName} />
              </div>
            </div>
          </div>
        </div>

        <Reveal direction="up">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            {discover.submitLabel}
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default GiftingDiscoverSection;
