import { cn } from "@/shared/utils/cn";
import { getImageSrc } from "@/shared/utils/image";
import type { StaticImageData } from "next/image";
import Image from "next/image";

interface OptimizedImageProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Passed to next/image; AVIF/WebP static pairs use native <picture> instead */
  quality?: number;
}

const getAvifWebpPair = (src: string) => {
  if (!src.startsWith("/") || !src.endsWith(".avif")) return null;
  return { avif: src, webp: src.replace(/\.avif$/, ".webp") };
};

/**
 * Optimized image wrapper.
 * - Public `.avif` assets: `<picture>` with AVIF q90 primary + WebP q90 fallback
 * - Other sources: next/image with automatic AVIF/WebP negotiation (see next.config)
 */
const OptimizedImage = ({
  src,
  alt,
  width = 800,
  height = 800,
  className,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  quality = 90,
}: OptimizedImageProps) => {
  const imageSrc = getImageSrc(src);
  const imageClassName = cn(className ? "object-cover" : "size-full object-cover", className);

  if (imageSrc) {
    const modernPair = getAvifWebpPair(imageSrc);

    if (modernPair) {
      return (
        <picture>
          <source srcSet={modernPair.avif} type="image/avif" />
          <source srcSet={modernPair.webp} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={modernPair.webp}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : undefined}
            sizes={sizes}
            className={imageClassName}
          />
        </picture>
      );
    }

    return (
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        className={imageClassName}
      />
    );
  }

  return null;
};

export default OptimizedImage;
