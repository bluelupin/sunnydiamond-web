import Image from "next/image";
import type { BlogDetail } from "../types";

type BlogDetailHeroProps = {
  heroImage: BlogDetail["heroImage"];
};

const BlogDetailHero = ({ heroImage }: BlogDetailHeroProps) => {
  return (
    <div className="relative h-[670px] w-full shrink-0 overflow-hidden bg-white md:h-[500px] desktop:h-[700px]">
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
    </div>
  );
};

export default BlogDetailHero;
