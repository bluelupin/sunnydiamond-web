import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { aboutFacesContent } from "../data/content";

const AboutFacesSection = () => {
  return (
    <section
      aria-labelledby="about-faces-title"
      className="bg-white pb-16 md:pb-20 lg:pb-[104px]"
    >
      <div className="container flex flex-col items-center text-center">
        <div className="flex flex-col items-center gap-4 max-w-[760px]">
          <h2
            id="about-faces-title"
            className="font-larken font-light text-[32px] md:text-[40px] lg:text-[48px] leading-[110%] text-darkblack"
          >
            {aboutFacesContent.title}
          </h2>
          <p className="font-gill font-light text-base md:text-lg lg:text-xl leading-[110%] text-gray500">
            {aboutFacesContent.description}
          </p>
        </div>

        <div className="mt-10 lg:mt-10 w-full overflow-x-auto">
          <div className="flex gap-1 min-w-max lg:min-w-0 lg:grid lg:grid-cols-3 lg:gap-1 mx-auto max-w-[1440px]">
            {aboutFacesContent.members.map((member, index) => (
              <figure
                key={member.image}
                className="relative w-[280px] sm:w-[360px] lg:w-full h-[360px] sm:h-[480px] lg:h-[600px] shrink-0 overflow-hidden"
              >
                <ResponsiveImage
                  desktopSrc={member.image}
                  alt={member.alt}
                  width={member.width}
                  height={member.height}
                  quality={90}
                  sizes="(max-width: 1024px) 360px, 478px"
                  className="object-cover"
                  priority={index === 0}
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFacesSection;
