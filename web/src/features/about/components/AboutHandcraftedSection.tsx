import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import AboutDecorativeFlourish from "./AboutDecorativeFlourish";
import { cn } from "@/shared/utils/cn";
import { aboutHandcraftedContent, aboutPageImages } from "../data/content";

const cardGridClassNames = [
  "lg:col-start-2 lg:row-start-2",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-1 lg:row-start-1",
] as const;

const AboutHandcraftedSection = () => {
  return (
    <section aria-labelledby="about-handcrafted-title" className="bg-white">
      <div className="relative h-420 overflow-hidden sm:h-560 lg:h-700">
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
            className="text-center font-larken text-32 font-light leading-110 text-white md:text-40 lg:text-48"
          >
            {aboutHandcraftedContent.title}
          </h2>
          <div className="h-px w-full max-w-440 bg-gray300" aria-hidden />
        </div>
      </div>

      <div className="container py-16 md:py-20 lg:py-24">
        <div className="relative mx-auto max-w-1160">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0">
            {aboutHandcraftedContent.cards.map((card, index) => (
              <article
                key={card.title}
                className={cn(
                  "flex min-h-180 flex-col items-center justify-center gap-3 bg-chalkCard p-8 lg:min-h-222",
                  cardGridClassNames[index],
                )}
              >
                <AboutDecorativeFlourish className="h-4 w-4 text-darkblack" />
                <h3 className="max-w-200 text-center font-larken text-lg font-light leading-110 text-darkblack md:text-xl lg:text-2xl">
                  {card.title}
                </h3>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-8 w-full max-w-736 lg:absolute lg:left-1/2 lg:top-58p lg:mt-0 lg:-translate-x-1/2">
            <ResponsiveImage
              desktopSrc={aboutPageImages.craftsmanship}
              alt="Diamond craftsmanship detail"
              width={736}
              height={446}
              quality={90}
              sizes="(max-width: 768px) 100vw, 736px"
              className="object-cover shadow-aboutImage"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHandcraftedSection;
