"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { History } from "lucide-react";
import SearchIcon from "@/assets/Icons/SearchIcon";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import {
  searchResultsHref,
  searchTermMatchesInput,
  splitLabelBySearchQuery,
  type QuickSearchProduct,
  type SearchLink,
} from "./quickSearch";
import { searchOverlayFigmaSpec } from "./searchOverlayFigmaSpec";
import { readRecentSearches } from "./recentSearches";
import { useQuickSearch } from "./useQuickSearch";

export type SearchSuggestionOption = {
  id: string;
  href: string;
  recent: string;
  group: string;
  render: ReactNode;
};

export type SearchSuggestionGroup = {
  key: string;
  title: string;
  options: SearchSuggestionOption[];
  action?: ReactNode;
  flat?: boolean;
};

const suggestionRowClassName =
  "flex w-full items-center gap-2 py-0 text-left normal-case";

/** Portaled overlay — above mobile nav (75) and login drawer (80). */
export const SEARCH_SUGGESTIONS_LISTBOX_SELECTOR = "[data-search-suggestions-listbox]";

const SUGGESTIONS_OVERLAY_Z_CLASS = "z-[100]";
const SUGGESTIONS_LIST_GAP_PX = 8;
const SUGGESTIONS_VIEWPORT_PADDING_PX = 8;
const SUGGESTIONS_OVERLAY_MAX_HEIGHT_PX = 360;

type SuggestionsOverlayLayout = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

function computeSuggestionsOverlayLayout(anchor: HTMLElement): SuggestionsOverlayLayout {
  const rect = anchor.getBoundingClientRect();
  const spaceBelow =
    window.innerHeight - rect.bottom - SUGGESTIONS_VIEWPORT_PADDING_PX - SUGGESTIONS_LIST_GAP_PX;
  const maxHeight = Math.min(
    SUGGESTIONS_OVERLAY_MAX_HEIGHT_PX,
    Math.max(spaceBelow, 112),
  );

  return {
    top: rect.bottom + SUGGESTIONS_LIST_GAP_PX,
    left: rect.left,
    width: rect.width,
    maxHeight,
  };
}

function isSearchSuggestionsSurfaceVisible(props: {
  active: boolean;
  loading: boolean;
  failed: boolean;
  result: ReturnType<typeof useQuickSearch>["result"];
  hasPrefixTypeahead: boolean;
  showEmptyState: boolean;
  showListbox: boolean;
}) {
  return (
    props.showListbox ||
    props.showEmptyState ||
    (props.active && !props.result && props.loading && !props.hasPrefixTypeahead) ||
    (props.active && props.failed && !props.result)
  );
}

function SearchSuggestionHighlightText({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  const segments = useMemo(() => splitLabelBySearchQuery(text, query), [text, query]);

  return (
    <span className={cn("min-w-0 flex-1 truncate text-neutral500", className)}>
      {segments.map((segment, index) => (
        <span
          key={`${index}-${segment.text}`}
          className={segment.match ? "font-semibold text-darkblack" : "font-light"}
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
}

function TypeaheadLabel({ label, query }: { label: string; query: string }) {
  return <SearchSuggestionHighlightText text={label} query={query} />;
}

function ProductRow({ product, query }: { product: QuickSearchProduct; query: string }) {
  return (
    <SearchSuggestionHighlightText
      text={product.name}
      query={query}
      className={productNameDisplayClassName}
    />
  );
}

function LinkRow({ link, query }: { link: SearchLink; query: string }) {
  return <SearchSuggestionHighlightText text={link.label} query={query} />;
}

type UseSearchSuggestionsOptions = {
  text: string;
  baseId: string;
  /** When true, recent searches are refreshed (e.g. overlay/menu opened). */
  syncRecents?: boolean;
};

export function useSearchSuggestions({ text, baseId, syncRecents = true }: UseSearchSuggestionsOptions) {
  const [recent, setRecent] = useState(() => readRecentSearches());
  const [highlight, setHighlight] = useState({ key: "", index: -1 });
  const { query, active, result, loading, failed } = useQuickSearch(text);
  const lastTracked = useRef("");

  useEffect(() => {
    if (!syncRecents) return;
    setRecent(readRecentSearches());
  }, [syncRecents]);

  const listKey = active ? (result?.query ?? "") : "empty";
  const activeIndex = highlight.key === listKey ? highlight.index : -1;
  const setActiveIndex = (update: number | ((index: number) => number)) =>
    setHighlight({
      key: listKey,
      index: typeof update === "function" ? update(activeIndex) : update,
    });

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
    (result.products.length ||
      result.categories.length ||
      result.articles.length ||
      result.services.length),
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

  const groups = useMemo<SearchSuggestionGroup[]>(() => {
    const linkOptions = (
      group: string,
      links: SearchLink[],
      recentFrom: (link: SearchLink) => string,
      render: (link: SearchLink) => ReactNode = (link) => <LinkRow link={link} query={query} />,
    ): SearchSuggestionOption[] =>
      links.map((link, index) => ({
        id: `${baseId}-${group}-${index}`,
        href: link.href,
        recent: recentFrom(link),
        group,
        render: render(link),
      }));

    const flatTypingOptions = (): SearchSuggestionGroup[] => {
      const options: SearchSuggestionOption[] = [
        ...linkOptions("recent", prefixTypeahead.recent, (link) => link.label, (link) => (
          <TypeaheadLabel label={link.label} query={query} />
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
            render: <ProductRow product={product} query={query} />,
          })),
          ...linkOptions("articles", result.articles, () => result.query),
          ...linkOptions("services", result.services, () => result.query),
        );
      }
      if (options.length === 0) return [];
      return [{ key: "typing", title: "", options, flat: true }];
    };

    if (!active) {
      const options: SearchSuggestionOption[] = linkOptions(
        "recent",
        recent.map((label) => ({ label, href: searchResultsHref(label) })),
        (link) => link.label,
        (link) => <TypeaheadLabel label={link.label} query={query} />,
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

    return flatTypingOptions();
  }, [active, query, result, recent, baseId, prefixTypeahead]);

  const showListbox = !showEmptyState && groups.some((group) => group.options.length > 0);

  const options = useMemo(() => groups.flatMap((group) => group.options), [groups]);
  const activeOption = activeIndex >= 0 ? options[activeIndex] : undefined;

  const resetHighlight = useCallback(() => setHighlight({ key: "", index: -1 }), []);

  const refreshRecentSearches = useCallback(() => setRecent(readRecentSearches()), []);

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    onSubmitHighlighted: () => void,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!options.length) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const slots = options.length + 1;
      setActiveIndex((index) => ((index + 1 + step + slots) % slots) - 1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      onSubmitHighlighted();
    }
  };

  return {
    query,
    active,
    result,
    loading,
    failed,
    hasPrefixTypeahead,
    showEmptyState,
    showListbox,
    groups,
    options,
    activeIndex,
    setActiveIndex,
    activeOption,
    resetHighlight,
    refreshRecentSearches,
    handleInputKeyDown,
  };
}

type SearchSuggestionsListProps = {
  listId: string;
  baseId: string;
  active: boolean;
  loading: boolean;
  failed: boolean;
  result: ReturnType<typeof useQuickSearch>["result"];
  hasPrefixTypeahead: boolean;
  showEmptyState: boolean;
  showListbox: boolean;
  groups: SearchSuggestionGroup[];
  activeIndex: number;
  setActiveIndex: (update: number | ((index: number) => number)) => void;
  onSelect: (option: SearchSuggestionOption) => void;
  className?: string;
  /** Inline under the field (desktop mega menu) or portaled overlay anchored to the search bar. */
  presentation?: "inline" | "overlay";
  anchorRef?: RefObject<HTMLElement | null>;
  /** When false, suppress portaled overlay (e.g. mobile nav enter animation). Default true. */
  overlayAnchorActive?: boolean;
};

export function SearchSuggestionsList({
  listId,
  baseId,
  active,
  loading,
  failed,
  result,
  hasPrefixTypeahead,
  showEmptyState,
  showListbox,
  groups,
  activeIndex,
  setActiveIndex,
  onSelect,
  className,
  presentation = "inline",
  anchorRef,
  overlayAnchorActive = true,
}: SearchSuggestionsListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [overlayLayout, setOverlayLayout] = useState<SuggestionsOverlayLayout | null>(null);
  const isOverlay = presentation === "overlay";
  const overlayReady = !isOverlay || overlayAnchorActive;
  const surfaceVisible =
    overlayReady &&
    isSearchSuggestionsSurfaceVisible({
      active,
      loading,
      failed,
      result,
      hasPrefixTypeahead,
      showEmptyState,
      showListbox,
    });

  const updateOverlayLayout = useCallback(() => {
    const anchor = anchorRef?.current;
    if (!anchor) {
      return false;
    }

    setOverlayLayout(computeSuggestionsOverlayLayout(anchor));
    return true;
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!isOverlay || !surfaceVisible) {
      setOverlayLayout(null);
      return;
    }

    if (updateOverlayLayout()) {
      return;
    }

    let innerFrame = 0;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        updateOverlayLayout();
      });
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      if (innerFrame) {
        cancelAnimationFrame(innerFrame);
      }
    };
  }, [
    isOverlay,
    surfaceVisible,
    overlayAnchorActive,
    updateOverlayLayout,
    showListbox,
    showEmptyState,
    groups.length,
  ]);

  useEffect(() => {
    if (!isOverlay || !surfaceVisible) {
      return;
    }

    const handleLayoutChange = () => {
      updateOverlayLayout();
    };

    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);

    return () => {
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [isOverlay, surfaceVisible, updateOverlayLayout]);

  let optionIndex = -1;

  const content = (
    <div
      className={cn(
        "flex w-full flex-col",
        searchOverlayFigmaSpec.sectionGapClassName,
        isOverlay && "min-h-0 overflow-y-auto overscroll-contain px-0 py-3 max-h-[300px]",
        !isOverlay && className,
      )}
    >
      {active && !result && loading && !hasPrefixTypeahead ? (
        <div className={cn("flex flex-col", searchOverlayFigmaSpec.suggestionGapClassName)} aria-hidden>
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-2 p-3 md:p-4">
              <div className="size-6 shrink-0 animate-pulse rounded-sm bg-gray300" />
              <div className="h-4 w-1/2 animate-pulse bg-gray300" />
            </div>
          ))}
        </div>
      ) : null}

      {showEmptyState ? (
        <p className={cn(searchOverlayFigmaSpec.emptyStateClassName, "p-3 md:p-4")} role="status">
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
          ref={listRef}
          data-search-suggestions-listbox=""
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
                aria-labelledby={group.flat || !group.title ? undefined : `${baseId}-${group.key}-title`}
                className={cn("flex flex-col", !group.flat && groupIndex > 0 && "mt-6")}
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
                        "cursor-pointer rounded-sm font-gill text-sm leading-110 hover:bg-gray200 p-3 md:p-4",
                        index === activeIndex && "bg-gray200",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onSelect(option)}
                    >
                      {isRecentRow ? (
                        <History className="size-6 shrink-0 text-neutral500" strokeWidth={1.25} aria-hidden />
                      ) : (
                        <SearchIcon
                          className={searchOverlayFigmaSpec.suggestionSearchIconClassName}
                          aria-hidden
                        />
                      )}
                      {option.render}
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );

  if (!surfaceVisible) {
    return null;
  }

  if (!isOverlay) {
    return content;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const anchorElement = anchorRef?.current;
  const resolvedOverlayLayout =
    overlayLayout ??
    (anchorElement && surfaceVisible ? computeSuggestionsOverlayLayout(anchorElement) : null);

  if (!resolvedOverlayLayout) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        SUGGESTIONS_OVERLAY_Z_CLASS,
        "fixed flex flex-col overflow-hidden bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
        className,
      )}
      style={{
        top: resolvedOverlayLayout.top,
        left: resolvedOverlayLayout.left,
        width: resolvedOverlayLayout.width,
        maxHeight: resolvedOverlayLayout.maxHeight,
      }}
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
    >
      {content}
    </div>,
    document.body,
  );
}

export function isSearchSuggestionsExpanded(props: {
  active: boolean;
  loading: boolean;
  failed: boolean;
  result: ReturnType<typeof useQuickSearch>["result"];
  hasPrefixTypeahead: boolean;
  showEmptyState: boolean;
  showListbox: boolean;
}) {
  return isSearchSuggestionsSurfaceVisible(props);
}
