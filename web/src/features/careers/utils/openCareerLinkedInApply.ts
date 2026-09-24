export function openCareerLinkedInApply(url: string, openInNewTab?: boolean): void {
  const trimmed = url.trim();
  if (!trimmed) {
    return;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return;
    }

    if (openInNewTab === true) {
      window.open(parsed.toString(), "_blank", "noopener,noreferrer");
      return;
    }

    window.location.assign(parsed.toString());
  } catch {
    // Ignore invalid CMS URLs.
  }
}
