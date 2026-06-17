import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import type { AboutHistoryContent, AboutMediaAsset } from "@/types/about/aboutPage";

interface AboutHistorySectionProps {
  id?: string;
  content: AboutHistoryContent;
}

const HistoryFigure = ({
  image,
  aspect,
  className,
}: {
  image: AboutMediaAsset;
  aspect: string;
  className?: string;
}) => (
  <figure className={className}>
    <div className={`${aspect} overflow-hidden`}>
      <ResponsiveImage
        desktopSrc={image.desktopSrc}
        mobileSrc={image.mobileSrc}
        alt={image.alt}
        width={720}
        height={900}
        className="h-full w-full object-cover"
      />
    </div>
    {image.caption ? (
      <figcaption className="mt-3 font-gill text-[11px] tracking-[0.12em] uppercase text-gray600">
        {image.caption}
      </figcaption>
    ) : null}
  </figure>
);

const AboutHistorySection = ({ id, content }: AboutHistorySectionProps) => {
  const { title, body, primaryImage, secondaryImage } = content;

  return (
    <section id={id} className="bg-white py-16 md:py-24 lg:py-28">
      <div className="container">
        <h2 className="font-larken font-light text-[32px] md:text-4xl lg:text-5xl text-darkblack tracking-[0%] leading-[100%] mb-12 md:mb-16 lg:mb-20">
          {title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start">
          <HistoryFigure
            image={primaryImage}
            aspect="aspect-[4/5]"
            className="lg:col-span-4"
          />

          <div className="lg:col-span-5 flex items-center lg:py-10 xl:py-16">
            <p className="font-gill text-sm md:text-base text-gray500 font-light tracking-[0.5%] leading-[185%] text-justify">
              {body}
            </p>
          </div>

          <HistoryFigure
            image={secondaryImage}
            aspect="aspect-[3/4]"
            className="lg:col-span-3 lg:mt-24"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutHistorySection;
