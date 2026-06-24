"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Heart, Plus, Store, Truck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { Product } from "@/features/products/data/products";
import type { ProductDetailContent, ProductDetailPricing } from "@/features/products/types/productDetail";
import {
  AttributeSeparator,
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "./shared";
import ScheduleVideoCallPanel from "./ScheduleVideoCallPanel";
import TryAtHomePanel from "./TryAtHomePanel";
import PersonaliseProductPanel from "./PersonaliseProductPanel";
import MetalEngravingPanel from "./MetalEngravingPanel";
import RingSizeChartPanel from "./RingSizeChartPanel";
import DeliveryStoreJourneyPanel from "./DeliveryStoreJourneyPanel";
import type { EngravingSelection } from "@/features/products/constants/engraving";

type ProductDetailSidebarProps = {
  product: Product;
  content: ProductDetailContent;
  pricing: ProductDetailPricing;
  onAddToBag: () => void;
};

const ProductDetailSidebar = ({
  product,
  content,
  pricing,
  onAddToBag,
}: ProductDetailSidebarProps) => {
  const [selectedMetal, setSelectedMetal] = useState(content.metalColors[0]?.id ?? "gold");
  const [ringSize, setRingSize] = useState<string>("");
  const [engravingSelection, setEngravingSelection] = useState<EngravingSelection | null>(null);
  const [isEngravingOpen, setIsEngravingOpen] = useState(false);
  const [isRingSizeChartOpen, setIsRingSizeChartOpen] = useState(false);
  const [isDeliveryStoreOpen, setIsDeliveryStoreOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zipCode, setZipCode] = useState("122002");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isTryAtHomeOpen, setIsTryAtHomeOpen] = useState(false);
  const [isPersonaliseOpen, setIsPersonaliseOpen] = useState(false);

  const activeMetal = content.metalColors.find((color) => color.id === selectedMetal);

  const toggleAccordion = (id: string) => {
    setOpenAccordion((current) => (current === id ? null : id));
  };

  return (
    <aside className="flex flex-col gap-10 px-4 pb-16 pt-8 max-lg:gap-40 lg:sticky lg:top-8 lg:self-start lg:gap-10 lg:px-0 lg:pb-0 lg:pt-0">
      <div className="flex flex-col gap-6 max-lg:gap-6">
        <header className="flex flex-col gap-4 max-lg:gap-3">
          <ul className="m-0 flex list-none flex-wrap items-center gap-3 p-0 max-lg:gap-2">
            {content.attributes.map((attribute, index) => (
              <li key={attribute} className="flex items-center gap-3 max-lg:gap-2">
                {index > 0 ? <AttributeSeparator /> : null}
                <span className="font-gill text-base font-light leading-110 text-neutral500 max-lg:text-sm">
                  {attribute}
                </span>
              </li>
            ))}
          </ul>
          <h1 className="font-larken text-24 font-light leading-110 text-darkblack lg:text-[32px]">
            {product.name}
          </h1>
        </header>

        <div className="flex flex-col gap-4 max-lg:gap-4">
          <p className="font-gill text-base leading-110 text-darkblack">Metal Color</p>
          <div className="flex flex-col gap-2 max-lg:gap-2">
            <div className="flex items-center gap-6 max-lg:gap-6">
              {content.metalColors.map((metal) => (
                <button
                  key={metal.id}
                  type="button"
                  aria-label={metal.label}
                  aria-pressed={selectedMetal === metal.id}
                  onClick={() => setSelectedMetal(metal.id)}
                  className={cn(
                    "size-[52px] shrink-0 transition-shadow",
                    selectedMetal === metal.id
                      ? "border-2 border-darkblack max-lg:border-2 max-lg:border-darkblack lg:ring-2 lg:ring-darkblack lg:ring-offset-2"
                      : "",
                  )}
                  style={{ backgroundColor: metal.color }}
                />
              ))}
            </div>
            <p className="font-gill text-base leading-110 text-neutral500 max-lg:text-neutral500">
              {activeMetal?.label}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 max-lg:gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="font-gill text-base leading-[1.45] tracking-[0.16px] text-darkblack">Ring Size</p>
              <DetailTextLink onClick={() => setIsRingSizeChartOpen(true)}>Find your size</DetailTextLink>
            </div>
            <Select value={ringSize} onValueChange={setRingSize}>
              <SelectTrigger className="h-14 rounded-none border-0 bg-aboutInactive px-3 font-gill text-base text-darkblack focus:ring-0">
                <SelectValue placeholder="-select-" />
              </SelectTrigger>
              <SelectContent>
                {content.ringSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={() => setIsEngravingOpen(true)}
            className="flex h-14 w-full items-center justify-between bg-aboutInactive px-3 text-left"
          >
            <span className="font-gill text-base leading-110 text-darkblack">
              {engravingSelection?.text ?? "Metal Engraving (Optional)"}
            </span>
            <Plus size={20} strokeWidth={1.5} aria-hidden className="shrink-0 text-darkblack max-lg:size-6" />
          </button>
        </div>
      </div>

      <MetalEngravingPanel
        open={isEngravingOpen}
        onClose={() => setIsEngravingOpen(false)}
        previewImage={content.engravingPreviewImage}
        initialValue={engravingSelection}
        onSave={setEngravingSelection}
      />

      <RingSizeChartPanel open={isRingSizeChartOpen} onClose={() => setIsRingSizeChartOpen(false)} />

      <DeliveryStoreJourneyPanel
        open={isDeliveryStoreOpen}
        onClose={() => setIsDeliveryStoreOpen(false)}
        city="Coimbatore"
      />

      <div className="flex flex-col gap-4 max-lg:gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3 font-gill text-20 leading-110 text-darkblack max-lg:gap-3 lg:text-24">
            <span>₹{formatJewelleryPrice(pricing.price)}</span>
            <span className="text-gray600 line-through">₹{formatJewelleryPrice(pricing.originalPrice)}</span>
          </div>
          <DetailTextLink href="/contact">View Price Breakup</DetailTextLink>
        </div>

        <div className="flex gap-2 max-lg:gap-2">
          <DetailDarkButton className="flex-1 max-lg:uppercase" onClick={onAddToBag}>
            Add to Bag
          </DetailDarkButton>
          <button
            type="button"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            onClick={() => setIsWishlisted((value) => !value)}
            className="inline-flex size-14 shrink-0 items-center justify-center bg-aboutInactive max-lg:size-14"
          >
            <Heart
              size={24}
              strokeWidth={1.5}
              className={cn(isWishlisted && "fill-darkblack text-darkblack")}
            />
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer flex-col gap-3 bg-aboutInactive p-4 max-lg:gap-3 max-lg:p-4">
        <span className="flex items-center gap-2 max-lg:gap-2">
          <input
            type="checkbox"
            checked={isGift}
            onChange={(event) => setIsGift(event.target.checked)}
            className="size-4 border-[0.8px] border-darkblack accent-darkblack"
          />
          <span className="font-gill text-base leading-110 text-darkblack">Mark this as a gift</span>
        </span>
        <span className="font-gill text-base font-light leading-110 text-darkblack">
          Make this a special with a gift bag and a personalized message.
        </span>
      </label>

      <div className="flex flex-col gap-4 max-lg:gap-4">
        <p className="font-gill text-base leading-110 text-darkblack">Delivery and Stores</p>
        <div className="flex gap-2 max-lg:gap-2">
          <input
            type="text"
            value={zipCode}
            onChange={(event) => setZipCode(event.target.value)}
            aria-label="Delivery zip code"
            className="h-14 flex-1 border border-neutral500 px-6 font-gill text-base text-darkblack outline-none max-lg:px-6"
          />
          <DetailDarkButton className="w-auto shrink-0 px-7 max-lg:uppercase">Check</DetailDarkButton>
        </div>
        <div className="flex flex-col gap-3 max-lg:gap-2">
          <div className="flex items-center gap-2 max-lg:gap-2">
            <Truck size={32} strokeWidth={1.25} aria-hidden className="max-lg:size-6" />
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              Estimated delivery May 12 2026
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 max-lg:items-start max-lg:gap-2">
            <Store size={32} strokeWidth={1.25} aria-hidden className="shrink-0 max-lg:size-6" />
            <div className="flex flex-col gap-3 pt-1 max-lg:gap-3 max-lg:pt-1 lg:flex-row lg:flex-wrap lg:items-center lg:gap-2 lg:pt-0">
              <p className="font-gill text-base font-light leading-110 text-darkblack">
                Available now at nearest store
              </p>
              <DetailTextLink onClick={() => setIsDeliveryStoreOpen(true)} className="max-lg:uppercase">
                Coimbatore
              </DetailTextLink>
            </div>
          </div>
        </div>
      </div>

      <section aria-label="Shopping benefits" className="flex flex-col gap-6 max-lg:-mx-4 max-lg:gap-6 max-lg:w-[calc(100%+32px)]">
        <div className="flex items-center justify-between max-lg:px-4">
          <h2 className="font-gill text-20 leading-110 text-darkblack lg:text-24">With Sunny, you get</h2>
          <DetailTextLink href="/about">T&amp;C Apply</DetailTextLink>
        </div>
        <ul className="m-0 flex list-none flex-col gap-6 bg-[#F8F1F6] p-0 max-lg:px-4 max-lg:py-10 lg:flex-row lg:gap-0 lg:divide-x lg:divide-neutral300">
          {content.benefits.map((benefit, index) => (
            <li
              key={benefit.label}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-2 px-3 py-6 text-center max-lg:gap-2 max-lg:px-3 max-lg:py-4 lg:py-6",
                index > 0 && "max-lg:border-t max-lg:border-neutral300 max-lg:pt-6",
              )}
            >
              <div className="hidden size-10 items-center justify-center max-lg:flex">
                {benefit.icon ? (
                  <Image src={benefit.icon} alt="" width={40} height={40} aria-hidden />
                ) : (
                  <Truck size={40} strokeWidth={1.25} aria-hidden className="text-darkblack" />
                )}
              </div>
              <span className="font-gill text-base leading-110 text-darkblack max-lg:whitespace-nowrap lg:hidden">
                {benefit.mobileLabel}
              </span>
              <span className="hidden font-gill text-base leading-110 text-darkblack lg:inline">
                {benefit.lines[0]}
                <br />
                {benefit.lines[1]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Customer support" className="relative overflow-hidden bg-[#F2E3ED] px-6 py-8 max-lg:px-4 max-lg:py-6">
        <div className="flex max-w-[365px] flex-col gap-10 max-lg:max-w-none max-lg:gap-6">
          <div className="flex flex-col gap-3 max-lg:gap-3">
            <h2 className="font-larken text-24 font-light leading-110 text-darkblack max-lg:text-20">
              We&apos;re here for you
            </h2>
            <p className="max-w-[267px] font-gill text-base font-light leading-110 text-darkblack max-lg:text-sm">
              Our salesperson will personally help you choose the right diamond.
            </p>
          </div>
          <div className="flex flex-col gap-3 max-lg:gap-4">
            <DetailDarkButton
              onClick={() => setIsVideoCallOpen(true)}
              className="max-lg:h-12 max-lg:uppercase"
            >
              Schedule a Video Call
            </DetailDarkButton>
            <DetailTextLink onClick={() => setIsTryAtHomeOpen(true)} className="max-lg:uppercase">
              Try at Home
            </DetailTextLink>
          </div>
        </div>
      </section>

      <ScheduleVideoCallPanel
        open={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        product={product}
      />

      <TryAtHomePanel
        open={isTryAtHomeOpen}
        onClose={() => setIsTryAtHomeOpen(false)}
        product={product}
      />

      <PersonaliseProductPanel
        open={isPersonaliseOpen}
        onClose={() => setIsPersonaliseOpen(false)}
        product={product}
      />

      <section aria-label="Product information" className="flex flex-col gap-3 max-lg:gap-4">
        {content.accordions.map((accordion) => {
          const isOpen = openAccordion === accordion.id;

          return (
            <div key={accordion.id} className="border-b border-neutral300 max-lg:border-neutral300/50">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleAccordion(accordion.id)}
                className="flex h-14 w-full items-center justify-between text-left max-lg:h-10"
              >
                <span className="font-gill text-24 leading-110 text-darkblack max-lg:text-20">
                  {accordion.title}
                </span>
                {isOpen ? (
                  <ChevronUp size={32} strokeWidth={1.25} aria-hidden className="max-lg:size-6" />
                ) : (
                  <>
                    <Plus size={24} strokeWidth={1.5} aria-hidden className="lg:hidden" />
                    <ChevronDown size={32} strokeWidth={1.25} aria-hidden className="hidden lg:block" />
                  </>
                )}
              </button>
              {isOpen ? (
                <p className="pb-6 font-gill text-base font-light leading-110 text-neutral500 max-lg:pb-4">
                  {accordion.content}
                </p>
              ) : null}
            </div>
          );
        })}
      </section>

      <section
        aria-label="Personalisation"
        className="relative flex min-h-[260px] items-center justify-between overflow-hidden bg-chalkCard pl-6 max-lg:min-h-0 max-lg:items-end max-lg:pl-4 max-lg:py-6 max-lg:pr-0"
      >
        <div className="flex max-w-[276px] flex-col gap-10 py-6 max-lg:max-w-[172px] max-lg:gap-6 max-lg:py-0">
          <div className="flex flex-col gap-3 max-lg:gap-3">
            <h2 className="font-larken text-24 font-light leading-110 text-darkblack max-lg:text-20">
              Personalise this for you
            </h2>
            <p className="font-gill text-base font-light leading-110 text-darkblack max-lg:text-sm">
              Change the gemstone and much more to make it truly yours!
            </p>
          </div>
          <DetailOutlineButton
            className="w-fit max-lg:h-14 max-lg:uppercase"
            onClick={() => setIsPersonaliseOpen(true)}
          >
            Get in Touch
          </DetailOutlineButton>
        </div>
        <div className="relative h-[118px] w-[177px] shrink-0 overflow-hidden max-lg:block lg:hidden">
          <Image
            src={content.personaliseImage}
            alt=""
            fill
            className="object-cover"
            sizes="177px"
          />
        </div>
        <div className="relative hidden h-[213px] w-[322px] shrink-0 overflow-hidden lg:block">
          <Image
            src={content.personaliseImage}
            alt=""
            fill
            className="object-cover"
            sizes="322px"
          />
        </div>
      </section>
    </aside>
  );
};

export default ProductDetailSidebar;
