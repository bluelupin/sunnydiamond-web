"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type PageLoadingContextValue = {
  isPageLoading: boolean;
  beginPageLoading: () => void;
  endPageLoading: () => void;
};

const PageLoadingContext = createContext<PageLoadingContextValue | null>(null);

export function PageLoadingProvider({ children }: { children: ReactNode }) {
  const loadingCountRef = useRef(1);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const sync = useCallback(() => {
    setIsPageLoading(loadingCountRef.current > 0);
  }, []);

  const beginPageLoading = useCallback(() => {
    loadingCountRef.current += 1;
    sync();
  }, [sync]);

  const endPageLoading = useCallback(() => {
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    sync();
  }, [sync]);

  useEffect(() => {
    endPageLoading();
  }, [endPageLoading]);

  const value = useMemo(
    () => ({ isPageLoading, beginPageLoading, endPageLoading }),
    [isPageLoading, beginPageLoading, endPageLoading],
  );

  return <PageLoadingContext.Provider value={value}>{children}</PageLoadingContext.Provider>;
}

export function usePageLoading(): PageLoadingContextValue {
  const context = useContext(PageLoadingContext);
  if (!context) {
    throw new Error("usePageLoading must be used within PageLoadingProvider");
  }
  return context;
}
