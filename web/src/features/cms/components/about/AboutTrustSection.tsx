import {
  Calendar,
  Gem,
  RotateCcw,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { AboutTrustBadge } from "@/types/about/aboutPage";

interface AboutTrustSectionProps {
  id?: string;
  badges: readonly AboutTrustBadge[];
}

const iconMap: Record<AboutTrustBadge["icon"], LucideIcon> = {
  diamond: Gem,
  shield: ShieldCheck,
  rotate: RotateCcw,
  calendar: Calendar,
  truck: Truck,
};

const AboutTrustSection = ({ id, badges }: AboutTrustSectionProps) => {
  return (
    <section id={id} className="bg-gray200 border-t border-gray100">
      <div className="container py-10 md:py-12 lg:py-14">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4">
          {badges.map((badge) => {
            const Icon = iconMap[badge.icon];

            return (
              <li
                key={badge.id}
                className="flex flex-col items-center text-center gap-4"
              >
                <Icon
                  size={30}
                  strokeWidth={1}
                  className="text-darkblack"
                  aria-hidden
                />
                <span className="font-gill text-xs md:text-13 text-gray500 tracking-[0.08em] uppercase leading-[140%] max-w-[14ch]">
                  {badge.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default AboutTrustSection;
