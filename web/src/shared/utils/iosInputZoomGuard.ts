/**
 * iOS Safari zooms focused inputs when computed font-size is below 16px.
 * Use 16px on touch-first devices; keep 14px Figma sizing for mouse/desktop.
 */
export const iosInputZoomGuardTextClassName =
  "text-base placeholder:text-base [@media(hover:hover)_and_(pointer:fine)]:text-[14px] [@media(hover:hover)_and_(pointer:fine)]:placeholder:text-[14px]";
