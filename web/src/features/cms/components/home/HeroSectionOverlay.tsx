/**
 * Figma 684:2808 — stacked linear gradients over homepage hero media.
 * @see homeHeroFigmaSpec for documented stop values
 */
const HeroSectionOverlay = () => (
  <>
    {/* Horizontal scrim — left depth for header contrast */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/15 to-transparent"
    />
    {/* Mobile — bottom-half linear fade for centered copy */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/40 to-transparent md:hidden"
    />
    {/* Desktop — bottom linear fade (Figma stop at 53.563%) */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-[rgba(0,0,0,0.7)] from-0% to-[rgba(0,0,0,0)] to-[53.563%] md:block"
    />
  </>
);

export default HeroSectionOverlay;
