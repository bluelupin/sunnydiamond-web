import Image from "next/image";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import type { NormalizedProductDisplayStrip } from "@/services/product-display/product-display-page.types";

const CartBenefitDivider = () => (
  <li
    aria-hidden
    className="flex w-full list-none items-center justify-center self-stretch md:max-lg:landscape:w-auto md:max-lg:landscape:shrink-0 lg:w-auto lg:shrink-0"
  >
    <span className="h-[0.5px] w-full shrink-0 bg-gray600 md:max-lg:landscape:h-136 md:max-lg:landscape:w-hairline lg:h-136 lg:w-hairline" />
  </li>
);

type CartBenefitsSectionProps = {
  strip: NormalizedProductDisplayStrip;
};

const CartBenefitsSection = ({ strip }: CartBenefitsSectionProps) => {
  const showBenefitsStrip = strip.items.length > 0;
  const showStripTitle = strip.title.trim().length > 0;
  const showStripTnc = strip.tnc.label.trim().length > 0 && strip.tnc.href.trim().length > 0;

  if (!showBenefitsStrip) {
    return null;
  }

  return (
    <section
      aria-label="Shopping benefits"
      className="mt-0 flex flex-col gap-6 md:max-lg:mt-8 lg:mt-10"
    >
      {showStripTitle || showStripTnc ? (
        <div className="flex w-full items-center justify-between gap-2">
          {showStripTitle && (
            <h2 className="md:font-larken font-gill text-xl md:font-light font-normal leading-110 text-darkblack lg:text-2xl">
              {strip.title}
            </h2>
          )}
          {showStripTnc ? (
            <DetailTextLink
              href={strip.tnc.href}
              target={strip.tnc.openInNewTab ? "_blank" : undefined}
              rel={strip.tnc.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {strip.tnc.label}
            </DetailTextLink>
          ) : null}
        </div>
      ) : null}

      <ul className="m-0 flex list-none flex-col items-stretch gap-6 overflow-x-auto py-4 md:max-lg:portrait:gap-4 md:max-lg:landscape:flex-row md:max-lg:landscape:items-center md:max-lg:landscape:justify-center md:max-lg:landscape:gap-4 md:max-lg:bg-gray200 md:max-lg:landscape:p-6 lg:flex-row lg:items-center lg:justify-center lg:gap-4 lg:bg-gray200 lg:p-6">
        {strip.items.flatMap((benefit, index) => {
          const item = (
            <li
              key={benefit.label}
              className="flex h-[98px] w-full shrink-0 flex-col items-center justify-center gap-2 text-center md:max-lg:portrait:h-auto md:max-lg:portrait:py-3 md:max-lg:landscape:h-136 md:max-lg:landscape:min-w-0 md:max-lg:landscape:flex-1 md:max-lg:landscape:w-auto lg:h-136 lg:w-[90px] lg:flex-1"
            >
              <div className="flex shrink-0 items-center justify-center">
                <Image
                  src={benefit.icon}
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="md:!max-w-[120px] flex flex-row items-center gap-1 font-gill font-normal leading-110 text-darkblack md:max-lg:landscape:flex-col md:max-lg:landscape:gap-0 lg:flex-col lg:gap-0 text-base">
                <span>{benefit.lines[0]} {benefit.lines[1]}</span>
              </div>
            </li>
          );

          if (index === 0) return [item];

          return [<CartBenefitDivider key={`${benefit.label}-divider`} />, item];
        })}
      </ul>
    </section>
  );
};

export default CartBenefitsSection;
