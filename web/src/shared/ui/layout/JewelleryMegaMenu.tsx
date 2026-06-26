"use client";

import Image from "next/image";
import Link from "next/link";

type JewelleryCategory = {
  label: string;
  href: string;
  image: string | null;
};

const DESKTOP_CATEGORIES: JewelleryCategory[] = [
  { label: "Bangles", href: "/jewellery/bangles", image: "/images/navigation/jewellery/bangles.png" },
  { label: "Necklaces", href: "/jewellery/necklaces", image: "/images/navigation/jewellery/necklaces-2.png" },
  { label: "Rings", href: "/jewellery/rings", image: "/images/navigation/jewellery/rings-1.png" },
  { label: "Pendants", href: "/jewellery/pendants", image: "/images/navigation/jewellery/pendants.png" },
  { label: "Nose pins", href: "/jewellery/nose-pins", image: "/images/navigation/jewellery/nose-pins.png" },
  { label: "Earrings", href: "/jewellery/earrings", image: "/images/navigation/jewellery/earrings.png" },
  { label: "Bracelets", href: "/jewellery/bracelets", image: "/images/navigation/jewellery/bracelets.png" },
  { label: "All Products", href: "/jewellery", image: null },
];

type JewelleryMegaMenuProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
};

export const JewelleryMegaMenu = ({ onMouseEnter, onMouseLeave, onClose }: JewelleryMegaMenuProps) => {
  const row1 = DESKTOP_CATEGORIES.slice(0, 4);
  const row2 = DESKTOP_CATEGORIES.slice(4);

  return (
    <div
      className="absolute left-0 right-0 top-full z-40 border-t border-[#ECE9E9] bg-white shadow-sm"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col gap-8 px-[120px] py-10">
        {[row1, row2].map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-[12px] items-start">
            {row.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                onClick={onClose}
                className="group flex flex-[1_0_0] flex-col gap-2 min-w-0"
              >
                <div className="relative h-[204px] w-full shrink-0 overflow-hidden">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 1440px) 25vw, 300px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-benefitSurface">
                      <span className="font-gill text-[20px] leading-110 darkblack">
                        All Products
                      </span>
                    </div>
                  )}
                </div>
                {cat.image && (
                  <span className="font-gill text-[20px] leading-110 darkblack transition-opacity group-hover:opacity-70">
                    {cat.label}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
