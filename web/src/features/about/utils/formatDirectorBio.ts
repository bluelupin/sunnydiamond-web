const BLOCK_HTML_PATTERN = /<\s*(p|div|ul|ol|li|h[1-6]|table|blockquote|br)\b/i;

function looksLikeHtmlBio(value: string): boolean {
  return BLOCK_HTML_PATTERN.test(value);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** CMS often stores line breaks as the two characters `\` + `n`, not real newlines. */
function replaceLiteralEscapeSequences(value: string): string {
  return value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n");
}

function normalizeRealNewlines(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function normalizeBioInput(bio: string): string {
  return normalizeRealNewlines(replaceLiteralEscapeSequences(bio)).trim();
}

/** Visible `\n` in HTML bios — replace escaped sequences only (not all HTML whitespace). */
function replaceLiteralNewlinesInHtml(html: string): string {
  return html
    .replace(/\\r\\n/g, "<br />")
    .replace(/\\n/g, "<br />")
    .replace(/\\r/g, "<br />");
}

/**
 * Plain-text bios: each newline becomes one `<br />` (double newline → two breaks, etc.).
 * HTML bios: literal `\n` sequences become `<br />`; CKEditor markup is otherwise unchanged.
 */
export function formatDirectorBioHtml(bio: string): string {
  const normalized = normalizeBioInput(bio);
  if (!normalized) {
    return "";
  }

  if (looksLikeHtmlBio(normalized)) {
    return replaceLiteralNewlinesInHtml(normalized);
  }

  return escapeHtml(normalized).replace(/\n/g, "<br />");
}

export function isDirectorBioHtml(bio: string): boolean {
  return looksLikeHtmlBio(normalizeBioInput(bio));
}
