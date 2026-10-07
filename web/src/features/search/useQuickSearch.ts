"use client";

import { useEffect, useState } from "react";
import {
  cleanSearchQuery,
  MIN_SEARCH_LENGTH,
  type QuickSearchResult,
  type SearchSuggestions,
} from "./quickSearch";

const DEBOUNCE_MS = 250;

/** Results for what the shopper typed: 250 ms debounce, stale requests aborted, last results kept while loading. */
export function useQuickSearch(rawQuery: string) {
  const query = cleanSearchQuery(rawQuery);
  const active = query.length >= MIN_SEARCH_LENGTH;
  const [settled, setSettled] = useState<{ query: string; result: QuickSearchResult | null; failed: boolean }>({
    query: "",
    result: null,
    failed: false,
  });

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/quick?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!response.ok) throw new Error(String(response.status));
        const result = (await response.json()) as QuickSearchResult;
        setSettled({ query, result, failed: false });
      } catch {
        if (!controller.signal.aborted) setSettled((previous) => ({ ...previous, query, failed: true }));
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, active]);

  const failed = active && settled.query === query && settled.failed;
  return {
    query,
    active,
    // Earlier results stay visible (dimmed) only while the new lookup is in flight. Once it
    // fails they would be answers to different words, so they are dropped.
    result: active && !failed ? settled.result : null,
    loading: active && settled.query !== query,
    failed,
  };
}

/** Popular terms for typeahead; fetched once per page load when the overlay first opens. */
let suggestionsPromise: Promise<SearchSuggestions> | null = null;

export function useSearchSuggestions(enabled: boolean) {
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({ popular: [] });

  useEffect(() => {
    if (!enabled) return;
    suggestionsPromise ??= fetch("/api/search/quick")
      .then((response) => (response.ok ? (response.json() as Promise<SearchSuggestions>) : { popular: [] }))
      .catch(() => {
        suggestionsPromise = null;
        return { popular: [] };
      });
    let current = true;
    void suggestionsPromise.then((value) => current && setSuggestions(value));
    return () => {
      current = false;
    };
  }, [enabled]);

  return suggestions;
}
