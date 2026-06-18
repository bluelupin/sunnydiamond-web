import AboutDecorativeFlourish from "./AboutDecorativeFlourish";
import { aboutHeirloomContent } from "../data/content";

const AboutHeirloomQuoteSection = () => {
  return (
    <section
      aria-labelledby="about-heirloom-quote"
      className="bg-white py-16 md:py-20 lg:py-[104px]"
    >
      <div className="container">
        <div className="flex items-center justify-center gap-4 max-w-[1100px] mx-auto px-2">
          <AboutDecorativeFlourish className="hidden sm:block text-darkblack shrink-0" />
          <h2
            id="about-heirloom-quote"
            className="font-larken font-light text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[110%] text-gray500 text-center"
          >
            {aboutHeirloomContent.quote}
          </h2>
          <AboutDecorativeFlourish className="hidden sm:block text-darkblack shrink-0 scale-x-[-1]" />
        </div>
      </div>
    </section>
  );
};

export default AboutHeirloomQuoteSection;
