import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { PLP_HERO_IMAGE_QUALITY } from "@/features/jewellery-product/utils/jewelleryPlpImage";
import { getImageSrc } from "@/shared/utils/image";
import HeroBackgroundVideo from "./HeroBackgroundVideo";

type HeroBackgroundMediaProps = {
  desktopImageUrl: string;
  mobileImageUrl?: string;
  desktopAlt: string;
  mobileAlt: string;
  cmsVideoUrl?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
};

const HeroBackgroundMedia = ({
  desktopImageUrl,
  mobileImageUrl,
  desktopAlt,
  mobileAlt,
  cmsVideoUrl,
  priority = true,
  quality = PLP_HERO_IMAGE_QUALITY,
  sizes = "100vw",
}: HeroBackgroundMediaProps) => {
  const videoSrc = cmsVideoUrl?.trim() ?? "";
  const hasVideo = Boolean(videoSrc);

  const posterSrc = getImageSrc(mobileImageUrl || desktopImageUrl);
  const hasHeroImage = Boolean(posterSrc);

  if (!hasHeroImage && !hasVideo) {
    return <div className="absolute inset-0 bg-gray200" aria-hidden />;
  }

  return (
    <>
      {hasHeroImage ? (
        <ResponsiveImage
          desktopSrc={desktopImageUrl || mobileImageUrl || posterSrc || ""}
          mobileSrc={mobileImageUrl}
          alt={desktopAlt}
          desktopAlt={desktopAlt}
          mobileAlt={mobileAlt}
          priority={priority}
          width={1920}
          height={1080}
          sizes={sizes}
          quality={quality}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray200" aria-hidden />
      )}

      {hasVideo ? <HeroBackgroundVideo src={videoSrc} /> : null}
    </>
  );
};

export default HeroBackgroundMedia;
