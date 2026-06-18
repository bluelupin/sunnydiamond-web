import Image from "next/image";
import { DetailTextLink } from "./shared";

type ProductDetailVisitUsSectionProps = {
  imageSrc: string;
};

const ProductDetailVisitUsSection = ({ imageSrc }: ProductDetailVisitUsSectionProps) => (
  <section aria-labelledby="visit-us-heading" className="relative h-[480px] w-full overflow-hidden lg:h-[800px]">
    <Image src={imageSrc} alt="" fill className="object-cover" sizes="100vw" aria-hidden />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
    <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-10 px-5 text-center text-white">
      <div className="flex flex-col gap-4">
        <h2 id="visit-us-heading" className="font-larken text-[40px] font-light leading-110 lg:text-48">
          Visit Us
        </h2>
        <p className="font-gill text-xl font-light leading-110">
          Designs thoughtfully crafted to bring your vision to life
        </p>
      </div>
      <DetailTextLink href="/contact" light>
        Book a Visit
      </DetailTextLink>
    </div>
  </section>
);

export default ProductDetailVisitUsSection;
