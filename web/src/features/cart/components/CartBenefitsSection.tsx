import Image from "next/image";
import { cartBenefits } from "../data/cartBenefits";
import { CartTextLink } from "./CartFlowUi";

const CartBenefitDivider = () => (
  <li
    aria-hidden
    className="flex w-full list-none items-center justify-center self-stretch md:max-lg:landscape:w-auto md:max-lg:landscape:shrink-0 lg:w-auto lg:shrink-0"
  >
    <span className="h-[1px] w-full shrink-0 bg-gray600 md:max-lg:landscape:h-136 md:max-lg:landscape:w-hairline lg:h-136 lg:w-hairline" />
  </li>
);

const CartBenefitsSection = () => (
  <section
    aria-label="Shopping benefits"
    className="mt-0 flex flex-col gap-6 md:max-lg:mt-8 lg:mt-10"
  >
    <div className="flex w-full items-center justify-between">
      <h2 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
        With Sunny, you get
      </h2>
      <CartTextLink href="/terms-and-conditions">T&amp;C Apply</CartTextLink>
    </div>

    <ul className="m-0 flex list-none flex-col items-stretch gap-6 overflow-x-auto p-4 md:max-lg:portrait:gap-4 md:max-lg:landscape:flex-row md:max-lg:landscape:items-center md:max-lg:landscape:justify-center md:max-lg:landscape:gap-4 md:max-lg:bg-gray200 md:max-lg:landscape:p-6 lg:flex-row lg:items-center lg:justify-center lg:gap-4 lg:bg-gray200 lg:p-6">
      {cartBenefits.flatMap((benefit, index) => {
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
            <div className="flex flex-row items-center gap-1 font-gill text-sm font-normal leading-110 text-darkblack md:max-lg:landscape:flex-col md:max-lg:landscape:gap-0 md:max-lg:landscape:text-base lg:flex-col lg:gap-0 lg:text-base">
              <span>{benefit.lines[0]}</span>
              <span>{benefit.lines[1]}</span>
            </div>
          </li>
        );

        if (index === 0) return [item];

        return [<CartBenefitDivider key={`${benefit.label}-divider`} />, item];
      })}
    </ul>
  </section>
);

export default CartBenefitsSection;
