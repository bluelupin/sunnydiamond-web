import React from "react";

/** Render links from plain CMS text while keeping the rest escaped by React. */
export default function PolicyText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const pattern = /https?:\/\/[^\s<>"']+/gi;
  let offset = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    const href = match[0].replace(/[.,;:!?)}\]]+$/, "");
    let url: URL;
    try { url = new URL(href); } catch { continue; }
    parts.push(text.slice(offset, start));
    const label = url.hostname === "sunnydiamonds-web-dev.on-forge.com" && url.pathname === "/" && !url.search && !url.hash
      ? "Sunny Diamonds" : href;
    parts.push(
      <a key={start} href={href} target="_blank" rel="noopener noreferrer"
        className="break-words underline underline-offset-4 hover:text-darkblack focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
        {label}
      </a>,
    );
    offset = start + href.length;
  }
  parts.push(text.slice(offset));
  return <>{parts}</>;
}
