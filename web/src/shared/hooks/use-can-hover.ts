import { useLayoutEffect, useState } from "react";

const CAN_HOVER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

/** True when the primary input supports hover (e.g. mouse), false on touch-first tablets. */
export function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia(CAN_HOVER_MEDIA_QUERY);
    const onChange = () => setCanHover(media.matches);

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return canHover;
}
