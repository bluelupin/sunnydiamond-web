import Image from "next/image";
import type { BlogDetail } from "../types";

type BlogDetailHeroProps = {
  heroImage: BlogDetail["heroImage"];
};

const BlogDetailHero = ({ heroImage }: BlogDetailHeroProps) => {
  if (!heroImage.src) {
    return null;
  }

  return (
    <div className="relative w-full shrink-0 overflow-hidden bg-white xl:mb-16 lg:mb-10 mb-6">
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        width={1920}
        height={1080}
        priority
        className="h-auto w-full"
        sizes="100vw"
      />
    </div>
  );
};

export default BlogDetailHero;
