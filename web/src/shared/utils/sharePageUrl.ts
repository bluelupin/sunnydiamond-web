import { toast } from "@/shared/hooks/use-toast";

export const SHARE_URL_COPIED_MESSAGE = "URL copied.";

export type SharePageUrlOptions = {
  url?: string;
  title?: string;
  showCopiedToast?: boolean;
  copiedToastMessage?: string;
};

export type SharePageUrlResult = "shared" | "copied" | "cancelled" | "failed";

function resolveShareUrl(url?: string): string {
  if (url?.trim()) {
    return url.trim();
  }

  if (typeof window !== "undefined") {
    return window.location.href;
  }

  return "";
}

function prefersNativeShare(): boolean {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return false;
  }

  return (
    navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  );
}

/** Desktop copies the URL and shows a toast; mobile opens the native share sheet when available. */
export async function sharePageUrl(
  options: SharePageUrlOptions = {},
): Promise<SharePageUrlResult> {
  const shareUrl = resolveShareUrl(options.url);
  if (!shareUrl) {
    return "failed";
  }

  const shareTitle = options.title ?? (typeof document !== "undefined" ? document.title : "");

  if (prefersNativeShare()) {
    try {
      await navigator.share({ title: shareTitle, url: shareUrl });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return "failed";
  }

  try {
    await navigator.clipboard.writeText(shareUrl);
    if (options.showCopiedToast ?? true) {
      toast({ title: options.copiedToastMessage ?? SHARE_URL_COPIED_MESSAGE });
    }
    return "copied";
  } catch {
    return "failed";
  }
}
