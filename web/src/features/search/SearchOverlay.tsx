"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import SearchIcon from "@/assets/Icons/SearchIcon";
import { formatJewelleryPrice } from "@/features/jewellery-product/utils/formatPrice";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import { cn } from "@/shared/utils/cn";
import { MAX_SEARCH_LENGTH, searchResultsHref, type QuickSearchProduct, type SearchLink } from "./quickSearch";
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

const rowClassName = "flex w-full items-center gap-3 px-4 py-3 text-left font-gill text-base font-light leading-110 text-darkblack md:px-6";

function LinkRow({ link }: { link: SearchLink }) {
  return (
    <span className="flex min-w-0 flex-1 items-baseline gap-2">
      <span className="truncate">{link.label}</span>
      {link.detail ? <span className="shrink-0 text-sm text-gray600">{link.detail}</span> : null}
    </span>
  );
}

function ProductRow({ product }: { product: QuickSearchProduct }) {
  return (
    <>
      <span className="relative size-14 shrink-0 overflow-hidden bg-gray300">
        {product.image ? <Image src={product.image} alt="" fill sizes="56px" className="object-cover" /> : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate">{product.name}</span>
        <span className="text-sm font-semibold">
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
      } else if (query) {
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
          className="fixed inset-0 z-[61] flex flex-col bg-white md:inset-x-0 md:bottom-auto md:max-h-[85vh]"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            (event.currentTarget as HTMLElement).querySelector("input")?.focus();
          }}
        >
          <DialogPrimitive.Title className="sr-only">Search Sunny Diamonds</DialogPrimitive.Title>
          <div className="mx-auto flex w-full max-w-1440 items-center gap-3 border-b border-neutral300 px-4 py-4 md:px-10 md:py-6">
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
              className="min-w-0 flex-1 bg-transparent font-gill text-lg font-normal leading-110 text-darkblack placeholder:font-light placeholder:text-gray600 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <DialogPrimitive.Close className="shrink-0 p-1 text-darkblack" aria-label="Close search">
              <X className="size-6" />
            </DialogPrimitive.Close>
          </div>

          <div className="mx-auto w-full max-w-1440 flex-1 overflow-y-auto pb-6 md:px-4">
            {active && !result && loading ? (
              <div className="flex flex-col gap-3 px-4 py-4 md:px-6" aria-hidden>
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex items-center gap-3">
                    <div className="size-14 animate-pulse bg-gray300" />
                    <div className="h-4 w-1/2 animate-pulse bg-gray300" />
                  </div>
                ))}
              </div>
            ) : null}

            {active && result && !hasResults ? (
              <p className="px-4 pt-6 font-gill text-base font-light leading-110 text-darkblack md:px-6" role="status">
                No pieces match &ldquo;{result.query}&rdquo;.
              </p>
            ) : null}
            {active && failed && !result ? (
              <p className="px-4 pt-6 font-gill text-base font-light text-darkblack md:px-6" role="status">
                Search is not responding. Press Enter to see all results.
              </p>
            ) : null}

            <div id={listId} role="listbox" aria-label="Search suggestions" className={cn(loading && result && "opacity-70")}>
              {groups.map((group) =>
                group.options.length ? (
                  <div key={group.key} role="group" aria-labelledby={`${baseId}-${group.key}-title`} className="pt-4">
                    <div className="flex items-center justify-between px-4 pb-2 md:px-6">
                      <span id={`${baseId}-${group.key}-title`} className="font-gill text-sm uppercase leading-110 text-gray600">
                        {group.title}
                      </span>
                      {group.action}
                    </div>
                    {group.options.map((option) => {
                      optionIndex += 1;
                      const index = optionIndex;
                      return (
                        <div
                          key={option.id}
                          id={option.id}
                          role="option"
                          aria-selected={index === activeIndex}
                          className={cn(rowClassName, "cursor-pointer hover:bg-gray200", index === activeIndex && "bg-gray300")}
                          onMouseEnter={() => setActiveIndex(index)}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => go(option.href, option.recent, option)}
                        >
                          {option.render}
                        </div>
                      );
                    })}
                  </div>
                ) : null,
              )}
            </div>

            {active && query ? (
              <button
                type="button"
                className="mx-4 mt-6 border-b-[1.5px] border-darkblack pb-1 font-gill text-sm uppercase leading-110 text-darkblack md:mx-6"
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
