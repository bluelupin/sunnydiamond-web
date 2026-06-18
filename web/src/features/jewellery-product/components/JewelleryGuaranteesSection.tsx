import { HandCoins, PackageCheck, Banknote } from "lucide-react";

const guarantees = [
  {
    icon: HandCoins,
    label: "100% Moneyback Guarantee",
  },
  {
    icon: PackageCheck,
    label: "15 Days Return Policy",
  },
  {
    icon: Banknote,
    label: "Cash on Delivery",
  },
] as const;

const JewelleryGuaranteesSection = () => {
  return (
    <section aria-label="Shopping guarantees" className="border-y border-gray600/30 bg-white">
      <div className="container py-10 md:py-14">
        <ul className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray600/30">
          {guarantees.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex flex-col items-center justify-center gap-4 px-6 py-6 md:py-0 text-center"
            >
              <Icon size={28} strokeWidth={1.25} className="text-darkblack" aria-hidden />
              <p className="font-gill text-sm md:text-base text-darkblack font-light tracking-[1%] leading-[130%] max-w-[220px]">
                {label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default JewelleryGuaranteesSection;
