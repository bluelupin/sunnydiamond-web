import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "tertiary-cta-underline": ["text-tertiary-cta-underline"],
      // Custom utility — must not be collapsed with text-{color} classes.
      // "font-size": ["text-tertiary-cta-underline"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
