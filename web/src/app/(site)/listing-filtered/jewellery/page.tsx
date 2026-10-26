import {
  generateJewelleryListingMetadata,
  JewelleryListingRoutePage,
  type JewelleryListingSearchParams,
} from "@/features/jewellery-product/pages/JewelleryListingRoutePage";

type PageProps = { searchParams: Promise<JewelleryListingSearchParams> };

export function generateMetadata({ searchParams }: PageProps) {
  return generateJewelleryListingMetadata({ searchParams });
}

export default function Page({ searchParams }: PageProps) {
  return JewelleryListingRoutePage({ searchParams });
}
