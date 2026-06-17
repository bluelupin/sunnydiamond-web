import { cn } from "@/shared/utils/cn";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import type { AboutCraftsmanshipCell, AboutCraftsmanshipContent } from "@/types/about/aboutPage";

interface AboutCraftsmanshipSectionProps {
  id?: string;
  content: AboutCraftsmanshipContent;
}

const CraftsmanshipCell = ({ cell }: { cell: AboutCraftsmanshipCell }) => {
  if (cell.type === "text" && cell.title) {
    return (
      <div
        className={cn(
          "aspect-square flex items-center justify-center bg-gray200 p-5 md:p-7 text-center",
          cell.className,
        )}
      >
        <p className="font-larken font-light text-lg md:text-xl lg:text-2xl text-darkblack tracking-[0%] leading-[125%] max-w-[16ch]">
          {cell.title}
        </p>
      </div>
    );
  }

  if (cell.type === "image" && cell.image) {
    return (
      <div className={cn("relative aspect-square overflow-hidden", cell.className)}>
        <ResponsiveImage
          desktopSrc={cell.image.desktopSrc}
          mobileSrc={cell.image.mobileSrc}
          alt={cell.image.alt}
          width={600}
          height={600}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return null;
};

const AboutCraftsmanshipSection = ({ id, content }: AboutCraftsmanshipSectionProps) => {
  const { bannerTitle, bannerImage, cells } = content;

  return (
    <section id={id} className="bg-white">
      <div className="relative w-full h-360 md:h-550 lg:h-650 overflow-hidden">
        <ResponsiveImage
          desktopSrc={bannerImage.desktopSrc}
          mobileSrc={bannerImage.mobileSrc}
          alt={bannerImage.alt}
          width={1920}
          height={900}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-charcoal/35" />
        <div className="container relative h-full flex items-center justify-center">
          <h2 className="font-larken font-light text-[32px] md:text-4xl lg:text-5xl text-white tracking-[0%] leading-[100%] text-center">
            {bannerTitle}
          </h2>
        </div>
      </div>

      <div className="container py-10 md:py-14 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4 max-w-[920px] mx-auto">
          {cells.map((cell) => (
            <CraftsmanshipCell key={cell.id} cell={cell} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutCraftsmanshipSection;
