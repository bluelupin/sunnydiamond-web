import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge<"tertiary-cta-underline">({
  extend: {
    classGroups: {
      "tertiary-cta-underline": ["text-tertiary-cta-underline"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
