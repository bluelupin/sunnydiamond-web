import { Banknote, BadgeCheck, Gem, HandCoins, PackageCheck } from "lucide-react";
import { aboutGuarantees } from "../data/content";

const guaranteeIcons = {
  diamond: Gem,
  moneyback: HandCoins,
  hallmark: BadgeCheck,
  return: PackageCheck,
  cod: Banknote,
} as const;

const AboutGuaranteesBar = () => {
  return (
    <section aria-label="Shopping guarantees" className="bg-gray200 border-t border-[#DECAA0]/40">
      <div className="container py-10 md:py-14 lg:py-16">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {aboutGuarantees.map(({ label, icon }, index) => {
            const Icon = guaranteeIcons[icon];
            return (
              <li
                key={label}
                className={`flex flex-col items-center justify-center gap-3 text-center px-4 ${
                  index < aboutGuarantees.length - 1 ? "lg:border-r lg:border-gray300/80" : ""
                }`}
              >
                <Icon size={24} strokeWidth={1.25} className="text-darkblack" aria-hidden />
                <p className="font-gill text-base md:text-xl leading-[110%] text-darkblack">
                  {label}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default AboutGuaranteesBar;
