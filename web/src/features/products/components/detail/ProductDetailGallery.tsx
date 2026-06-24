import OptimizedImage from "@/shared/ui/OptimizedImage";
import type { Product } from "@/features/products/data/products";
import type { StaticImageData } from "next/image";

type ProductDetailGalleryProps = {
  product: Product;
};

const galleryFrameClass =
  "relative w-full overflow-hidden bg-gray300 px-6 py-12 lg:h-[680px] lg:px-6 lg:py-12";

const thumbFrameClass =
  "relative min-h-[280px] flex-1 overflow-hidden bg-gray300 px-4 py-8 sm:min-h-[360px] lg:h-[464px] lg:px-6 lg:py-12";

function GalleryImage({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string | StaticImageData;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={className ?? "relative h-full min-h-[240px] w-full"}>
      <OptimizedImage
        src={src}
        alt={alt}
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 783px"
        className="object-contain"
      />
    </div>
  );
}

const ProductDetailGallery = ({ product }: ProductDetailGalleryProps) => {
  const [heroImage, thumbOne, thumbTwo] = product.images;
  const lifestyleImage = product.images[2] ?? product.image;

  return (
    <div className="flex flex-col gap-3 lg:gap-3">
      <div className={galleryFrameClass}>
        <GalleryImage
          src={heroImage ?? product.image}
          alt={`${product.name} — primary view`}
          priority
          className="relative mx-auto h-full min-h-[320px] max-w-[504px]"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row lg:gap-3">
        <div className={thumbFrameClass}>
          <GalleryImage
            src={thumbOne ?? product.image}
            alt={`${product.name} — detail view`}
            className="relative mx-auto h-full min-h-[200px] max-w-[312px]"
          />
        </div>
        <div className="relative min-h-[280px] w-full overflow-hidden sm:min-h-[360px] lg:h-[464px] lg:w-[385px] lg:shrink-0">
          <OptimizedImage
            src={thumbTwo ?? product.image}
            alt={`${product.name} — alternate view`}
            sizes="(max-width: 1024px) 50vw, 385px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden lg:h-[680px]">
        <OptimizedImage
          src={lifestyleImage}
          alt={`${product.name} — lifestyle`}
          sizes="(max-width: 1024px) 100vw, 783px"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default ProductDetailGallery;
