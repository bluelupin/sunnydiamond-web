"use client";

import React from "react";
import ContactPhoneLink from "@/features/contact/components/ContactPhoneLink";
import { POLICY_TERTIARY_LINK_CLASSNAME } from "./policyLinkStyles";

/** Render safe links from plain CMS text. */
export default function PolicyText({ text }: { text: string }) {
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
    const className = POLICY_TERTIARY_LINK_CLASSNAME;

    if (isEmail) {
      parts.push(<a key={start} href={`mailto:${value}`} className={className}>{value}</a>);
    } else if (isPhone) {
      parts.push(
        <ContactPhoneLink
          key={start}
          href={`tel:${value.replace(/[^\d+]/g, "")}`}
          label={value}
          variant="plain"
          className={className}
        />,
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
