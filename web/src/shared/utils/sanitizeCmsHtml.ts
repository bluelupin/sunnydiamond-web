/** True when CMS content looks like CKEditor / rich HTML rather than plain text. */
export function looksLikeCmsHtml(value: string): boolean {
  return /<\/?(?:p|h[1-6]|ul|ol|li|div|figure|img|strong|em|br|a|span|table|blockquote|section)\b/i.test(
    value,
  );
}

/** Strip scripts, inline handlers, and javascript: links from CMS HTML. */
export function sanitizeCmsHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(
      /<a\b([^>]*)href\s*=\s*(["'])\s*javascript:[^"']*\2([^>]*)>/gi,
      "<a$1$3>",
    );
}
