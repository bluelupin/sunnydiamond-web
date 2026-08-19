import { getCmsAssetUrl } from "./cmsAssets";
import type { StrapiImagePayload } from "@/types/strapiMedia";

function cleanAlt(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function extractStrapiImage(image: unknown): StrapiImagePayload {
  if (!image || typeof image !== "object") {
    return null;
  }

  if ("data" in image) {
    const data = (image as { data?: unknown }).data;

    if (Array.isArray(data)) {
      return extractStrapiImage(data[0]);
    }

    if (data && typeof data === "object" && "attributes" in data) {
      return (data as { attributes?: StrapiImagePayload }).attributes ?? null;
    }

    // Strapi v5 often returns the media file directly under `data`.
    if (data && typeof data === "object" && "url" in data) {
      return data as StrapiImagePayload;
    }

    return null;
  }

  return image as StrapiImagePayload;
}

export function resolveCmsMediaUrl(image: unknown): string | undefined {
  const urls = resolveCmsMediaUrls(image);
  return urls[0];
}

/** All media URLs from a single file or multi-file CMS field (preserves order). */
export function resolveCmsMediaUrls(image: unknown): string[] {
  if (image == null) return [];

  if (Array.isArray(image)) {
    const urls: string[] = [];
    for (const entry of image) {
      urls.push(...resolveCmsMediaUrls(entry));
    }
    return urls;
  }

  const payload = extractStrapiImage(image);
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const url =
    typeof payload.url === "string" ? getCmsAssetUrl(payload.url) : undefined;
  return url ? [url] : [];
}

/**
 * Resolve CMS alt text. Media-library text wins over component fallbacks.
 */
export function resolveCmsAltText(image: unknown): string | undefined {
  if (image == null) return undefined;

  if (Array.isArray(image)) {
    for (const entry of image) {
      const alt = resolveCmsAltText(entry);
      if (alt) return alt;
    }
    return undefined;
  }

  if (typeof image !== "object") return undefined;

  const record = image as Record<string, unknown>;

  const payload = extractStrapiImage(image);
  if (payload && typeof payload === "object") {
    const file = payload as {
      alternativeText?: string | null;
      alternateText?: string | null;
    };
    const fileAlt = cleanAlt(file.alternativeText) ?? cleanAlt(file.alternateText);
    if (fileAlt) return fileAlt;
  }

  const nestedAlt =
    resolveCmsAltText(record.desktopImage) ??
    resolveCmsAltText(record.mobileImage);
  if (nestedAlt) return nestedAlt;

  const componentAlt =
    cleanAlt(record.altText) ??
    cleanAlt(record.iconAltText) ??
    cleanAlt(record.alt) ??
    cleanAlt(record.caption);
  if (componentAlt) return componentAlt;

  return undefined;
}
