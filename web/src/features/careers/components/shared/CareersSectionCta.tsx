"use client";

import { DetailTextLink } from "@/features/products/components/detail/shared";
import { careersDarkCtaClassName } from "@/features/careers/constants/careersCtaStyles";
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
  if (variant === "link") {
    return (
      <DetailTextLink onClick={onClick} className={className}>
        {children}
      </DetailTextLink>
    );
  }

  return (
    <>
      <DetailTextLink onClick={onClick} className={cn("md:hidden", className)}>
        {children}
      </DetailTextLink>
      <button
        type="button"
        onClick={onClick}
        className={cn(careersDarkCtaClassName, "hidden md:inline-flex md:px-8", className)}
      >
        <span className="relative z-10">{children}</span>
      </button>
    </>
  );
};

export default CareersSectionCta;
