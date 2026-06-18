import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import { aboutFacesContent } from "../data/content";

const AboutFacesSection = () => {
  return (
    <section
      aria-labelledby="about-faces-title"
      className="bg-white pb-16 md:pb-20 lg:pb-104"
    >
      <div className="container flex flex-col items-center text-center">
        <div className="flex max-w-760 flex-col items-center gap-4">
          <h2
            id="about-faces-title"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-40 lg:text-48"
          >
            {aboutFacesContent.title}
          </h2>
          <p className="font-gill text-base font-light leading-110 text-gray500 md:text-lg lg:text-xl">
            {aboutFacesContent.description}
          </p>
        </div>
      </div>

      <div className="scrollbar-none mt-10 flex w-full snap-x snap-mandatory gap-1 overflow-x-auto pl-4 lg:h-600 lg:overflow-visible lg:pl-0">
        {aboutFacesContent.members.map((member, index) => (
          <figure
            key={member.image}
            className={cn(
              "group relative shrink-0 snap-start overflow-hidden",
              "h-560 w-screen-card",
              "lg:h-full lg:w-auto lg:basis-0 lg:flex-1",
              "transition-all duration-500 ease-in-out lg:hover:grow-2.4",
            )}
          >
            <ResponsiveImage
              desktopSrc={member.image}
              alt={member.alt}
              width={member.width}
              height={member.height}
              quality={90}
              sizes="(max-width: 1023px) calc(100vw - 24px), 33vw"
              className="h-full w-full object-cover transition-transform duration-700 lg:group-hover:scale-103"
              priority={index === 0}
            />

            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100"
            />

            <figcaption className="absolute bottom-0 left-0 translate-y-2 p-5 text-left opacity-0 transition-all duration-500 md:p-6 lg:p-8 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
              <p className="font-larken text-xl font-light leading-110 text-white md:text-2xl">
                {member.name}
              </p>
              <p className="mt-1 font-gill text-xs font-light uppercase leading-130 tracking-caption text-white/80 md:text-sm">
                {member.role}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default AboutFacesSection;
