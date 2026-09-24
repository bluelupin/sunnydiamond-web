import { preload } from "react-dom";

/** Preload above-the-fold hero poster images with high fetch priority (PLP / Contact pattern). */
export function preloadPlpHeroLcpImages(options: {
  desktopUrl?: string | null;
  mobileUrl?: string | null;
}): void {
  const mobileLcp = options.mobileUrl?.trim() || options.desktopUrl?.trim();
  if (mobileLcp) {
    preload(mobileLcp, { as: "image", fetchPriority: "high" });
  }

  const desktopUrl = options.desktopUrl?.trim();
  if (desktopUrl && desktopUrl !== mobileLcp) {
    preload(desktopUrl, { as: "image", fetchPriority: "high" });
  }
}
