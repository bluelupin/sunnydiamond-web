import Image, { StaticImageData } from "next/image";
import { cn } from "../../shared/utils/cn";
import { getImageSrc } from "../../shared/utils/image";

interface ResponsiveImageProps {
  desktopSrc: string | StaticImageData;
  mobileSrc?: string | StaticImageData;
  retinaSrc?: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

const ResponsiveImage = ({
  desktopSrc,
  mobileSrc,
  retinaSrc,
  alt,
  width,
  height,
  className,
  priority = false,
  quality,
  sizes = "100vw",
}: ResponsiveImageProps) => {
  const desktopImage = getImageSrc(desktopSrc);
  if (!desktopImage) {
    return null;
  }

  const mobileImage = mobileSrc ? getImageSrc(mobileSrc) : null;
  const retinaImage = retinaSrc ? getImageSrc(retinaSrc) : null;
  const hasDistinctMobile = mobileImage !== null && mobileImage !== desktopImage;
  const hasDistinctRetina = retinaImage !== null && retinaImage !== desktopImage;

  const imageClassName = cn("h-full w-full object-cover", className);
  const commonProps = {
    alt,
    width,
    height,
    priority,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    fetchPriority: priority ? ("high" as const) : undefined,
    sizes,
    quality,
  };

  if (hasDistinctMobile) {
    return (
      <>
        <Image
          {...commonProps}
          src={mobileImage}
          className={cn(imageClassName, "md:hidden")}
        />
        <Image
          {...commonProps}
          src={hasDistinctRetina ? retinaImage! : desktopImage}
          className={cn(imageClassName, "hidden md:block")}
        />
      </>
    );
  }

  if (hasDistinctRetina) {
    return (
      <>
        <Image
          {...commonProps}
          src={desktopImage}
          className={cn(imageClassName, "md:hidden")}
        />
        <Image
          {...commonProps}
          src={retinaImage}
          className={cn(imageClassName, "hidden md:block")}
        />
      </>
    );
  }

  return <Image {...commonProps} src={desktopImage} className={imageClassName} />;
};

export default ResponsiveImage;
