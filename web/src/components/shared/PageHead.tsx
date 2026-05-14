 "use client";

import { useEffect } from "react";
import { siteConfig } from "@/data/siteConfig";

interface PageHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown>;
}

const PageHead = ({ title, description, canonicalPath, jsonLd }: PageHeadProps) => {
  useEffect(() => {
    const fullTitle = title
      ? siteConfig.seo.titleTemplate.replace("%s", title)
      : siteConfig.seo.defaultTitle;
    document.title = fullTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description || siteConfig.seo.defaultDescription);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description || siteConfig.seo.defaultDescription);

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalPath) {
      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        // mark element as created by this component so we can safely remove it later
        canonicalEl.setAttribute("data-pagehead", "true");
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute("href", `${siteConfig.seo.siteUrl}${canonicalPath}`);
    } else if (canonicalEl) {
      // only remove if this component created it
      if (canonicalEl.getAttribute("data-pagehead") === "true" && canonicalEl.parentNode) {
        canonicalEl.parentNode.removeChild(canonicalEl);
      }
      canonicalEl = null;
    }

    // JSON-LD
    let scriptEl = document.querySelector('script[data-jsonld]') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.setAttribute("type", "application/ld+json");
        scriptEl.setAttribute("data-jsonld", "true");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      if (scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);
    }

    return () => {
      if (scriptEl && scriptEl.parentNode && scriptEl.getAttribute("data-jsonld") === "true") {
        scriptEl.parentNode.removeChild(scriptEl);
      }
      if (canonicalEl && canonicalEl.parentNode && canonicalEl.getAttribute("data-pagehead") === "true") {
        canonicalEl.parentNode.removeChild(canonicalEl);
      }
    };
  }, [title, description, canonicalPath, jsonLd]);

  return null;
};

export default PageHead;
