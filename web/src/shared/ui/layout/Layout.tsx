"use client";

import { ReactNode, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BrowserBackScrollRestore from "@/shared/lib/providers/BrowserBackScrollRestore";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { clearTransientErrorAutoRetry } from "@/shared/hooks/useTransientErrorAutoRetry";
import { useIsCartEmptyPageShell } from "@/features/cart/hooks/useIsCartEmptyPageShell";
import { isAuthRoute, isCartOrCheckoutRoute, shouldHideFooter, shouldHideFooterOnMobile, shouldOffsetMainForHeader } from "@/shared/utils/navigation";
import PwaInstallBanner from "@/shared/pwa/PwaInstallBanner";
import {
  NotFoundPageShellProvider,
  useNotFoundPageShell,
} from "@/features/cms/context/NotFoundPageShellContext";

type LayoutProps = {
  children: ReactNode;
  /** Figma 7332:67685 — chalk header/content on global 404 only. */
  notFoundShell?: boolean;
};

const LayoutInner = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? "/";
  const isNotFoundPageShell = useNotFoundPageShell();
  const offsetMain = shouldOffsetMainForHeader(pathname);
  const hideFooter = shouldHideFooter(pathname);
  const hideFooterOnMobile = shouldHideFooterOnMobile(pathname);
  const isAuthPage = isAuthRoute(pathname);
  const isCartCheckoutPage = isCartOrCheckoutRoute(pathname);
  const isCartEmptyPageShell = useIsCartEmptyPageShell();

  useEffect(() => {
    clearTransientErrorAutoRetry(pathname);
  }, [pathname]);

  return (
    <div
      className={cn(
        "flex flex-col",
        isAuthPage
          ? "relative isolate z-10 h-[100dvh] max-h-[100dvh] min-h-[100lvh] overflow-hidden"
          : "min-h-screen overflow-x-clip",
      )}
    >
      <BrowserBackScrollRestore />
      <Header />
      <main
        className={
          isAuthPage
            ? "relative flex min-h-0 flex-1 flex-col overflow-hidden"
            : offsetMain
              ? cn(
                  "flex-1 pt-[calc(64px+env(safe-area-inset-top,0px))] md:landscape:pt-104 lg:landscape:pt-104",
                  isNotFoundPageShell && "bg-gray200 max-md:bg-gray200",
                  isCartCheckoutPage &&
                    (isCartEmptyPageShell
                      ? "bg-gray200 max-md:bg-gray200"
                      : "bg-gray300 max-md:bg-gray300"),
                )
              : "flex-1 min-h-screen"
        }
      >
        {children}
      </main>
      {hideFooter ? null : <Footer className={hideFooterOnMobile ? "max-md:hidden" : undefined} />}
      {/* <PwaInstallBanner /> */}
    </div>
  );
};

const Layout = ({ children, notFoundShell = false }: LayoutProps) => (
  <NotFoundPageShellProvider active={notFoundShell}>
    <LayoutInner>{children}</LayoutInner>
  </NotFoundPageShellProvider>
);

export default Layout;
