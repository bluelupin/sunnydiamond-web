 "use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";


const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={isHome ? "flex-1" : "flex-1 pt-16 md:pt-20"}>
        {children}
      </main>
    <Footer />
    </div>
  );
};

export default Layout;
