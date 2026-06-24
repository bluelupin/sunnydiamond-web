import Image from "next/image";
import Link from "next/link";

type ProductDetailVisitUsSectionProps = {
  imageSrc: string;
};

const ProductDetailVisitUsSection = ({ imageSrc }: ProductDetailVisitUsSectionProps) => (
  <section
    aria-labelledby="visit-us-heading"
    className="relative h-[800px] w-full overflow-hidden"
  >
    <div className="absolute inset-x-0 top-0 mx-auto h-804 w-full max-w-1440">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={false}
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />
    </div>

    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-400 w-full max-w-1440 backdrop-blur-[5px] bg-gradient-to-b from-transparent to-black/80"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[387px] mx-auto h-417 w-full max-w-1440 backdrop-blur-[16px]"
    />

    <div className="absolute inset-x-0 bottom-[64px] flex justify-center px-5 md:px-8 lg:px-10">
      <div className="flex w-full max-w-1360 flex-col items-center gap-40">
        <div className="flex flex-col items-center gap-4 text-center text-white">
          <h2 id="visit-us-heading" className="font-larken text-48 font-light leading-110">
            Visit Us
          </h2>
          <p className="font-gill text-20 font-light leading-110">
            Designs thoughtfully crafted to bring your vision to life
          </p>
        </div>

        <Link
          href="/book-an-appointment"
          className="inline-flex border-b-[1.5px] border-white pb-1 font-gill text-sm uppercase leading-110 text-white"
        >
          Book a Visit
        </Link>
      </div>
    </div>
  </section>
);

export default ProductDetailVisitUsSection;
