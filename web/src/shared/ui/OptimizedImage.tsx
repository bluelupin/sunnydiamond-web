import { cn } from "@/shared/utils/cn";
import { getImageSrc } from "@/shared/utils/image";
import type { StaticImageData } from "next/image";

interface OptimizedImageProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Wrapper component for optimized image rendering.
 * Uses <picture> with lazy loading, decoding, and fetchpriority hints.
 * When WebP/AVIF sources become available via build tooling, extend the
 * <source> elements here.
 */
const OptimizedImage = ({
  src,
  alt,
  width = 800,
  height = 800,
  className,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: OptimizedImageProps) => {
  const imageSrc = getImageSrc(src);

  return (
    <picture>
      {/* Future: add <source type="image/avif" srcSet="..."> */}
      {/* Future: add <source type="image/webp" srcSet="..."> */}
      {imageSrc ?
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : undefined}
          sizes={sizes}
          className={cn("w-full h-full object-cover", className)}
        />
        : null}
    </picture>
  );
};

export default OptimizedImage;
