"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { History } from "lucide-react";
import SearchIcon from "@/assets/Icons/SearchIcon";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import { useMobileHeaderLayout } from "@/shared/hooks/use-mobile-header-layout";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import {
  MAX_SEARCH_LENGTH,
  searchResultsHref,
  searchTermMatchesInput,
  type QuickSearchProduct,
  type SearchLink,
} from "./quickSearch";
import { SearchDesktopMegaMenu } from "./SearchDesktopMegaMenu";
import { HEADER_SEARCH_TRIGGER_ATTR, searchOverlayFigmaSpec } from "./searchOverlayFigmaSpec";
import { addRecentSearch, readRecentSearches } from "./recentSearches";
import { useQuickSearch } from "./useQuickSearch";

type Option = {
  id: string;
  href: string;
  /** What goes into recent searches when this option is picked. */
  recent: string;
  group: string;
  render: ReactNode;
};

type Group = {
  key: string;
  title: string;
  options: Option[];
  action?: ReactNode;
  /** Figma typing state — flat rows, no section heading. */
  flat?: boolean;
};

function TypeaheadLabel({ label }: { label: string }) {
  return <span className="min-w-0 flex-1 truncate font-normal text-neutral500">{label}</span>;
}

type SearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Header icon toggle — full dismiss (clears query + closes Radix). */
  onRegisterDismiss?: (dismiss: (() => void) | null) => void;
  /** WorldOfSunnyMegaMenu — keep panel open while pointer is over dropdown. */
  onDesktopMouseEnter?: () => void;
  onDesktopMouseLeave?: () => void;
};

const suggestionRowClassName =
  "flex w-full items-center gap-2 py-0 text-left normal-case";

function ProductRow({ product }: { product: QuickSearchProduct }) {
  return (
    <span
      className={cn(
        "min-w-0 flex-1 truncate font-normal text-neutral500",
        productNameDisplayClassName,
      )}
    >
      {product.name}
    </span>
  );
}

function LinkRow({ link }: { link: SearchLink }) {
  return <span className="min-w-0 flex-1 truncate font-normal text-neutral500">{link.label}</span>;
}

export default function SearchOverlay({
  open,
  onOpenChange,
  onRegisterDismiss,
  onDesktopMouseEnter,
  onDesktopMouseLeave,
}: SearchOverlayProps) {
  const router = useRouter();
  const isMobileHeader = useMobileHeaderLayout();
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const [text, setText] = useState("");
  const [highlight, setHighlight] = useState({ key: "", index: -1 });
  const [recent, setRecent] = useState(() => readRecentSearches());
  const { query, active, result, loading, failed } = useQuickSearch(text);
  const lastTracked = useRef("");
  // Radix returns focus to a Dialog.Trigger; the header icons are plain buttons, so remember
  // what had focus when search opened and give it back on close.
  const returnFocus = useRef<HTMLElement | null>(null);
  /** After navigating to results, do not focus the header search control (Enter would reopen search). */
  const skipReturnFocusRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    setRecent(readRecentSearches());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => {
      searchPanelRef.current?.querySelector("input")?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Desktop mega menu stays mounted while collapsed; blur so keystrokes do not hit a hidden input.
  useEffect(() => {
    if (open) return;
    const input = searchPanelRef.current?.querySelector("input");
    if (input instanceof HTMLElement && document.activeElement === input) {
      input.blur();
    }
    if (!skipReturnFocusRef.current) return;
    skipReturnFocusRef.current = false;
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.getAttribute("aria-label") === "Search") {
      active.blur();
    }
  }, [open]);

  const listKey = active ? (result?.query ?? "") : "empty";
  const activeIndex = highlight.key === listKey ? highlight.index : -1;
  const setActiveIndex = (update: number | ((index: number) => number)) =>
    setHighlight({ key: listKey, index: typeof update === "function" ? update(activeIndex) : update });

  // Query or result list changes clear highlight — avoids Enter following a stale hovered row.
  useEffect(() => {
    setHighlight({ key: listKey, index: -1 });
  }, [query, listKey]);

  useEffect(() => {
    if (!result || lastTracked.current === result.query) return;
    lastTracked.current = result.query;
    trackEvent("search", {
      search_term: result.query,
      products: result.products.length,
      categories: result.categories.length,
      articles: result.articles.length,
      services: result.services.length,
    });
  }, [result]);

  const hasResults = Boolean(
    result &&
      (result.products.length || result.categories.length || result.articles.length || result.services.length),
  );

  const prefixTypeahead = useMemo(() => {
    if (!active) return { recent: [] as SearchLink[] };
    const recentLinks = recent
      .filter((label) => searchTermMatchesInput(label, query))
      .map((label) => ({ label, href: searchResultsHref(label) }));
    return { recent: recentLinks };
  }, [active, query, recent]);

  const hasPrefixTypeahead = prefixTypeahead.recent.length > 0;

  const showEmptyState =
    active && Boolean(result) && !loading && !hasResults && !hasPrefixTypeahead && !failed;

  const groups = useMemo<Group[]>(() => {
    const linkOptions = (
      group: string,
      links: SearchLink[],
      recentFrom: (link: SearchLink) => string,
      render: (link: SearchLink) => ReactNode = (link) => <LinkRow link={link} />,
    ): Option[] =>
      links.map((link, index) => ({
        id: `${baseId}-${group}-${index}`,
        href: link.href,
        recent: recentFrom(link),
        group,
        render: render(link),
      }));

    const flatTypingOptions = (): Group[] => {
      const options: Option[] = [
        ...linkOptions("recent", prefixTypeahead.recent, (link) => link.label, (link) => (
          <TypeaheadLabel label={link.label} />
        )),
      ];
      if (result?.query === query) {
        options.push(
          ...linkOptions("categories", result.categories, () => result.query),
          ...result.products.map((product, index) => ({
            id: `${baseId}-products-${index}`,
            href: product.href,
            recent: result.query,
            group: "products",
            render: <ProductRow product={product} />,
          })),
          ...linkOptions("articles", result.articles, () => result.query),
          ...linkOptions("services", result.services, () => result.query),
        );
      }
      if (options.length === 0) return [];
      return [{ key: "typing", title: "", options, flat: true }];
    };

    if (!active) {
      const options: Option[] = linkOptions(
        "recent",
        recent.map((label) => ({ label, href: searchResultsHref(label) })),
        (link) => link.label,
        (link) => <TypeaheadLabel label={link.label} />,
      );
      if (options.length === 0) return [];
      return [
        {
          key: "default",
          title: "",
          flat: true,
          options,
        },
      ];
    }

    // Typing — recent prefix matches, then API categories, products, blogs, services (flat list).
    return flatTypingOptions();
  }, [active, query, result, hasResults, recent, baseId, prefixTypeahead]);

  const showListbox = !showEmptyState && groups.some((group) => group.options.length > 0);

  const options = useMemo(() => groups.flatMap((group) => group.options), [groups]);
  const activeOption = activeIndex >= 0 ? options[activeIndex] : undefined;

  const close = useCallback(() => {
    onOpenChange(false);
    setText("");
    // The overlay stays mounted between openings; a row highlighted last time must not
    // come back when the same words are typed again, or Enter would open it.
    setHighlight({ key: "", index: -1 });
  }, [onOpenChange]);

  useEffect(() => {
    if (!isMobileHeader) return;
    onRegisterDismiss?.(close);
    return () => onRegisterDismiss?.(null);
  }, [close, isMobileHeader, onRegisterDismiss]);

  useEffect(() => {
    if (!open || !isMobileHeader) return;
    const onKeyDown = (event: WindowEventMap["keydown"]) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, isMobileHeader, open]);

  useEffect(() => {
    if (!open || !isMobileHeader) return;

    const headerSearchTriggerSelector = `[${HEADER_SEARCH_TRIGGER_ATTR}]`;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest(headerSearchTriggerSelector)) return;
      if (searchPanelRef.current?.contains(target)) return;
      close();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [close, isMobileHeader, open]);

  const go = (href: string, recentText: string, option?: Option) => {
    if (recentText) {
      addRecentSearch(recentText);
      setRecent(readRecentSearches());
    }
    if (option) {
      trackEvent("select_item", { item_list_name: `search_${option.group}`, search_term: query, href });
    }
    skipReturnFocusRef.current = true;
    close();
    router.push(href);
  };

  const submitHighlightedOption = () => {
    if (activeOption) {
      go(activeOption.href, activeOption.recent, activeOption);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!options.length) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      // Cycle through "nothing highlighted" (-1) and every option.
      const slots = options.length + 1;
      setActiveIndex((index) => ((index + 1 + step + slots) % slots) - 1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      submitHighlightedOption();
    }
  };

  const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitHighlightedOption();
  };

  let optionIndex = -1;

  const searchPanelBody = (
    <div
      ref={searchPanelRef}
      className={cn(
        isMobileHeader
          ? searchOverlayFigmaSpec.panelSurfaceClassName
          : searchOverlayFigmaSpec.desktopPanelSurfaceClassName,
      )}
    >
      <div
        className={cn(
          searchOverlayFigmaSpec.contentTopPaddingClassName,
          searchOverlayFigmaSpec.sectionGapClassName,
          searchOverlayFigmaSpec.contentColumnClassName,
        )}
        style={{ maxWidth: searchOverlayFigmaSpec.contentMaxWidth }}
      >
            <form
              className={cn("w-full shrink-0", searchOverlayFigmaSpec.searchBarClassName)}
              onSubmit={onSearchSubmit}
            >
              <SearchIcon className={searchOverlayFigmaSpec.searchBarIconClassName} aria-hidden />
              <input
                type="search"
                value={text}
                maxLength={MAX_SEARCH_LENGTH}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={onKeyDown}
                tabIndex={open ? 0 : -1}
                placeholder={searchOverlayFigmaSpec.searchPlaceholder}
                role="combobox"
                aria-label="Search"
                aria-expanded={open && showListbox}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={activeOption?.id}
                autoComplete="off"
                enterKeyHint="search"
                className={searchOverlayFigmaSpec.searchInputClassName}
              />
            </form>

            {active && !result && loading && !hasPrefixTypeahead ? (
              <div className={cn("flex flex-col", searchOverlayFigmaSpec.suggestionGapClassName)} aria-hidden>
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <div className="size-6 shrink-0 animate-pulse rounded-sm bg-gray300" />
                    <div className="h-4 w-1/2 animate-pulse bg-gray300" />
                  </div>
                ))}
              </div>
            ) : null}

            {showEmptyState ? (
              <p className={searchOverlayFigmaSpec.emptyStateClassName} role="status">
                {searchOverlayFigmaSpec.emptyStateMessage}
              </p>
            ) : null}
            {active && failed && !result ? (
              <p className="font-gill text-sm font-light leading-110 text-darkblack" role="status">
                Search is not responding. Press Enter to see all results.
              </p>
            ) : null}

            {showListbox ? (
              <div
                id={listId}
                role="listbox"
                aria-label="Search suggestions"
                className={cn("w-full", loading && result && "opacity-70")}
              >
                {groups
                  .filter((group) => group.options.length > 0)
                  .map((group, groupIndex) => (
                    <div
                      key={group.key}
                      role="group"
                      aria-labelledby={
                        group.flat || !group.title ? undefined : `${baseId}-${group.key}-title`
                      }
                      className={cn(
                        "flex flex-col",
                        searchOverlayFigmaSpec.suggestionGapClassName,
                        !group.flat && groupIndex > 0 && "mt-6",
                      )}
                    >
                      {group.flat ? null : group.title || group.action ? (
                        <div
                          className={cn(
                            "flex items-center",
                            group.title ? "justify-between" : "justify-end",
                          )}
                        >
                          {group.title ? (
                            <span
                              id={`${baseId}-${group.key}-title`}
                              className="font-gill text-sm font-light leading-110 text-neutral500"
                            >
                              {group.title}
                            </span>
                          ) : null}
                          {group.action}
                        </div>
                      ) : null}
                      {group.options.map((option) => {
                        optionIndex += 1;
                        const index = optionIndex;
                        const isRecentRow = option.group === "recent";
                        return (
                          <div
                            key={option.id}
                            id={option.id}
                            role="option"
                            aria-selected={index === activeIndex}
                            className={cn(
                              suggestionRowClassName,
                              "cursor-pointer rounded-sm font-gill text-sm leading-110 hover:bg-gray200",
                              index === activeIndex && "bg-gray200",
                            )}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => go(option.href, option.recent, option)}
                          >
                            {isRecentRow ? (
                              <History className="size-6 shrink-0 text-neutral500" strokeWidth={1.25} aria-hidden />
                            ) : (
                              <SearchIcon className={searchOverlayFigmaSpec.suggestionSearchIconClassName} aria-hidden />
                            )}
                            {option.render}
                          </div>
                        );
                      })}
                    </div>
                  ))}
              </div>
            ) : null}

            {/* Not in Figma 4903:69969 (typing/default/empty). Kept for easy restore; full search via Enter.
            {active && query && hasResults ? (
              <button
                type="button"
                className="self-start border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
                onClick={() => go(searchResultsHref(query), query)}
              >
                See all results for &ldquo;{query}&rdquo;
              </button>
            ) : null}
            */}
            </div>
    </div>
  );

  if (!isMobileHeader) {
    return (
      <SearchDesktopMegaMenu
        open={open}
        onMouseEnter={onDesktopMouseEnter}
        onMouseLeave={onDesktopMouseLeave}
      >
        <span className="sr-only">Search Sunny Diamonds</span>
        {searchPanelBody}
      </SearchDesktopMegaMenu>
    );
  }

  if (!open) {
    return null;
  }

  return createPortal(
    <>
      <div
        aria-hidden
        data-state="open"
        className={cn(
          searchOverlayFigmaSpec.mobileOverlayScrimClassName,
          searchOverlayFigmaSpec.mobileOverlayFadeTransitionClassName,
        )}
        onClick={() => close()}
      />
      <div
        role="dialog"
        aria-modal={false}
        aria-label="Search Sunny Diamonds"
        data-state="open"
        className={cn(
          searchOverlayFigmaSpec.mobilePanelShellClassName,
          searchOverlayFigmaSpec.mobilePanelExpandTransitionClassName,
        )}
      >
        {searchPanelBody}
      </div>
    </>,
    document.body,
  );
}
