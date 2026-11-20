/** Early WOFF2 fetch so Larken / Gill Sans paint before first content (404 cold loads). */
export function BrandFontPreloads() {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/Larken/Larken-Light.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/GillSans/Gill%20Sans%20Light.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  );
}