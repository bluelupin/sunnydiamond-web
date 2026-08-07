"use client";

import { useState, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  AttributeSeparator,
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "./shared";
import InlineCustomSelect from "@/shared/ui/InlineCustomSelect";
import { cn } from "@/shared/utils/cn";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import type { Product } from "@/features/products/data/products";
import type { ProductDetailContent, ProductDetailPricing } from "@/features/products/types/productDetail";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import {
  buildEngravingCartLineOptions,
  isProductEngravingEnabled,
  type EngravingSelection,
} from "@/features/products/constants/engraving";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import PlusIcon from "@/assets/Icons/PlusIcon";
import WishlistIcon from "@/assets/Icons/WishlistIcon";
import VanIcon from "@/assets/Icons/VanIcon";
import StoreIcon from "@/assets/Icons/StoreIcon";
import Reveal from "@/shared/Animation/Reveal";
import ProductDetailAccordions from "./ProductDetailAccordions";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";
import { getRingSizeLabels } from "@/features/products/utils/ringSizeOptions.utils";
import { isMetalColorSelectable } from "@/features/products/utils/metalColorOptions.utils";
import { getConfigurableOptionUidsForMetal } from "@/features/products/utils/productVariant.utils";

const MetalEngravingPanel = dynamic(() => import("./MetalEngravingPanel"), { ssr: false });
const RingSizeChartPanel = dynamic(() => import("./RingSizeChartPanel"), { ssr: false });
const DeliveryStoreJourneyPanel = dynamic(() => import("./DeliveryStoreJourneyPanel"), {
  ssr: false,
});
const ScheduleVideoCallPanel = dynamic(() => import("./ScheduleVideoCallPanel"), { ssr: false });
const TryAtHomePanel = dynamic(() => import("./TryAtHomePanel"), { ssr: false });
const PersonaliseProductPanel = dynamic(() => import("./PersonaliseProductPanel"), { ssr: false });
const PriceBreakupPanel = dynamic(() => import("./PriceBreakupPanel"), { ssr: false });

type ProductDetailSidebarProps = {
  product: Product;
  /** Variant-aware product used for price/image panels (falls back to `product`). */
  displayProduct?: Product;
  content: ProductDetailContent;
  pricing: ProductDetailPricing;
  selectedMetal?: string;
  onSelectedMetalChange?: (metalId: string) => void;
  sizeGuide?: NormalizedSizeGuide | null;
  onAddToBag: (payload: AddToBagPayload) => void;
  initialRingSize?: string;
  initialEngravingSelection?: EngravingSelection | null;
  initialIsGift?: boolean;
  addToBagLabel?: string;
  children?: (sections: {
    purchase: ReactNode;
    details: ReactNode;
    panels: ReactNode;
  }) => ReactNode;
};

const ProductDetailSidebar = ({
  product,
  displayProduct = product,
  content,
  pricing,
  selectedMetal: selectedMetalProp,
  onSelectedMetalChange,
  sizeGuide = null,
  onAddToBag,
  initialRingSize,
  initialEngravingSelection = null,
  initialIsGift = false,
  addToBagLabel = "Add to Bag",
  children,
}: ProductDetailSidebarProps) => {
  const [selectedMetalInternal, setSelectedMetalInternal] = useState(
    () => selectedMetalProp ?? content.metalColors[0]?.id ?? "",
  );
  const selectedMetal = selectedMetalProp ?? selectedMetalInternal;
  const setSelectedMetal = onSelectedMetalChange ?? setSelectedMetalInternal;
  const [ringSize, setRingSize] = useState<string>(() => initialRingSize ?? "");
  const [ringSizeError, setRingSizeError] = useState<string | null>(null);
  const [engravingSelection, setEngravingSelection] = useState<EngravingSelection | null>(null);
  const [isEngravingOpen, setIsEngravingOpen] = useState(false);
  const [isRingSizeChartOpen, setIsRingSizeChartOpen] = useState(false);
  const [isDeliveryStoreOpen, setIsDeliveryStoreOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [zipCode, setZipCode] = useState("122002");
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isTryAtHomeOpen, setIsTryAtHomeOpen] = useState(false);
  const [isPersonaliseOpen, setIsPersonaliseOpen] = useState(false);
  const [isPriceBreakupOpen, setIsPriceBreakupOpen] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const engravingConfig = product.engraving;
  const engravingEnabled = isProductEngravingEnabled(engravingConfig);
  const sizeLabels = getRingSizeLabels(product, sizeGuide);
  const showSizeSelector = sizeLabels.length > 0;
  const metalColorSelectable = isMetalColorSelectable(product);
  const showMetalColor = content.metalColors.length > 0;

  useEffect(() => {
    setEngravingSelection(initialEngravingSelection);
    setRingSize(initialRingSize ?? "");
    setIsGift(initialIsGift);
    setRingSizeError(null);
    if (!onSelectedMetalChange) {
      setSelectedMetalInternal(content.metalColors[0]?.id ?? "");
    }
  }, [
    product,
    content.metalColors,
    onSelectedMetalChange,
    initialRingSize,
    initialEngravingSelection,
    initialIsGift,
  ]);

  const activeMetal = content.metalColors.find((color) => color.id === selectedMetal);
  const configurableOptionUids = getConfigurableOptionUidsForMetal(product, selectedMetal);

  const purchaseSection = (
    <div className="flex flex-col gap-10 px-4 pt-8 md:pt-6 md:px-0 lg:pt-0">
      <div className="flex flex-col gap-10">
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
            <h1 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-32">
              {product.name}
            </h1>
          </header>

          {showMetalColor ? (
            <div className="flex flex-col gap-4">
              <p className="font-gill text-base leading-110 text-darkblack">Metal Color</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-6">
                  {content.metalColors.map((metal) =>
                    metalColorSelectable ? (
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
                    ) : (
                      <div
                        key={metal.id}
                        aria-label={metal.label}
                        className="size-51 shrink-0 border-2 border-darkblack"
                        style={{ backgroundColor: metal.color }}
                      />
                    ),
                  )}
                </div>
                <p className="font-gill text-base leading-110 text-neutral500">{activeMetal?.label}</p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-6">
            {showSizeSelector ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="font-gill text-base leading-normal tracking-normal text-darkblack">
                    {sizeGuide?.sizeFieldLabel ?? "Size"}
                  </p>
                  <DetailTextLink onClick={() => setIsRingSizeChartOpen(true)} className="uppercase">
                    Find your size
                  </DetailTextLink>
                </div>
                <InlineCustomSelect
                  id="product-ring-size"
                  label={sizeGuide?.sizeFieldLabel ?? "Size"}
                  labelClassName="sr-only"
                  value={ringSize}
                  options={sizeLabels}
                  placeholder="-select-"
                  onChange={(value) => {
                    setRingSize(value);
                    if (value) {
                      setRingSizeError(null);
                    }
                  }}
                  triggerClassName="rounded-none border-0 bg-aboutInactive px-3 text-base text-darkblack"
                  listClassName="bg-aboutInactive"
                  optionClassName="text-base"
                />
                {ringSizeError ? (
                  <p className="font-gill text-sm font-light leading-110 text-[#F91616]">
                    {ringSizeError}
                  </p>
                ) : null}
              </div>
            ) : null}

            {engravingEnabled && engravingConfig ? (
              <button
                type="button"
                onClick={() => setIsEngravingOpen(true)}
                className="flex h-14 items-center justify-between gap-4 bg-aboutInactive p-3 text-left"
              >
                <span className="font-gill text-base leading-110 text-darkblack">
                  {engravingSelection?.text ?? "Metal Engraving (Optional)"}
                </span>
                <PlusIcon aria-hidden className="shrink-0 text-darkblack" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-3 font-gill text-2xl leading-110 text-darkblack">
              <span>₹{formatJewelleryPrice(pricing.price)}</span>
              {pricing.originalPrice != null && pricing.originalPrice > pricing.price ? (
                <span className="text-gray600 line-through">
                  ₹{formatJewelleryPrice(pricing.originalPrice)}
                </span>
              ) : null}
            </div>
            <DetailTextLink onClick={() => setIsPriceBreakupOpen(true)} className="uppercase">
              View Price Breakup
            </DetailTextLink>
          </div>

          <div className="flex gap-2">
            <DetailDarkButton
              className="flex-1 uppercase"
              onClick={() => {
                if (showSizeSelector && !ringSize.trim()) {
                  setRingSizeError("Please select a ring size.");
                  return;
                }

                onAddToBag({
                  product: displayProduct,
                  options: {
                    metal: activeMetal?.label,
                    ringSize: ringSize || undefined,
                    ...(engravingEnabled && engravingConfig
                      ? buildEngravingCartLineOptions(engravingConfig, engravingSelection)
                      : {}),
                    isGift,
                  },
                  ...(configurableOptionUids.length > 0
                    ? { configurableOptionUids }
                    : {}),
                  productCustomOptions: product.customOptions,
                });
              }}
            >
              {addToBagLabel}
            </DetailDarkButton>
            <button
              type="button"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
              onClick={() => toggleWishlist(product.id)}
              className="inline-flex size-14 shrink-0 items-center justify-center bg-aboutInactive"
            >
              <WishlistIcon
                filled={wishlisted}
                className={cn(
                  "size-6 transition-colors duration-200",
                  wishlisted ? "text-linkGold" : "text-darkblack",
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
              <VanIcon className="shrink-0" />
              <p className="font-gill text-base font-light leading-110 text-darkblack">
                Estimated delivery May 12 2026
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StoreIcon className="shrink-0" />
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
    <div className="flex flex-col gap-10 px-4 md:px-0 md:pb-12 lg:px-0 !pb-0">
      <section aria-label="Shopping benefits" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-gill text-2xl leading-110 text-darkblack">With Sunny, you get</h2>
          <DetailTextLink href="/terms-and-conditions">T&amp;C Apply</DetailTextLink>
        </div>
        <Reveal direction="up">
          <ul className="m-0 flex list-none flex-col bg-benefitSurface p-0 max-md:-mx-4 max-md:gap-6 max-md:px-4 max-md:py-10 md:max-desktop:portrait:gap-6 md:max-desktop:portrait:p-6 md:landscape:flex-row md:landscape:items-stretch md:landscape:gap-4 md:landscape:p-6 lg:landscape:gap-4">
            {content.benefits.flatMap((benefit, index) => {
              const item = (
                <li
                  key={benefit.label}
                  className={cn(
                    "flex w-full shrink-0 flex-col items-center justify-center text-center",
                    "max-md:gap-2 max-md:px-3 max-md:py-4",
                    "md:max-desktop:portrait:gap-2 md:max-desktop:portrait:px-3 md:max-desktop:portrait:py-4",
                    "md:landscape:h-136 md:landscape:flex-1 md:landscape:gap-2 md:landscape:p-3",
                    index > 0 && "md:landscape:border-l md:landscape:border-gray600",
                  )}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center">
                    <Image
                      src={benefit.icon}
                      alt=""
                      width={40}
                      height={40}
                      aria-hidden
                      className="size-10 object-contain"
                    />
                  </div>
                  <span className="font-gill text-base leading-110 text-darkblack md:landscape:hidden">
                    {benefit.mobileLabel}
                  </span>
                  <span className="hidden font-gill text-base leading-110 text-darkblack md:landscape:block">
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
                  className="block h-[1px] min-h-px w-full shrink-0 bg-[#999999] p-0 md:landscape:hidden"
                />,
                item,
              ];
            })}
          </ul>
        </Reveal>
      </section>

      <section
        aria-label="Customer support"
        className="flex min-h-260 items-center overflow-hidden bg-supportSurface px-6 py-8"
      >
        <Reveal direction="up" className="flex max-w-358 flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
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
        </Reveal>
      </section>

      <ProductDetailAccordions items={content.accordions} />

      <section
        aria-label="Personalisation"
        className={cn(
          "flex overflow-hidden bg-chalkCard pr-0",
          "items-end justify-between pl-4 py-6",
          "max-lg:portrait:flex-col max-lg:portrait:items-stretch max-lg:portrait:justify-start max-lg:portrait:gap-6 max-lg:portrait:py-8 max-lg:portrait:pl-6",
          "md:landscape:flex-row md:landscape:items-stretch md:landscape:justify-between md:landscape:gap-4 md:landscape:py-6 md:landscape:pl-6",
          "lg:flex-row lg:items-stretch lg:justify-between lg:gap-4 lg:py-6 lg:pl-6",
          "desktop:min-h-260 desktop:items-end desktop:gap-0 desktop:py-6",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 flex-col gap-6",
            "max-w-[172px] max-md:-mr-[22px]",
            "max-lg:portrait:max-w-none max-lg:portrait:mr-0",
            "md:landscape:min-w-0 md:landscape:flex-1 md:landscape:justify-center md:landscape:py-2 md:landscape:max-w-[54%]",
            "lg:min-w-0 lg:flex-1 lg:justify-center lg:py-2 lg:max-w-[54%]",
            "desktop:max-w-280 desktop:justify-start desktop:gap-10 desktop:py-0",
          )}
        >
          <div className="flex flex-col gap-3">
            <h2 className="font-larken text-xl font-light leading-110 text-darkblack max-lg:portrait:whitespace-normal lg:whitespace-normal desktop:w-max desktop:whitespace-nowrap desktop:text-2xl">
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
        <div
          className={cn(
            "relative shrink-0 overflow-hidden",
            "h-[118px] w-177",
            "max-lg:portrait:aspect-[322/213] max-lg:portrait:h-auto max-lg:portrait:w-full max-lg:portrait:flex-none",
            "md:landscape:ml-auto md:landscape:h-auto md:landscape:min-h-[200px] md:landscape:w-auto md:landscape:min-w-[160px] md:landscape:max-w-[46%] md:landscape:flex-1 md:landscape:self-stretch",
            "lg:ml-auto lg:h-auto lg:min-h-[200px] lg:w-auto lg:min-w-[160px] lg:max-w-[46%] lg:flex-1 lg:self-stretch",
            "desktop:h-[213px] desktop:w-[322px] desktop:min-h-0 desktop:min-w-0 desktop:max-w-none desktop:flex-none desktop:self-auto",
          )}
        >
          <Image
            src={content.personaliseImage}
            alt=""
            width={322}
            height={213}
            aria-hidden
            className="size-full object-cover object-center max-lg:portrait:object-[center_15%] md:landscape:object-[center_20%] lg:object-[center_20%] desktop:object-[center_-4%]"
            sizes="(max-width: 1023px) 100vw, 322px"
          />
        </div>
      </section>
    </div>
  );

  const panels = (
    <>
      {engravingEnabled && engravingConfig ? (
        <MetalEngravingPanel
          open={isEngravingOpen}
          onClose={() => setIsEngravingOpen(false)}
          previewImage={engravingConfig.previewImage}
          fonts={engravingConfig.fonts}
          maxCharacters={engravingConfig.maxCharacters}
          initialValue={engravingSelection}
          onSave={setEngravingSelection}
        />
      ) : null}

      {isRingSizeChartOpen ? (
        <RingSizeChartPanel open onClose={() => setIsRingSizeChartOpen(false)} guide={sizeGuide} />
      ) : null}

      {isDeliveryStoreOpen ? (
        <DeliveryStoreJourneyPanel
          open
          onClose={() => setIsDeliveryStoreOpen(false)}
          city="Coimbatore"
        />
      ) : null}

      {isVideoCallOpen ? (
        <ScheduleVideoCallPanel
          open
          onClose={() => setIsVideoCallOpen(false)}
          product={product}
        />
      ) : null}

      {isTryAtHomeOpen ? (
        <TryAtHomePanel open onClose={() => setIsTryAtHomeOpen(false)} product={product} />
      ) : null}

      {isPersonaliseOpen ? (
        <PersonaliseProductPanel
          open
          onClose={() => setIsPersonaliseOpen(false)}
          product={product}
        />
      ) : null}

      {isPriceBreakupOpen ? (
        <PriceBreakupPanel
          open
          onClose={() => setIsPriceBreakupOpen(false)}
          productName={displayProduct.name}
          productImage={displayProduct.image}
          metalLabel={activeMetal?.label}
          ringSize={ringSize || undefined}
          pricing={pricing}
        />
      ) : null}
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
    <aside className="flex flex-col gap-10">
      {purchaseSection}
      {detailsSection}
      {panels}
    </aside>
  );
};

export default ProductDetailSidebar;
