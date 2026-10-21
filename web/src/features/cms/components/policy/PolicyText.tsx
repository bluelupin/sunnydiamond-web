"use client";

import React from "react";
import { useToast } from "@/shared/hooks/use-toast";

/** Render safe links from plain CMS text. */
export default function PolicyText({ text }: { text: string }) {
  const { toast } = useToast();
  const parts: React.ReactNode[] = [];
  const pattern = /https?:\/\/[^\s<>"']+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\+?\d[\d\s().-]{7,}\d/gi;
  let offset = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    const value = match[0].replace(/[.,;:!?)}\]]+$/, "");
    const digits = value.replace(/\D/g, "");
    const isEmail = /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(value);
    const isPhone = !/^https?:\/\//i.test(value) && !isEmail && digits.length >= 10;
    let url: URL | undefined;

    if (!isEmail && !isPhone) {
      try {
        url = new URL(value);
      } catch {
        continue;
      }
    }

    parts.push(text.slice(offset, start));
    const className = "break-words underline underline-offset-4 hover:text-darkblack focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

    if (isEmail) {
      parts.push(<a key={start} href={`mailto:${value}`} className={className}>{value}</a>);
    } else if (isPhone) {
      parts.push(
        <button
          key={start}
          type="button"
          className={className}
          onClick={async (event) => {
            event.preventDefault();
            try {
              await navigator.clipboard.writeText(value.trim());
              toast({ title: "Phone number copied" });
            } catch {
              toast({ title: "Unable to copy", description: "Please copy the phone number manually." });
            }
          }}
        >
          {value}
        </button>,
      );
    } else if (url) {
      const label = url.hostname === "sunnydiamonds-web-dev.on-forge.com" && url.pathname === "/" && !url.search && !url.hash
        ? "Sunny Diamonds"
        : value;
      parts.push(
        <a key={start} href={value} target="_blank" rel="noopener noreferrer" className={className}>
          {label}
        </a>,
      );
    }

    offset = start + value.length;
  }

  parts.push(text.slice(offset));
  return <>{parts}</>;
}
