import Image from "next/image";
import PageContainer from "@/shared/ui/layout/PageContainer";

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
    <section aria-label="Shopping guarantees" className="bg-gray200">
      <PageContainer className="py-10 md:py-16">
        <ul className="flex flex-col gap-6 md:flex-row md:items-stretch md:justify-center md:gap-0">
          {guarantees.map(({ iconSrc, label }, index) => (
            <li key={label} className="flex flex-1 flex-col items-center md:flex-row md:justify-center">
              {index > 0 ? (
                <div className="hidden h-136 w-hairline shrink-0 bg-neutral300 md:block" aria-hidden />
              ) : null}
              {index > 0 ? <div className="h-px w-full bg-neutral300 md:hidden" aria-hidden /> : null}
              <div className="flex w-full flex-col items-center justify-center gap-2 px-3 py-4 text-center md:gap-4 md:px-6 md:py-0">
                <div className="relative size-10 shrink-0 md:size-16">
                  <Image src={iconSrc} alt="" fill className="object-contain" aria-hidden />
                </div>
                <p className="max-w-[236px] font-gill text-base font-normal leading-110 text-darkblack md:text-20">
                  {label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </PageContainer>
    </section>
  );
};

export default JewelleryGuaranteesSection;
