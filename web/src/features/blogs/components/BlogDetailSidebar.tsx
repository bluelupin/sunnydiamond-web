"use client";

import { Share2, Volume1 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { sharePageUrl } from "@/shared/utils/sharePageUrl";
import { useBrowserTextToSpeech } from "../hooks/useBrowserTextToSpeech";
import type { BlogTableOfContentsItem } from "../types";

type BlogDetailSidebarProps = {
  title: string;
  tableOfContents: BlogTableOfContentsItem[];
  speechText: string;
};

const sidebarCtaClassName =
  "btn-border-slide inline-flex h-14 flex-1 items-center justify-center border border-neutral300 px-7 font-gill text-sm uppercase leading-110 text-darkblack";

const NAV_SCROLL_LOCK_MS = 1000;

function resolveActiveSectionId(sectionIds: readonly string[]): string {
  const viewportMid = window.innerHeight * 0.4;
  let active = sectionIds[0] ?? "";

  for (const id of sectionIds) {
    const element = document.getElementById(id);
    if (!element) {
      continue;
    }

    if (element.getBoundingClientRect().top <= viewportMid) {
      active = id;
    }
  }

  return active;
}

const BlogDetailSidebar = ({
  title,
  tableOfContents,
  speechText,
}: BlogDetailSidebarProps) => {
  const [activeId, setActiveId] = useState(
    tableOfContents[0]?.id ?? "",
  );
  const isNavigatingRef = useRef(false);
  const navigationTimeoutRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const { isSupported, isSpeaking, isPaused, isActive, toggle } =
    useBrowserTextToSpeech(speechText);

  const listenLabel = isPaused ? "RESUME" : isSpeaking ? "PAUSE" : "LISTEN";
  const listenAriaLabel = isPaused
    ? "Resume listening to article"
    : isSpeaking
      ? "Pause listening to article"
      : "Listen to article";

  useEffect(() => {
    if (tableOfContents.length === 0) {
      return;
    }

    const sectionIds = tableOfContents.map((item) => item.id);

    const updateActiveSection = () => {
      if (isNavigatingRef.current) {
        return;
      }

      setActiveId(resolveActiveSectionId(sectionIds));
    };

    const onScroll = () => {
      if (scrollRafRef.current != null) {
        return;
      }

      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null;
        updateActiveSection();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }

      if (navigationTimeoutRef.current != null) {
        window.clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [tableOfContents]);

  const handleShare = useCallback(() => {
    void sharePageUrl({ title });
  }, [title]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    isNavigatingRef.current = true;
    setActiveId(id);

    if (navigationTimeoutRef.current != null) {
      window.clearTimeout(navigationTimeoutRef.current);
    }

    element.scrollIntoView({ behavior: "smooth", block: "start" });

    const releaseNavigationLock = () => {
      isNavigatingRef.current = false;
      setActiveId(resolveActiveSectionId(tableOfContents.map((item) => item.id)));
    };

    const onScrollEnd = () => {
      window.removeEventListener("scrollend", onScrollEnd);
      if (navigationTimeoutRef.current != null) {
        window.clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
      releaseNavigationLock();
    };

    window.addEventListener("scrollend", onScrollEnd);
    navigationTimeoutRef.current = window.setTimeout(() => {
      window.removeEventListener("scrollend", onScrollEnd);
      navigationTimeoutRef.current = null;
      releaseNavigationLock();
    }, NAV_SCROLL_LOCK_MS);
  };

  return (
    <aside
      className="flex w-full flex-col gap-8 border-r border-neutral300 bg-gray300 p-4 desktop:w-[437px] desktop:shrink-0 desktop:gap-6 desktop:p-6 desktop:shadow-[0px_4px_2px_rgba(0,0,0,0.1)]"
      aria-label="Blog navigation"
    >
      <div className="flex flex-col gap-8 desktop:gap-6">
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
                        className="absolute -left-[2px] top-0 bottom-0 hidden w-0.5 bg-darkblack desktop:block"
                        aria-hidden
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        "w-full text-left font-gill text-base leading-110 desktop:text-xl",
                        isActive
                          ? "font-semibold text-darkblack desktop:font-normal"
                          : "font-normal text-neutral500 desktop:font-light",
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

      <div className="flex gap-4 desktop:gap-2">
        <button
          type="button"
          onClick={toggle}
          disabled={!isSupported || !speechText.trim()}
          aria-pressed={isActive}
          aria-label={listenAriaLabel}
          className={cn(
            sidebarCtaClassName,
            (!isSupported || !speechText.trim()) &&
              "pointer-events-none opacity-50 disabled:cursor-not-allowed",
            isActive && "border-darkblack",
          )}
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            <Volume1 className="size-6 shrink-0" strokeWidth="1" aria-hidden />
            {listenLabel}
          </span>
        </button>
        <button
          type="button"
          onClick={handleShare}
          className={sidebarCtaClassName}
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            <Share2 className="size-6 shrink-0" strokeWidth="1" aria-hidden />
            SHARE
          </span>
        </button>
      </div>
    </aside>
  );
};

export default BlogDetailSidebar;
