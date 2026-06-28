/**
 * Responsive breakpoint conventions (standard Tailwind `screens`):
 *
 * - Default / `max-md:` — phone only (<768px), mobile Figma layouts
 * - `md:` (768px+) — tablet + desktop layout (desktop behavior, scaled)
 * - `lg:` (1024px+) — full desktop sizing refinements only
 *
 * Visibility pairs:
 * - Mobile-only block: `md:hidden`
 * - Tablet + desktop block: `hidden md:flex` | `hidden md:block` | `hidden md:grid`
 *
 * Do not use `max-lg:` or `lg:hidden` for mobile vs desktop layout splits.
 */
export const MOBILE_MAX_WIDTH_PX = 767;
export const TABLET_MIN_WIDTH_PX = 768;
export const DESKTOP_MIN_WIDTH_PX = 1024;

export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_MAX_WIDTH_PX}px)`;
export const TABLET_UP_MEDIA_QUERY = `(min-width: ${TABLET_MIN_WIDTH_PX}px)`;
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH_PX}px)`;
