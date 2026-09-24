export type UiPlatform = "windows" | "apple" | "other";

export function detectUiPlatform(
  userAgent: string,
  platform = "",
  maxTouchPoints = 0,
): UiPlatform {
  const ua = userAgent || "";
  const plt = platform || "";
  const isIpad = plt === "MacIntel" && maxTouchPoints > 1;
  const isApple = /Mac|iPhone|iPad|iPod/i.test(ua) || isIpad;

  if (/Win/i.test(ua) || /Win/i.test(plt)) {
    return "windows";
  }

  if (isApple) {
    return "apple";
  }

  return "other";
}

export function isWindowsPlatform(
  userAgent: string,
  platform = "",
  maxTouchPoints = 0,
): boolean {
  return detectUiPlatform(userAgent, platform, maxTouchPoints) === "windows";
}
