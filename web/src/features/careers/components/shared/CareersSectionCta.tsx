"use client";

import { cn } from "@/shared/utils/cn";

type CareersSectionCtaVariant = "button" | "link";

type CareersSectionCtaProps = {
  children: string;
  onClick?: () => void;
  className?: string;
  variant?: CareersSectionCtaVariant;
};

const CareersSectionCta = ({
  children,
  onClick,
  className,
  variant = "button",
}: CareersSectionCtaProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
        variant === "button" &&
          "md:inline-flex md:h-14 md:items-center md:justify-center md:border-0 md:bg-darkblack md:px-8 md:pb-0 md:text-white md:hover:opacity-90",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default CareersSectionCta;
