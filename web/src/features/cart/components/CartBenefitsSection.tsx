import Image from "next/image";
import { cartBenefits } from "../data/cartBenefits";
import { CartTextLink } from "./CartFlowUi";

const CartBenefitDivider = () => (
  <li
    aria-hidden
    className="min-w-0 flex-1 list-none items-center justify-center self-stretch flex"
  >
    <span className="lg:h-136 h-[1px] lg:w-hairline w-full shrink-0 bg-gray600" />
  </li>
);

const CartBenefitsSection = () => (
  <section aria-label="Shopping benefits" className="mt-0 flex flex-col lg:mt-10 gap-6">
    <div className="flex w-full items-center justify-between">
      <h2 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
        With Sunny, you get
      </h2>
      <CartTextLink href="/about">T&amp;C Apply</CartTextLink>
    </div>

    <ul className="m-0 flex lg:flex-row flex-col list-none items-center justify-start gap-6 overflow-x-auto lg:bg-gray200 p-4 justify-center lg:gap-4 lg:p-6">
      {cartBenefits.flatMap((benefit, index) => {
        const item = (
          <li
            key={benefit.label}
            className="flex lg:h-136 h-[98px] lg:w-[90px] w-full shrink-0 flex-col items-center justify-center gap-2 text-center"
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
            <div className="font-gill text-sm font-normal leading-110 text-darkblack lg:text-base flex lg:flex-col flex-row items-center gap-1 lg:gap-0">
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
