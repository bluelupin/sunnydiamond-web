/** Tertiary CTA — matches Policy plain-text links and DetailTextLink. */
export const POLICY_TERTIARY_LINK_CLASSNAME =
  "text-tertiary-cta-underline inline-flex w-fit max-w-full shrink-0 font-gill text-[15px] font-medium uppercase leading-110 text-darkblack no-underline break-words md:text-base cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

/** Support section phone / email — tertiary hover, Figma text-sm (no uppercase). */
export const POLICY_SUPPORT_TERTIARY_LINK_CLASSNAME =
  "text-tertiary-cta-underline inline-flex w-fit max-w-full break-all pb-1 font-gill text-sm font-normal leading-110 text-darkblack no-underline cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * CKEditor anchors must carry `text-tertiary-cta-underline` on the element itself
 * so globals.css `::after` hover animation applies (Tailwind `[&_a]:` cannot do this).
 */
export function enrichPolicyRichHtmlAnchors(html: string): string {
  const linkClass = POLICY_TERTIARY_LINK_CLASSNAME;

  return html.replace(/<a\b([^>]*?)>/gi, (_match, attrs: string) => {
    const classMatch = attrs.match(/\bclass\s*=\s*(["'])([\s\S]*?)\1/i);
    if (classMatch) {
      const quote = classMatch[1];
      const existing = classMatch[2].trim();
      const merged = existing.includes("text-tertiary-cta-underline")
        ? existing
        : `${linkClass} ${existing}`.trim();
      const nextAttrs = attrs.replace(classMatch[0], `class=${quote}${merged}${quote}`);
      return `<a${nextAttrs}>`;
    }

    return `<a class="${linkClass}"${attrs}>`;
  });
}
