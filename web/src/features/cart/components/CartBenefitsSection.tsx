import Image from "next/image";
import { cartBenefits } from "../data/cartBenefits";
import { CartTextLink } from "./CartFlowUi";

const CartBenefitDivider = () => (
  <li
    aria-hidden
    className="hidden min-w-0 flex-1 list-none items-center justify-center self-stretch lg:flex"
  >
    <span className="h-136 w-hairline shrink-0 bg-gray600" />
  </li>
);

const CartBenefitsSection = () => (
  <section aria-label="Shopping benefits" className="mt-0 flex flex-col gap-4 lg:mt-10 lg:gap-6">
    <div className="flex w-full items-center justify-between">
      <h2 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
        With Sunny, you get
      </h2>
      <CartTextLink href="/about">T&amp;C Apply</CartTextLink>
    </div>

    <ul className="m-0 flex list-none items-stretch justify-start gap-4 overflow-x-auto bg-gray200 p-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:justify-center lg:gap-4 lg:overflow-visible lg:p-6 [&::-webkit-scrollbar]:hidden">
      {cartBenefits.flatMap((benefit, index) => {
        const item = (
          <li
            key={benefit.label}
            className="flex h-136 w-[90px] shrink-0 flex-col items-center justify-center gap-2 text-center"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
              <Image
                src={benefit.icon}
                alt=""
                width={40}
                height={40}
                aria-hidden
                className="h-10 w-10 object-contain"
              />
            </div>
            <span className="font-gill text-sm font-normal leading-110 text-darkblack lg:text-base">
              {benefit.lines[0]}
              <br />
              {benefit.lines[1]}
            </span>
          </li>
        );

        if (index === 0) return [item];

        return [<CartBenefitDivider key={`${benefit.label}-divider`} />, item];
      })}
    </ul>
  </section>
);

export default CartBenefitsSection;
