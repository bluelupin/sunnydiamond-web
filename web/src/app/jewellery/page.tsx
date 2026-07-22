import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { resolveJewellerySeoMetadata } from "@/shared/lib/seo/jewellerySeo";
import { getProductLandingPage } from "@/services/product-landing/product-landing-page.service";
import JewelleryProductPage from "@/features/jewellery-product/components/JewelleryProductPage";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getProductLandingPage();
  const { title, description, canonicalPath, keywords, image } =
    resolveJewellerySeoMetadata(page);

  return constructMetadata({
    title,
    description,
    canonicalPath,
    keywords,
    ...(image ? { image } : {}),
  });
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <JewelleryProductPage />
    </Suspense>
  );
}
