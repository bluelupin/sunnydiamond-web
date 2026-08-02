"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import CareersChevronDownIcon from "@/features/careers/components/shared/CareersChevronDownIcon";
import { careersFormSelectChevronClassName } from "@/features/careers/constants/careersApplicationForm";
import Reveal from "@/shared/Animation/Reveal";
import { giftingPageContent } from "../data/content";
import {
  buildGiftFinderHref,
  type GiftingDiscoverOptions,
} from "../utils/giftFinderRoutes";

const fieldLabelClass = "font-gill text-base font-normal leading-110 text-[#2B2B2B]";
const fieldSelectClass =
  "h-14 w-full appearance-none bg-aboutInactive p-3 pr-10 font-gill text-base font-normal leading-110 text-darkblack outline-none";

type GiftingDiscoverFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
};

const GiftingDiscoverField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
}: GiftingDiscoverFieldProps) => (
  <div className="flex flex-col gap-2">
    <label className={fieldLabelClass} htmlFor={id}>{label}</label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(fieldSelectClass, !value && "text-gray600")}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <CareersChevronDownIcon className={careersFormSelectChevronClassName} />
    </div>
  </div>
);

type GiftingDiscoverSectionProps = {
  discoverOptions?: GiftingDiscoverOptions;
};

const GiftingDiscoverSection = ({ discoverOptions }: GiftingDiscoverSectionProps) => {
  const { discover } = giftingPageContent;
  const router = useRouter();

  const options = useMemo(
    () =>
      discoverOptions ?? {
        categories: discover.categories,
        occasions: discover.occasions,
        priceRanges: discover.priceRanges,
      },
    [discover, discoverOptions],
  );

  const [category, setCategory] = useState("");
  const [priceRangeLabel, setPriceRangeLabel] = useState("");
  const [occasion, setOccasion] = useState("");

  const handleSubmit = () => {
    const selectedPriceRange = options.priceRanges.find(
      (range) => range.label === priceRangeLabel,
    );

    router.push(
      buildGiftFinderHref({
        categoryUrlKey: category,
        occasionSlug: occasion,
        minPrice: selectedPriceRange?.min ?? 0,
        maxPrice: selectedPriceRange?.max ?? 0,
      }),
    );
  };

  const priceOptions = options.priceRanges.map((option) => ({
    label: option.label,
    value: option.label,
  }));

  return (
    <section
      id="discover-ideal-gift"
      aria-labelledby="gifting-discover-title"
      className="flex flex-col md:flex-row md:items-center md:justify-between md:pl-0 md:pr-10 md:pb-100"
    >
      <Reveal
        direction="up"
        className="relative h-[320px] w-full shrink-0 md:h-[521px] md:w-[732px]"
      >
        <Image
          src={discover.image.src}
          alt={discover.image.alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 732px"
        />
      </Reveal>

      <div className="flex w-full max-w-[530px] flex-col gap-6 px-4 py-16 md:shrink-0 md:gap-10 md:px-0 md:py-0">
        <div className="flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col gap-3 md:gap-4">
            <Reveal
              as="h2"
              id="gifting-discover-title"
              direction="up"
              className="font-larken text-[32px] font-light leading-110 text-darkblack md:text-5xl"
            >
              {discover.title}
            </Reveal>
            <Reveal
              as="p"
              direction="up"
              className="max-w-[306px] font-gill text-base font-light leading-110 text-neutral500 md:max-w-none md:text-xl"
            >
              {discover.description}
            </Reveal>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <GiftingDiscoverField
              id="gifting-finder-category"
              label={discover.categoryLabel}
              placeholder={discover.categoryPlaceholder}
              value={category}
              onChange={setCategory}
              options={options.categories}
            />
            <GiftingDiscoverField
              id="gifting-finder-price"
              label={discover.priceLabel}
              placeholder={discover.pricePlaceholder}
              value={priceRangeLabel}
              onChange={setPriceRangeLabel}
              options={priceOptions}
            />
            <GiftingDiscoverField
              id="gifting-finder-occasion"
              label={discover.occasionLabel}
              placeholder={discover.occasionPlaceholder}
              value={occasion}
              onChange={setOccasion}
              options={options.occasions}
            />
          </div>
        </div>

        <Reveal direction="up">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex h-14 items-center justify-center self-start bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 md:w-full md:self-auto"
          >
            {discover.submitLabel}
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default GiftingDiscoverSection;
