import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import AboutDecorativeFlourish from "./AboutDecorativeFlourish";
import { aboutHandcraftedContent, aboutPageImages } from "../data/content";

const AboutHandcraftedSection = () => {
  return (
    <section aria-labelledby="about-handcrafted-title" className="bg-white">
      <div className="relative h-[420px] sm:h-[560px] lg:h-[700px] overflow-hidden">
        <ResponsiveImage
          desktopSrc={aboutPageImages.handcraftedBg}
          alt="Handcrafted diamond jewellery"
          width={1360}
          height={700}
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
          <h2
            id="about-handcrafted-title"
            className="font-larken font-light text-[32px] md:text-[40px] lg:text-[48px] leading-[110%] text-white text-center"
          >
            {aboutHandcraftedContent.title}
          </h2>
          <div className="w-full max-w-[440px] h-px bg-gray300" aria-hidden />
        </div>
      </div>

      <div className="container py-16 md:py-20 lg:py-24">
        <div className="relative max-w-[1160px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-0">
            {aboutHandcraftedContent.cards.map((card, index) => (
              <article
                key={card.title}
                className={`bg-[#F8F4EC] flex flex-col items-center justify-center gap-3 p-8 min-h-[180px] lg:min-h-[222px] ${
                  index === 0 ? "lg:col-start-2 lg:row-start-2" : ""
                } ${index === 1 ? "lg:col-start-3 lg:row-start-1" : ""} ${index === 2 ? "lg:col-start-1 lg:row-start-1" : ""}`}
              >
                <AboutDecorativeFlourish className="text-darkblack w-4 h-4" />
                <h3 className="font-larken font-light text-lg md:text-xl lg:text-2xl leading-[110%] text-darkblack text-center max-w-[200px]">
                  {card.title}
                </h3>
              </article>
            ))}
          </div>

          <div className="mt-8 lg:mt-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-[58%] w-full max-w-[736px] mx-auto">
            <ResponsiveImage
              desktopSrc={aboutPageImages.craftsmanship}
              alt="Diamond craftsmanship detail"
              width={736}
              height={446}
              quality={90}
              sizes="(max-width: 768px) 100vw, 736px"
              className="object-cover shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHandcraftedSection;
