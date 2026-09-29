"use client";

import { useEffect } from "react";
import type { HeaderVariant } from "@/shared/utils/navigation";
import { resolveMobileThemeColor } from "@/shared/utils/themeColor";

type MobileThemeColorProps = {
  pathname: string;
  headerVariant: HeaderVariant;
  isCartEmptyPageShell?: boolean;
};

function setMetaContent(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

const MobileThemeColor = ({
  pathname,
  headerVariant,
  isCartEmptyPageShell = false,
}: MobileThemeColorProps) => {
  useEffect(() => {
    setMetaContent(
      "theme-color",
      resolveMobileThemeColor(pathname, headerVariant, { isCartEmptyPageShell }),
    );
  }, [pathname, headerVariant, isCartEmptyPageShell]);

  return null;
};

export default MobileThemeColor;
