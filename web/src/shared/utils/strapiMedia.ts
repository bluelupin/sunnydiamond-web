import { getCmsAssetUrl } from "./cmsAssets";
import type { StrapiImage, StrapiImagePayload } from "@/types/strapiMedia";

export function extractStrapiImage(image: unknown): StrapiImagePayload {
  if (!image || typeof image !== "object") {
    return null;
  }

  if ("data" in image) {
    const data = (image as { data?: unknown }).data;

    if (data && typeof data === "object" && "attributes" in data) {
      return (data as { attributes?: StrapiImagePayload }).attributes ?? null;
    }
  }

  return image as StrapiImagePayload;
}

export function resolveCmsMediaUrl(image: unknown): string | undefined {
  const payload = extractStrapiImage(image);
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  return typeof payload.url === "string" ? getCmsAssetUrl(payload.url) : undefined;
}

export function resolveCmsAltText(image: unknown): string | undefined {
  const payload = extractStrapiImage(image);
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  return typeof payload.alternativeText === "string" ? payload.alternativeText : undefined;
}
