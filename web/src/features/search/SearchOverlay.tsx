"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { History } from "lucide-react";
import SearchIcon from "@/assets/Icons/SearchIcon";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import { cn } from "@/shared/utils/cn";
import { MAX_SEARCH_LENGTH, searchResultsHref, type QuickSearchProduct, type SearchLink } from "./quickSearch";
import { searchOverlayFigmaSpec } from "./searchOverlayFigmaSpec";
import { addRecentSearch, clearRecentSearches, readRecentSearches } from "./recentSearches";
import { useQuickSearch, useSearchSuggestions } from "./useQuickSearch";

type Option = {
  id: string;
  href: string;
  /** What goes into recent searches when this option is picked. */
  recent: string;
  group: string;
  render: ReactNode;
};

type Group = { key: string; title: string; options: Option[]; action?: ReactNode };

type SearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const productRowClassName =
  "flex w-full items-center gap-3 py-1 text-left font-gill text-sm font-normal leading-110 text-darkblack";

const suggestionRowClassName = "flex w-full items-center gap-2 py-0 text-left";

function LinkRow({ link }: { link: SearchLink }) {
  if (link.detail) {
    return (
      <span className="flex min-w-0 flex-1 items-baseline gap-1">
        <span className="truncate font-normal text-darkblack">{link.label}</span>
        <span className="shrink-0 font-light text-neutral500">{link.detail}</span>
      </span>
    );
  }

  return <span className="min-w-0 flex-1 truncate font-light text-neutral500">{link.label}</span>;
}

function ProductRow({ product }: { product: QuickSearchProduct }) {
  return (
    <>
      <span className="relative size-14 shrink-0 overflow-hidden bg-gray300">
        {product.image ? <Image src={product.image} alt="" fill sizes="56px" className="object-cover" /> : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1 font-gill text-sm leading-110">
        <span className="truncate font-normal text-darkblack">{product.name}</span>
        <span className="font-normal text-darkblack">
          {product.fromPrice ? "From " : ""}₹ {formatJewelleryPrice(product.price)}
        </span>
      </span>
    </>
  );
}

export default function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const router = useRouter();
  const baseId = useId();
  const listId = `${baseId}-list`;
  const [text, setText] = useState("");
  const [highlight, setHighlight] = useState({ key: "", index: -1 });
  const [recent, setRecent] = useState<string[]>(readRecentSearches);
  const { query, active, result, loading, failed } = useQuickSearch(text);
  const { popular } = useSearchSuggestions(open);
  const lastTracked = useRef("");
  // Radix returns focus to a Dialog.Trigger; the header icons are plain buttons, so remember
  // what had focus when search opened and give it back on close.
  const returnFocus = useRef<HTMLElement | null>(null);

  // A new result set starts with nothing highlighted, so Enter goes to the results page.
  const listKey = active ? (result?.query ?? "") : "empty";
  const activeIndex = highlight.key === listKey ? highlight.index : -1;
  const setActiveIndex = (update: number | ((index: number) => number)) =>
    setHighlight({ key: listKey, index: typeof update === "function" ? update(activeIndex) : update });

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

  const groups = useMemo<Group[]>(() => {
    const linkOptions = (group: string, links: SearchLink[], recentFrom: (link: SearchLink) => string): Option[] =>
      links.map((link, index) => ({
        id: `${baseId}-${group}-${index}`,
        href: link.href,
        recent: recentFrom(link),
        group,
        render: <LinkRow link={link} />,
      }));

    if (!active) {
      return [
        {
          key: "recent",
          title: "Recent searches",
          options: linkOptions(
            "recent",
            recent.map((label) => ({ label, href: searchResultsHref(label) })),
            (link) => link.label,
          ),
          action: (
            <button
              type="button"
              className="font-gill text-sm uppercase leading-110 text-darkblack underline underline-offset-4"
              onClick={() => {
                clearRecentSearches();
                setRecent([]);
              }}
            >
              Clear
            </button>
          ),
        },
        { key: "popular", title: "Popular searches", options: linkOptions("popular", popular, (link) => link.label) },
      ];
    }
    if (!result) return [];
    if (!hasResults) {
      return [
        { key: "popular", title: "Popular searches", options: linkOptions("popular", popular.slice(0, 4), (link) => link.label) },
      ];
    }

    return [
      {
        key: "products",
        title: "Pieces",
        options: result.products.map((product, index) => ({
          id: `${baseId}-products-${index}`,
          href: product.href,
          recent: result.query,
          group: "products",
          render: <ProductRow product={product} />,
        })),
      },
      { key: "categories", title: "Categories and collections", options: linkOptions("categories", result.categories, () => result.query) },
      { key: "articles", title: "Learn", options: linkOptions("articles", result.articles, () => result.query) },
      { key: "services", title: "Services", options: linkOptions("services", result.services, () => result.query) },
    ];
  }, [active, result, hasResults, popular, recent, baseId]);

  const options = useMemo(() => groups.flatMap((group) => group.options), [groups]);
  const activeOption = activeIndex >= 0 ? options[activeIndex] : undefined;

  const close = () => {
    onOpenChange(false);
    setText("");
    // The overlay stays mounted between openings; a row highlighted last time must not
    // come back when the same words are typed again, or Enter would open it.
    setHighlight({ key: "", index: -1 });
  };

  const go = (href: string, recentText: string, option?: Option) => {
    if (recentText) {
      addRecentSearch(recentText);
      setRecent(readRecentSearches());
    }
    if (option) {
      trackEvent("select_item", { item_list_name: `search_${option.group}`, search_term: query, href });
    }
    close();
    router.push(href);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
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
      if (activeOption) {
        go(activeOption.href, activeOption.recent, activeOption);
      } else if (active) {
        go(searchResultsHref(query), query);
      }
    }
  };

  let optionIndex = -1;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-darkblack/40 motion-safe:animate-in motion-safe:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-x-0 z-[61] flex min-h-0 flex-col bg-white motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2",
            searchOverlayFigmaSpec.panelTopClassName,
            searchOverlayFigmaSpec.panelMaxHeightClassName,
          )}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            (event.currentTarget as HTMLElement).querySelector("input")?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (returnFocus.current?.isConnected) returnFocus.current.focus();
          }}
        >
          <DialogPrimitive.Title className="sr-only">Search Sunny Diamonds</DialogPrimitive.Title>

          {/* Figma 4903:69973 — 1040 column: 40px below header rule, then search + 24px gap + suggestions */}
          <div
            className={cn(
              searchOverlayFigmaSpec.contentTopPaddingClassName,
              searchOverlayFigmaSpec.sectionGapClassName,
              searchOverlayFigmaSpec.contentColumnClassName,
            )}
            style={{ maxWidth: searchOverlayFigmaSpec.contentMaxWidth }}
          >
            <div className={cn("w-full shrink-0", searchOverlayFigmaSpec.searchBarClassName)}>
              <SearchIcon className="size-6 shrink-0 text-darkblack" />
              <input
                type="search"
                value={text}
                maxLength={MAX_SEARCH_LENGTH}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search rings, earrings, collections…"
                role="combobox"
                aria-label="Search"
                aria-expanded={options.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={activeOption?.id}
                autoComplete="off"
                enterKeyHint="search"
                className={searchOverlayFigmaSpec.searchInputClassName}
              />
            </div>

            {active && !result && loading ? (
              <div className={cn("flex flex-col", searchOverlayFigmaSpec.suggestionGapClassName)} aria-hidden>
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex items-center gap-3">
                    <div className="size-14 animate-pulse bg-gray300" />
                    <div className="h-4 w-1/2 animate-pulse bg-gray300" />
                  </div>
                ))}
              </div>
            ) : null}

            {active && result && !hasResults ? (
              <p className="font-gill text-sm font-light leading-110 text-darkblack" role="status">
                No pieces match &ldquo;{result.query}&rdquo;.
              </p>
            ) : null}
            {active && failed && !result ? (
              <p className="font-gill text-sm font-light leading-110 text-darkblack" role="status">
                Search is not responding. Press Enter to see all results.
              </p>
            ) : null}

            <div id={listId} role="listbox" aria-label="Search suggestions" className={cn("w-full", loading && result && "opacity-70")}>
              {groups
                .filter((group) => group.options.length > 0)
                .map((group, groupIndex) => (
                  <div
                    key={group.key}
                    role="group"
                    aria-labelledby={`${baseId}-${group.key}-title`}
                    className={cn(
                      "flex flex-col",
                      searchOverlayFigmaSpec.suggestionGapClassName,
                      groupIndex > 0 && "mt-6",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        id={`${baseId}-${group.key}-title`}
                        className="font-gill text-sm font-light leading-110 text-neutral500"
                      >
                        {group.title}
                      </span>
                      {group.action}
                    </div>
                    {group.options.map((option) => {
                      optionIndex += 1;
                      const index = optionIndex;
                      const isProduct = option.group === "products";
                      return (
                        <div
                          key={option.id}
                          id={option.id}
                          role="option"
                          aria-selected={index === activeIndex}
                          className={cn(
                            isProduct ? productRowClassName : suggestionRowClassName,
                            "cursor-pointer rounded-sm font-gill text-sm leading-110 hover:bg-gray200",
                            index === activeIndex && "bg-gray200",
                          )}
                          onMouseEnter={() => setActiveIndex(index)}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => go(option.href, option.recent, option)}
                        >
                          {!isProduct ? (
                            group.key === "recent" ? (
                              <History className="size-6 shrink-0 text-darkblack" strokeWidth={1.25} aria-hidden />
                            ) : (
                              <SearchIcon className="size-6 shrink-0 text-darkblack" />
                            )
                          ) : null}
                          {option.render}
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>

            {active && query ? (
              <button
                type="button"
                className="self-start border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
                onClick={() => go(searchResultsHref(query), query)}
              >
                See all results for &ldquo;{query}&rdquo;
              </button>
            ) : null}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
