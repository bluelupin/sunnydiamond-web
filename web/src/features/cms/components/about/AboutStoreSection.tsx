import Link from "next/link";
import { MapPin } from "lucide-react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import type { AboutStoreContent } from "@/types/about/aboutPage";

interface AboutStoreSectionProps {
  id?: string;
  content: AboutStoreContent;
}

const AboutStoreSection = ({ id, content }: AboutStoreSectionProps) => {
  const { title, description, image, cta } = content;

  return (
    <section id={id} className="relative w-full overflow-hidden">
      <div className="relative h-465 md:h-620 lg:h-730">
        <ResponsiveImage
          desktopSrc={image.desktopSrc}
          mobileSrc={image.mobileSrc}
          alt={image.alt}
          width={1920}
          height={1080}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="container relative h-full flex items-center justify-center lg:justify-end py-10 md:py-16">
          <div className="w-full max-w-[420px] bg-white p-8 md:p-10 lg:p-12 shadow-sm">
            <MapPin
              size={26}
              strokeWidth={1}
              className="text-darkblack mb-5"
              aria-hidden
            />
            <h2 className="font-larken font-light text-2xl md:text-3xl lg:text-[34px] text-darkblack tracking-[0%] leading-[115%] mb-4">
              {title}
            </h2>
            <p className="font-gill text-sm md:text-base text-gray500 font-light tracking-[0.5%] leading-[170%]">
              {description}
            </p>
            {cta ? (
              <Link
                href={cta.url}
                className="group relative overflow-hidden mt-7 inline-flex items-center justify-center border-[0.8px] border-darkblack text-darkblack text-sm md:text-base px-8 h-12 md:h-50 tracking-[1.8%] uppercase font-gill transition-colors duration-500"
              >
                <span className="absolute inset-0 bg-darkblack origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                  {cta.label}
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStoreSection;
