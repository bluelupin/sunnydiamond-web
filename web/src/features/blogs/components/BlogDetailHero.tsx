import Image from "next/image";
import type { BlogDetail } from "../types";

type BlogDetailHeroProps = {
  heroImage: BlogDetail["heroImage"];
};

const BlogDetailHero = ({ heroImage }: BlogDetailHeroProps) => {
  return (
    <div className="relative h-[min(670px,90vw)] w-full overflow-hidden md:h-[500px] desktop:h-[700px]">
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );
};

export default BlogDetailHero;
