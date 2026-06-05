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
    const mobileImage = mobileSrc
        ? getImageSrc(mobileSrc)
        : desktopImage;

    const retinaImage = retinaSrc
        ? getImageSrc(retinaSrc)
        : desktopImage;

    return (
        <picture>
            {/* Mobile Image */}
            {mobileImage && (
                <source
                    media="(max-width: 767px)"
                    srcSet={mobileImage}
                />
            )}

            {/* Retina Image */}
            {retinaImage && (
                <source
                    media="(min-width: 768px) and (-webkit-min-device-pixel-ratio: 2)"
                    srcSet={retinaImage}
                />
            )}

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
                className={cn(
                    "w-full h-full object-cover",
                    className
                )}
            />
        </picture>
    );
};

export default ResponsiveImage;