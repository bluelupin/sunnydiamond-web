import * as React from "react";

/** Matches header `md:landscape:hidden` — mobile bar on small screens and portrait tablet. */
export function useMobileHeaderLayout() {
  const [isMobileHeader, setIsMobileHeader] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (orientation: portrait)");
    const onChange = () => {
      setIsMobileHeader(mq.matches);
    };
    mq.addEventListener("change", onChange);
    onChange();
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobileHeader;
}
