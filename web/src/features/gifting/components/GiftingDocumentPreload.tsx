import type { NormalizedGiftingPage } from "@/services/gifting/gifting-page.types";

type GiftingDocumentPreloadProps = {
  page: NormalizedGiftingPage;
};

/** Early LCP image discovery for mobile/desktop hero (no layout impact). */
const GiftingDocumentPreload = ({ page }: GiftingDocumentPreloadProps) => {
  const image = page.hero?.image;
  const mobileUrl = image?.mobileUrl?.trim();
  const desktopUrl = image?.desktopUrl?.trim();

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
      {desktopUrl && mobileUrl ? (
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

export default GiftingDocumentPreload;
