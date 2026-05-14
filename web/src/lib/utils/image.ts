import type { StaticImageData } from "next/image";

type ImageSource = string | StaticImageData | { src: string };

export function getImageSrc(source: ImageSource) {
  return typeof source === "string" ? source : source.src;
}
