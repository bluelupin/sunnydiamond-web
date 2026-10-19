import type { ResolvedHeroContent } from "@/lib/homepage/resolveHomepageAboveFold";

type HomepageDocumentPreloadProps = {
  hero: ResolvedHeroContent | null;
};

/** Early LCP image discovery with viewport-specific URLs (no layout impact). */
const HomepageDocumentPreload = ({ hero }: HomepageDocumentPreloadProps) => {
  if (!hero) return null;

  const mobileUrl = (hero.mobileImageUrl || hero.desktopImageUrl)?.trim();
  const desktopUrl = hero.desktopImageUrl?.trim();

  if (!mobileUrl && !desktopUrl) return null;

  return (
    <>
      {mobileUrl ? (
        <link
          rel="preload"
          as="image"
          href={mobileUrl}
          fetchPriority="high"
          media="(max-width: 768px)"
        />
      ) : null}
      {desktopUrl && mobileUrl && desktopUrl !== mobileUrl ? (
        <link
          rel="preload"
          as="image"
          href={desktopUrl}
          fetchPriority="high"
          media="(min-width: 769px)"
        />
      ) : null}
      {desktopUrl && !mobileUrl ? (
        <link rel="preload" as="image" href={desktopUrl} fetchPriority="high" />
      ) : null}
    </>
  );
};

export default HomepageDocumentPreload;
