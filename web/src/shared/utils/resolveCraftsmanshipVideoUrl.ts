import { appendIosMediaFragment } from "@/shared/utils/iosScrollVideo";
import { isIosWebKit } from "@/shared/utils/isIosWebKit";

function stripQuery(url: string): string {
  return url.split("?")[0]?.toLowerCase() ?? "";
}

export function isWebmVideoUrl(url: string): boolean {
  return stripQuery(url).endsWith(".webm");
}

export function isIosFriendlyVideoUrl(url: string): boolean {
  return /\.(?:mp4|m4v|mov)(?:[?#]|$)/i.test(url);
}

/**
 * iOS Safari does not decode WebM and may fail on extension-less CDN URLs — prefer a known MP4 fallback.
 */
export function resolveCraftsmanshipPlaybackUrl(
  url: string,
  desktopFallbackUrl?: string,
): string {
  if (!isIosWebKit()) {
    return url;
  }

  if (
    desktopFallbackUrl &&
    isWebmVideoUrl(url) &&
    !isWebmVideoUrl(desktopFallbackUrl)
  ) {
    return appendIosMediaFragment(desktopFallbackUrl);
  }

  if (
    desktopFallbackUrl &&
    !isIosFriendlyVideoUrl(url) &&
    isIosFriendlyVideoUrl(desktopFallbackUrl)
  ) {
    return appendIosMediaFragment(desktopFallbackUrl);
  }

  return appendIosMediaFragment(url);
}
