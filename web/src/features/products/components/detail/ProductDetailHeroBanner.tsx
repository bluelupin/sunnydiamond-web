import Image from "next/image";

type ProductDetailHeroBannerProps = {
  imageSrc: string;
  alt?: string;
};

const ProductDetailHeroBanner = ({
  imageSrc,
  alt = "Sunny Diamonds lifestyle",
}: ProductDetailHeroBannerProps) => (
  <section aria-label="Lifestyle showcase" className="relative h-[361px] w-full overflow-hidden lg:h-[800px]">
    <Image src={imageSrc} alt={alt} fill priority={false} className="object-cover" sizes="100vw" />
  </section>
);

export default ProductDetailHeroBanner;
