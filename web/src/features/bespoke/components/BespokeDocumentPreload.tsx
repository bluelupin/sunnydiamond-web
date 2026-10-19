import type { NormalizedContactBespokePage } from "@/services/bespoke/contact-bespoke-page.types";

type BespokeDocumentPreloadProps = {
  page: NormalizedContactBespokePage;
};

/** Early LCP image discovery for mobile/desktop hero (no layout impact). */
const BespokeDocumentPreload = ({ page }: BespokeDocumentPreloadProps) => {
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

export default BespokeDocumentPreload;
