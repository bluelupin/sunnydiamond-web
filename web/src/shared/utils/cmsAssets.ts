import { getStrapiBaseUrl } from "@/api/config";

export function getCmsAssetUrl(url?: string | null): string | undefined {  const raw = typeof url === "string" ? url.trim() : "";
  if (!raw) return undefined;

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  let cmsRoot = "";
  try {
    cmsRoot = getStrapiBaseUrl();
  } catch {
    cmsRoot = "";
  }

  if (!cmsRoot) return raw;

  const base = cmsRoot.endsWith("/") ? cmsRoot.slice(0, -1) : cmsRoot;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${base}${path}`;
}

