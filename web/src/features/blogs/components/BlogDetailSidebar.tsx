"use client";

import { Headphones, Share2, Volume1 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { useBrowserTextToSpeech } from "../hooks/useBrowserTextToSpeech";
import type { BlogTableOfContentsItem } from "../types";

type BlogDetailSidebarProps = {
  title: string;
  tableOfContents: BlogTableOfContentsItem[];
  speechText: string;
};

const BlogDetailSidebar = ({
  title,
  tableOfContents,
  speechText,
}: BlogDetailSidebarProps) => {
  const [activeId, setActiveId] = useState(
    tableOfContents[0]?.id ?? "",
  );
  const { isSupported, isSpeaking, toggle } = useBrowserTextToSpeech(speechText);

  useEffect(() => {
    if (tableOfContents.length === 0) {
      return;
    }

    const sectionElements = tableOfContents
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [tableOfContents]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User dismissed share sheet.
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard unavailable.
    }
  }, [title]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <aside
      className="flex w-full flex-col gap-6 border-r border-neutral300 bg-gray300 p-4 desktop:w-[437px] desktop:shrink-0 desktop:gap-10 desktop:p-6"
      aria-label="Blog navigation"
    >
      <div className="flex flex-col gap-6">
        <p className="font-larken text-2xl font-light leading-110 text-darkblack">
          {title}
        </p>

        {tableOfContents.length > 0 ? (
          <nav className="desktop:relative desktop:border-l-2 desktop:border-neutral300">
            <ul className="flex flex-col gap-6 desktop:gap-8">
              {tableOfContents.map((item) => {
                const isActive = item.id === activeId;

                return (
                  <li key={item.id} className="relative desktop:pl-4">
                    {isActive ? (
                      <span
                        className="absolute -left-0.5 top-0 hidden h-[78px] w-0.5 bg-darkblack desktop:block"
                        aria-hidden
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        "w-full text-left font-gill text-base leading-110",
                        isActive
                          ? "font-semibold text-darkblack"
                          : "font-normal text-neutral500",
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={toggle}
          disabled={!isSupported || !speechText.trim()}
          aria-pressed={isSpeaking}
          aria-label={isSpeaking ? "Stop listening to article" : "Listen to article"}
          className={cn(
            "flex h-14 flex-1 items-center justify-center gap-2 border border-neutral300 px-7 text-sm uppercase leading-110 text-darkblack transition-colors hover:border-darkblack",
            (!isSupported || !speechText.trim()) && "pointer-events-none opacity-50",
            isSpeaking && "border-darkblack",
          )}
        >
          <Volume1 className="size-6 shrink-0" strokeWidth="1" aria-hidden />
          {isSpeaking ? "STOP" : "LISTEN"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex h-14 flex-1 items-center justify-center gap-2 border border-neutral300 px-7 text-sm uppercase leading-110 text-darkblack transition-colors hover:border-darkblack"
        >
          <Share2 className="size-6 shrink-0" strokeWidth="1" aria-hidden />
          SHARE
        </button>
      </div>
    </aside>
  );
};

export default BlogDetailSidebar;
