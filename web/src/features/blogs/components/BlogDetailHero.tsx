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
      <div className="relative mx-auto aspect-[3/2] w-full max-w-[1000px]">
        <ResponsiveImage
          desktopSrc={desktopUrl ?? ""}
          mobileSrc={mobileUrl ?? undefined}
          alt={heroImage.alt}
          fill
          priority
          sizes="(max-width: 767px) 100vw, 1000px"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default BlogDetailHero;
