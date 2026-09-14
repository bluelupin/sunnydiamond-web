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
    <div className="relative w-full shrink-0 overflow-hidden bg-white xl:mb-16 lg:mb-10 mb-6">
      <ResponsiveImage
        desktopSrc={desktopUrl ?? ""}
        mobileSrc={mobileUrl ?? undefined}
        alt={heroImage.alt}
        width={1920}
        height={1080}
        priority
        sizes="100vw"
        className="h-auto w-full object-cover"
      />
    </div>
  );
};

export default BlogDetailHero;
