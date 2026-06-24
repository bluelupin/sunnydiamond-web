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
    const usePicture = hasDistinctMobile || hasDistinctRetina;

    const image = (
        <Image
            src={desktopImage}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            sizes={sizes}
            quality={quality}
            className={cn("h-full w-full object-cover", className)}
        />
    );

    // Avoid <picture><source> when URLs match desktop — mobile would load the raw
    // asset while Next.js preloads /_next/image, triggering Lighthouse fetchpriority warnings.
    if (!usePicture) {
        return image;
    }

    return (
        <picture className="block h-full w-full">
            {hasDistinctMobile ? (
                <source media="(max-width: 767px)" srcSet={mobileImage!} />
            ) : null}

            {hasDistinctRetina ? (
                <source
                    media="(min-width: 768px) and (-webkit-min-device-pixel-ratio: 2)"
                    srcSet={retinaImage!}
                />
            ) : null}

            {image}
        </picture>
    );
};

export default ResponsiveImage;
