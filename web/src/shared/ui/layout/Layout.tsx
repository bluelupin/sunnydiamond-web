"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BrowserBackScrollRestore from "@/shared/lib/providers/BrowserBackScrollRestore";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { isAuthRoute, isCartOrCheckoutRoute, shouldHideFooter, shouldHideFooterOnMobile, shouldOffsetMainForHeader } from "@/shared/utils/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? "/";
  const offsetMain = shouldOffsetMainForHeader(pathname);
  const hideFooter = shouldHideFooter(pathname);
  const hideFooterOnMobile = shouldHideFooterOnMobile(pathname);
  const isAuthPage = isAuthRoute(pathname);
  const isCartCheckoutPage = isCartOrCheckoutRoute(pathname);

  return (
    <div className={cn("flex flex-col", isAuthPage ? "h-[100dvh] overflow-hidden" : "min-h-screen")}>
      <BrowserBackScrollRestore />
      <Header />
      <main
        className={
          isAuthPage
            ? "relative flex-1 min-h-0 overflow-y-auto"
            : offsetMain
              ? cn(
                  "flex-1 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] md:landscape:pt-104 lg:landscape:pt-104",
                  isCartCheckoutPage && "max-md:bg-gray300",
                )
              : "flex-1"
        }
      >
        {children}
      </main>
      {hideFooter ? null : <Footer className={hideFooterOnMobile ? "max-md:hidden" : undefined} />}
    </div>
  );
};

export default Layout;
