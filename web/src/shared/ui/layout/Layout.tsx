"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { getHeaderVariant, shouldOffsetMainForHeader } from "@/shared/utils/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? "/";
  const offsetMain = shouldOffsetMainForHeader(pathname);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={offsetMain ? "flex-1 pt-16 md:pt-104 lg:pt-[110px]" : "flex-1"}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
