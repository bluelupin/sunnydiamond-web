"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import SearchIcon from "@/assets/Icons/SearchIcon";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import { useCanHover } from "@/shared/hooks/use-can-hover";
import { useMobileHeaderLayout } from "@/shared/hooks/use-mobile-header-layout";
import { cn } from "@/shared/utils/cn";
import { MAX_SEARCH_LENGTH } from "./quickSearch";
import { SearchDesktopMegaMenu } from "./SearchDesktopMegaMenu";
import { HEADER_SEARCH_TRIGGER_ATTR, searchOverlayFigmaSpec } from "./searchOverlayFigmaSpec";
import { addRecentSearch } from "./recentSearches";
import {
  isSearchSuggestionsExpanded,
  SearchSuggestionsList,
  useSearchSuggestions,
  type SearchSuggestionOption,
} from "./searchSuggestions";

type SearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Header icon toggle — full dismiss (clears query + closes Radix). */
  onRegisterDismiss?: (dismiss: (() => void) | null) => void;
  /** WorldOfSunnyMegaMenu — keep panel open while pointer is over dropdown. */
  onDesktopMouseEnter?: () => void;
  onDesktopMouseLeave?: () => void;
};

export default function SearchOverlay({
  open,
  onOpenChange,
  onRegisterDismiss,
  onDesktopMouseEnter,
  onDesktopMouseLeave,
}: SearchOverlayProps) {
  const router = useRouter();
  const isMobileHeader = useMobileHeaderLayout();
  const canHoverNav = useCanHover();
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const [text, setText] = useState("");
  const returnFocus = useRef<HTMLElement | null>(null);
  const skipReturnFocusRef = useRef(false);

  const suggestions = useSearchSuggestions({ text, baseId, syncRecents: open });
  const {
    active,
    result,
    loading,
    failed,
    hasPrefixTypeahead,
    showEmptyState,
    showListbox,
    groups,
    activeIndex,
    setActiveIndex,
    activeOption,
    query,
    resetHighlight,
    refreshRecentSearches,
    handleInputKeyDown,
  } = suggestions;

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => {
      searchPanelRef.current?.querySelector("input")?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (open) return;
    const input = searchPanelRef.current?.querySelector("input");
    if (input instanceof HTMLElement && document.activeElement === input) {
      input.blur();
    }
    if (!skipReturnFocusRef.current) return;
    skipReturnFocusRef.current = false;
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && activeElement.getAttribute("aria-label") === "Search") {
      activeElement.blur();
    }
  }, [open]);

  const close = useCallback(() => {
    onOpenChange(false);
    setText("");
    resetHighlight();
  }, [onOpenChange, resetHighlight]);

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
    const useDocumentDismiss = open && (isMobileHeader || !canHoverNav);
    if (!useDocumentDismiss) return;

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
  }, [canHoverNav, close, isMobileHeader, open]);

  const go = (href: string, recentText: string, option?: SearchSuggestionOption) => {
    if (recentText) {
      addRecentSearch(recentText);
      refreshRecentSearches();
    }
    if (option) {
      trackEvent("select_item", {
        item_list_name: `search_${option.group}`,
        search_term: query,
        href,
      });
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

  const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitHighlightedOption();
  };

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
            onKeyDown={(event) => handleInputKeyDown(event, submitHighlightedOption)}
            tabIndex={open ? 0 : -1}
            placeholder={searchOverlayFigmaSpec.searchPlaceholder}
            role="combobox"
            aria-label="Search"
            aria-expanded={
              open &&
              isSearchSuggestionsExpanded({
                active,
                loading,
                failed,
                result,
                hasPrefixTypeahead,
                showEmptyState,
                showListbox,
              })
            }
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeOption?.id}
            autoComplete="off"
            enterKeyHint="search"
            className={searchOverlayFigmaSpec.searchInputClassName}
          />
        </form>

        <SearchSuggestionsList
          listId={listId}
          baseId={baseId}
          active={active}
          loading={loading}
          failed={failed}
          result={result}
          hasPrefixTypeahead={hasPrefixTypeahead}
          showEmptyState={showEmptyState}
          showListbox={showListbox}
          groups={groups}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onSelect={(option) => go(option.href, option.recent, option)}
          presentation="inline"
        />
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
