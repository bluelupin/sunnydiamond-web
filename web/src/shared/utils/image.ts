import type { StaticImageData } from "next/image";
import fallBackImage from "@/assets/fallBackImage.png";

type ImageSource = string | StaticImageData | { src: string };

function toStaticImageData(source: ImageSource): string | StaticImageData {
  if (typeof source === "string" || "height" in source) {
    return source;
  }

  return source.src;
}

export function getImageSrc(source: ImageSource | null | undefined): string | null {
  if (source == null) {
    return null;
  }

  const raw = typeof source === "string" ? source : source.src;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveImageSrc(
  source: ImageSource | null | undefined,
  fallback: ImageSource = fallBackImage,
): string | StaticImageData {
  const resolved = getImageSrc(source);
  if (resolved) {
    return resolved;
  }

  return toStaticImageData(fallback);
}

export function resolveImageSrcString(
  source: ImageSource | null | undefined,
  fallback: ImageSource = fallBackImage,
): string {
  const resolved = resolveImageSrc(source, fallback);
  return typeof resolved === "string" ? resolved : resolved.src;
}
