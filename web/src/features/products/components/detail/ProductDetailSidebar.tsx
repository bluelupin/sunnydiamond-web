"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Heart, Store, Truck } from "lucide-react";
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
  const [engraving, setEngraving] = useState<string>("");
  const [isGift, setIsGift] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zipCode, setZipCode] = useState("122002");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isTryAtHomeOpen, setIsTryAtHomeOpen] = useState(false);

  const activeMetal = content.metalColors.find((color) => color.id === selectedMetal);

  const toggleAccordion = (id: string) => {
    setOpenAccordion((current) => (current === id ? null : id));
  };

  return (
    <aside className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4">
          <ul className="m-0 flex list-none flex-wrap items-center gap-3 p-0">
            {content.attributes.map((attribute, index) => (
              <li key={attribute} className="flex items-center gap-3">
                {index > 0 ? <AttributeSeparator /> : null}
                <span className="font-gill text-base font-light leading-110 text-neutral500">{attribute}</span>
              </li>
            ))}
          </ul>
          <h1 className="font-larken text-[32px] font-light leading-110 text-darkblack">{product.name}</h1>
        </header>

        <div className="flex flex-col gap-4">
          <p className="font-gill text-base leading-110 text-darkblack">Metal Color</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-6">
              {content.metalColors.map((metal) => (
                <button
                  key={metal.id}
                  type="button"
                  aria-label={metal.label}
                  aria-pressed={selectedMetal === metal.id}
                  onClick={() => setSelectedMetal(metal.id)}
                  className={cn(
                    "size-[52px] shrink-0 transition-shadow",
                    selectedMetal === metal.id && "ring-2 ring-darkblack ring-offset-2",
                  )}
                  style={{ backgroundColor: metal.color }}
                />
              ))}
            </div>
            <p className="font-gill text-base leading-110 text-neutral500">{activeMetal?.label}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="font-gill text-base leading-[1.45] tracking-[0.16px] text-darkblack">Ring Size</p>
              <DetailTextLink href="/contact">Find your size</DetailTextLink>
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

          <Select value={engraving} onValueChange={setEngraving}>
            <SelectTrigger className="h-14 rounded-none border-0 bg-aboutInactive px-3 font-gill text-base text-darkblack focus:ring-0">
              <SelectValue placeholder="Metal Engraving (Optional)" />
            </SelectTrigger>
            <SelectContent>
              {content.engravingOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3 font-gill text-24 leading-110 text-darkblack">
            <span>₹{formatJewelleryPrice(pricing.price)}</span>
            <span className="text-gray600 line-through">₹{formatJewelleryPrice(pricing.originalPrice)}</span>
          </div>
          <DetailTextLink href="/contact">View Price Breakup</DetailTextLink>
        </div>

        <div className="flex gap-2">
          <DetailDarkButton className="flex-1" onClick={onAddToBag}>
            Add to Bag
          </DetailDarkButton>
          <button
            type="button"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            onClick={() => setIsWishlisted((value) => !value)}
            className="inline-flex size-14 shrink-0 items-center justify-center bg-aboutInactive"
          >
            <Heart
              size={24}
              strokeWidth={1.5}
              className={cn(isWishlisted && "fill-darkblack text-darkblack")}
            />
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer flex-col gap-3 bg-aboutInactive p-4">
        <span className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isGift}
            onChange={(event) => setIsGift(event.target.checked)}
            className="size-4 border border-darkblack accent-darkblack"
          />
          <span className="font-gill text-base leading-110 text-darkblack">Mark this as a gift</span>
        </span>
        <span className="font-gill text-base font-light leading-110 text-darkblack">
          Make this a special with a gift bag and a personalized message.
        </span>
      </label>

      <div className="flex flex-col gap-4">
        <p className="font-gill text-base leading-110 text-darkblack">Delivery and Stores</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={zipCode}
            onChange={(event) => setZipCode(event.target.value)}
            aria-label="Delivery zip code"
            className="h-14 flex-1 border border-neutral500 px-6 font-gill text-base text-darkblack outline-none"
          />
          <DetailDarkButton className="w-auto shrink-0 px-7">Check</DetailDarkButton>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Truck size={32} strokeWidth={1.25} aria-hidden />
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              Estimated delivery May 12 2026
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Store size={32} strokeWidth={1.25} aria-hidden />
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              Available now at nearest store
            </p>
            <DetailTextLink href="/contact">Coimbatore</DetailTextLink>
          </div>
        </div>
      </div>

      <section aria-label="Shopping benefits" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-gill text-24 leading-110 text-darkblack">With Sunny, you get</h2>
          <DetailTextLink href="/about">T&amp;C Apply</DetailTextLink>
        </div>
        <ul className="m-0 flex list-none divide-x divide-neutral300 bg-[#F8F1F6] p-0">
          {content.benefits.map((benefit) => (
            <li
              key={benefit.label}
              className="flex flex-1 flex-col items-center justify-center gap-2 px-3 py-6 text-center"
            >
              <span className="font-gill text-base leading-110 text-darkblack">
                {benefit.lines[0]}
                <br />
                {benefit.lines[1]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Customer support" className="relative overflow-hidden bg-[#F2E3ED] px-6 py-8">
        <div className="flex max-w-[365px] flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="font-larken text-24 font-light leading-110 text-darkblack">We&apos;re here for you</h2>
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              Our salesperson will personally help you choose the right diamond.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <DetailDarkButton onClick={() => setIsVideoCallOpen(true)}>
              Schedule a Video Call
            </DetailDarkButton>
            <DetailTextLink onClick={() => setIsTryAtHomeOpen(true)}>Try at Home</DetailTextLink>
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

      <section aria-label="Product information" className="flex flex-col gap-3">
        {content.accordions.map((accordion) => {
          const isOpen = openAccordion === accordion.id;

          return (
            <div key={accordion.id} className="border-b border-neutral300">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleAccordion(accordion.id)}
                className="flex h-14 w-full items-center justify-between text-left"
              >
                <span className="font-gill text-24 leading-110 text-darkblack">{accordion.title}</span>
                {isOpen ? (
                  <ChevronUp size={32} strokeWidth={1.25} aria-hidden />
                ) : (
                  <ChevronDown size={32} strokeWidth={1.25} aria-hidden />
                )}
              </button>
              {isOpen ? (
                <p className="pb-6 font-gill text-base font-light leading-110 text-neutral500">
                  {accordion.content}
                </p>
              ) : null}
            </div>
          );
        })}
      </section>

      <section
        aria-label="Personalisation"
        className="relative flex min-h-[260px] items-center justify-between overflow-hidden bg-chalkCard pl-6"
      >
        <div className="flex max-w-[276px] flex-col gap-10 py-6">
          <div className="flex flex-col gap-3">
            <h2 className="font-larken text-24 font-light leading-110 text-darkblack">Personalise this for you</h2>
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              Change the gemstone and much more to make it truly yours!
            </p>
          </div>
          <DetailOutlineButton className="w-fit">Get in Touch</DetailOutlineButton>
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
