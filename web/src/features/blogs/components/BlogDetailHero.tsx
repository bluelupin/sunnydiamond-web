import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import type { BlogDetail } from "../types";

type BlogDetailHeroProps = {
  heroImage: BlogDetail["heroImage"];
};

const BlogDetailHero = ({ heroImage }: BlogDetailHeroProps) => {
  const desktopUrl = heroImage.desktopUrl || heroImage.mobileUrl;
  const mobileUrl = heroImage.mobileUrl || heroImage.desktopUrl;

  if (!desktopUrl && !mobileUrl) {
    return null;
  }

  return (
    <div className="relative mx-auto w-full shrink-0 overflow-hidden bg-white xl:mb-16 lg:mb-10 mb-6">
      {/* Figma 1480:178788 — desktop 1000×515 centered; mobile 343×599 crop */}
      <div className="relative w-full h-auto">
        <ResponsiveImage
          desktopSrc={desktopUrl ?? ""}
          mobileSrc={mobileUrl ?? undefined}
          alt={heroImage.alt}
          fill
          priority
          sizes="(max-width: 767px) 100vw, 1000px"
          className="object-cover w-full h-full !relative"
        />
      </div>
    </div>
  );
};

export default BlogDetailHero;
