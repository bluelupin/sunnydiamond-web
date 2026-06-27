"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronDown, Heart, Plus } from "lucide-react";
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
import { useWishlist } from "@/features/wishlist/context/WishlistContext";

type ProductDetailSidebarProps = {
  product: Product;
  content: ProductDetailContent;
  pricing: ProductDetailPricing;
  onAddToBag: () => void;
  children?: (sections: {
    purchase: ReactNode;
    details: ReactNode;
    panels: ReactNode;
  }) => ReactNode;
};

const ProductDetailSidebar = ({
  product,
  content,
  pricing,
  onAddToBag,
  children,
}: ProductDetailSidebarProps) => {
  const [selectedMetal, setSelectedMetal] = useState(content.metalColors[0]?.id ?? "gold");
  const [ringSize, setRingSize] = useState<string>("");
  const [engravingSelection, setEngravingSelection] = useState<EngravingSelection | null>(null);
  const [isEngravingOpen, setIsEngravingOpen] = useState(false);
  const [isRingSizeChartOpen, setIsRingSizeChartOpen] = useState(false);
  const [isDeliveryStoreOpen, setIsDeliveryStoreOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [zipCode, setZipCode] = useState("122002");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isTryAtHomeOpen, setIsTryAtHomeOpen] = useState(false);
  const [isPersonaliseOpen, setIsPersonaliseOpen] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const activeMetal = content.metalColors.find((color) => color.id === selectedMetal);

  const toggleAccordion = (id: string) => {
    setOpenAccordion((current) => (current === id ? null : id));
  };

  const purchaseSection = (
    <div className="flex flex-col gap-40 px-4 pt-8 lg:px-0 lg:pt-0">
      <div className="flex flex-col gap-40">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-4">
            <ul className="m-0 flex list-none flex-wrap items-center gap-3 p-0">
              {content.attributes.map((attribute, index) => (
                <li key={attribute} className="flex items-center gap-3">
                  {index > 0 ? <AttributeSeparator /> : null}
                  <span className="font-gill text-base font-light leading-110 text-neutral500">
                    {attribute}
                  </span>
                </li>
              ))}
            </ul>
            <h1 className="font-larken text-24 font-light leading-110 text-darkblack lg:text-32">
              {product.name}
            </h1>
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
                      "size-51 shrink-0",
                      selectedMetal === metal.id && "border-2 border-darkblack",
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
                <p className="font-gill text-base leading-normal tracking-normal text-darkblack">
                  Ring Size
                </p>
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
              className="flex h-14 items-center justify-between gap-4 bg-aboutInactive p-3 text-left"
            >
              <span className="font-gill text-base leading-110 text-darkblack">
                {engravingSelection?.text ?? "Metal Engraving (Optional)"}
              </span>
              <Plus size={24} strokeWidth={1.5} aria-hidden className="shrink-0 text-darkblack" />
            </button>
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
            <DetailDarkButton className="flex-1 uppercase" onClick={onAddToBag}>
              Add to Bag
            </DetailDarkButton>
            <button
              type="button"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
              onClick={() => toggleWishlist(product.id)}
              className="inline-flex size-14 shrink-0 items-center justify-center bg-aboutInactive"
            >
              <Heart
                size={24}
                strokeWidth={1.5}
                aria-hidden
                className={cn(
                  "transition-colors duration-200",
                  wishlisted ? "fill-linkGold text-linkGold" : "text-darkblack",
                )}
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
              className="h-14 min-w-0 flex-1 border border-neutral500 px-6 font-gill text-base text-darkblack outline-none"
            />
            <DetailDarkButton className="w-auto shrink-0 px-7 uppercase">Check</DetailDarkButton>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/images/products/pdp/delivery-truck.svg"
                alt=""
                width={32}
                height={32}
                aria-hidden
                className="size-8 shrink-0 object-contain"
              />
              <p className="font-gill text-base font-light leading-110 text-darkblack">
                Estimated delivery May 12 2026
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Image
                src="/images/products/pdp/store.svg"
                alt=""
                width={32}
                height={32}
                aria-hidden
                className="size-8 shrink-0 object-contain"
              />
              <p className="font-gill text-base font-light leading-110 text-darkblack">
                Available now at nearest store
              </p>
              <DetailTextLink onClick={() => setIsDeliveryStoreOpen(true)}>Coimbatore</DetailTextLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const detailsSection = (
    <div className="flex flex-col gap-40 px-4 pb-16 lg:px-0 lg:pb-0">
      <section aria-label="Shopping benefits" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-gill text-24 leading-110 text-darkblack">With Sunny, you get</h2>
          <DetailTextLink href="/about">T&amp;C Apply</DetailTextLink>
        </div>
        <ul className="m-0 flex list-none flex-col bg-benefitSurface p-0 max-lg:-mx-4 max-lg:gap-6 max-lg:px-4 max-lg:py-40 lg:flex-row lg:items-stretch lg:gap-4 lg:p-6">
          {content.benefits.flatMap((benefit, index) => {
            const item = (
              <li
                key={benefit.label}
                className={cn(
                  "flex w-full shrink-0 flex-col items-center justify-center text-center",
                  "max-lg:gap-2 max-lg:px-3 max-lg:py-4",
                  "lg:h-136 lg:flex-1 lg:gap-2 lg:p-3",
                  index > 0 && "lg:border-l lg:border-gray600",
                )}
              >
                <div className="flex size-40 shrink-0 items-center justify-center">
                  <Image
                    src={benefit.icon}
                    alt=""
                    width={40}
                    height={40}
                    aria-hidden
                    className="size-40 object-contain"
                  />
                </div>
                <span className="font-gill text-base leading-110 text-darkblack lg:hidden">
                  {benefit.mobileLabel}
                </span>
                <span className="hidden font-gill text-base leading-110 text-darkblack lg:block">
                  {benefit.lines[0]}
                  <br />
                  {benefit.lines[1]}
                </span>
              </li>
            );

            if (index === 0) return [item];

            return [
              <li
                key={`${benefit.label}-divider`}
                role="presentation"
                aria-hidden
                className="block h-[1px] min-h-px w-full shrink-0 bg-[#999999] p-0 lg:hidden"
              />,
              item,
            ];
          })}
        </ul>
      </section>

      <section
        aria-label="Customer support"
        className="flex min-h-260 items-center overflow-hidden bg-supportSurface p-6"
      >
        <div className="flex max-w-358 flex-col gap-40">
          <div className="flex flex-col gap-3">
            <h2 className="font-larken text-24 font-light leading-110 text-darkblack">
              We&apos;re here for you
            </h2>
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              Our salesperson will personally help you choose the right diamond.
            </p>
          </div>
          <div className="flex max-w-220 flex-col gap-3">
            <DetailDarkButton onClick={() => setIsVideoCallOpen(true)} className="uppercase">
              Schedule a Video Call
            </DetailDarkButton>
            <DetailTextLink onClick={() => setIsTryAtHomeOpen(true)} className="self-start uppercase">
              Try At Home
            </DetailTextLink>
          </div>
        </div>
      </section>

      <section aria-label="Product information" className="flex flex-col gap-3">
        {content.accordions.map((accordion) => {
          const isOpen = openAccordion === accordion.id;

          return (
            <div key={accordion.id} className="flex flex-col gap-3">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleAccordion(accordion.id)}
                className="flex h-14 items-center justify-between text-left"
              >
                <span className="font-gill text-24 leading-110 text-darkblack">{accordion.title}</span>
                {isOpen ? (
                  <ChevronDown size={32} strokeWidth={1.25} aria-hidden className="rotate-180" />
                ) : (
                  <Plus size={32} strokeWidth={1.5} aria-hidden className="shrink-0 text-darkblack" />
                )}
              </button>
              {isOpen ? (
                <p className="pb-3 font-gill text-base font-light leading-110 text-neutral500">
                  {accordion.content}
                </p>
              ) : null}
              <div className="h-px bg-neutral300" aria-hidden />
            </div>
          );
        })}
      </section>

      <section
        aria-label="Personalisation"
        className="flex items-end justify-between overflow-hidden bg-chalkCard pl-4 py-6 lg:min-h-260 lg:pl-6"
      >
        <div className="flex max-w-[172px] shrink-0 flex-col gap-6 max-lg:-mr-[22px] lg:max-w-280 lg:gap-40">
          <div className="flex flex-col gap-3">
            <h2 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-24">
              Personalise this for you
            </h2>
            <p className="font-gill text-sm font-light leading-110 text-darkblack lg:text-base">
              Change the gemstone and much more to make it truly yours!
            </p>
          </div>
          <DetailOutlineButton className="w-fit uppercase" onClick={() => setIsPersonaliseOpen(true)}>
            Get in Touch
          </DetailOutlineButton>
        </div>
        <div className="relative h-[118px] w-177 shrink-0 overflow-hidden lg:h-[213px] lg:w-[322px]">
          <Image
            src={content.personaliseImage}
            alt=""
            width={322}
            height={213}
            aria-hidden
            className="size-full object-cover object-[center_-4%]"
            sizes="(max-width: 1023px) 177px, 322px"
          />
        </div>
      </section>
    </div>
  );

  const panels = (
    <>
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

      <ScheduleVideoCallPanel
        open={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        product={product}
      />

      <TryAtHomePanel open={isTryAtHomeOpen} onClose={() => setIsTryAtHomeOpen(false)} product={product} />

      <PersonaliseProductPanel
        open={isPersonaliseOpen}
        onClose={() => setIsPersonaliseOpen(false)}
        product={product}
      />
    </>
  );

  if (children) {
    return (
      <>
        {children({ purchase: purchaseSection, details: detailsSection, panels })}
        {panels}
      </>
    );
  }

  return (
    <aside className="flex flex-col gap-40">
      {purchaseSection}
      {detailsSection}
      {panels}
    </aside>
  );
};

export default ProductDetailSidebar;
