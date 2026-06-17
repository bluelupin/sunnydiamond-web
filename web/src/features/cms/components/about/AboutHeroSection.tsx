import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import type { AboutHeroContent } from "@/types/about/aboutPage";

interface AboutHeroSectionProps {
  id?: string;
  content: AboutHeroContent;
}

const AboutHeroSection = ({ id, content }: AboutHeroSectionProps) => {
  const { title, image } = content;

  return (
    <section id={id} className="relative h-screen flex flex-col overflow-hidden">
      <div className="relative flex-1 overflow-hidden">
        <ResponsiveImage
          desktopSrc={image.desktopSrc}
          mobileSrc={image.mobileSrc}
          alt={image.alt}
          priority
          width={1920}
          height={1080}
          quality={90}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-charcoal/25 via-charcoal/10 to-charcoal/35"
        />
        <div className="container relative h-full flex items-center justify-center">
          <h1 className="animate-fade-in font-larken font-light text-[40px] md:text-[48px] lg:text-[64px] text-white tracking-[0%] leading-[100%] text-center">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
