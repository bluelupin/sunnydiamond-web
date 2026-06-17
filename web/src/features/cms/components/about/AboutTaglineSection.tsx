import DiamondIcon from "@/assets/Icons/Diamond";
import type { AboutTaglineContent } from "@/types/about/aboutPage";

interface AboutTaglineSectionProps {
  id?: string;
  content: AboutTaglineContent;
}

const AboutTaglineSection = ({ id, content }: AboutTaglineSectionProps) => {
  return (
    <section id={id} className="bg-white py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <DiamondIcon className="text-darkblack shrink-0 w-5 h-5 md:w-6 md:h-6" aria-hidden />
          <p className="font-larken font-light text-xl md:text-2xl lg:text-[28px] text-darkblack tracking-[0%] leading-[140%] text-center max-w-[26ch]">
            {content.text}
          </p>
          <DiamondIcon className="text-darkblack shrink-0 w-5 h-5 md:w-6 md:h-6" aria-hidden />
        </div>
      </div>
    </section>
  );
};

export default AboutTaglineSection;
