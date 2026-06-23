import Image from "next/image";

const guarantees = [
  {
    iconSrc: "/images/about/guarantees/moneyback.svg",
    label: "100% Moneyback Guarantee",
  },
  {
    iconSrc: "/images/about/guarantees/return.svg",
    label: "15 Days Return Policy",
  },
  {
    iconSrc: "/images/about/guarantees/cod.svg",
    label: "Cash on Delivery",
  },
] as const;

const JewelleryGuaranteesSection = () => {
  return (
    <section aria-label="Shopping guarantees" className="bg-gray200 md:border-y md:border-gray600/30 md:bg-white">
      <ul className="flex flex-col gap-6 px-4 py-10 md:container md:grid md:grid-cols-3 md:gap-0 md:py-14 md:divide-x md:divide-gray600/30">
        {guarantees.map(({ iconSrc, label }, index) => (
          <li key={label} className="flex flex-col gap-6 md:gap-0">
            {index > 0 ? <div className="h-px w-full bg-neutral300 md:hidden" aria-hidden /> : null}
            <div className="flex flex-col items-center justify-center gap-2 rounded-sm px-3 py-4 text-center md:gap-4 md:px-6 md:py-0">
              <div className="relative size-10 shrink-0">
                <Image src={iconSrc} alt="" fill className="object-contain" aria-hidden />
              </div>
              <p className="max-w-[220px] font-gill text-base font-normal leading-110 text-darkblack md:text-sm md:font-light md:tracking-[1%]">
                {label}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default JewelleryGuaranteesSection;
