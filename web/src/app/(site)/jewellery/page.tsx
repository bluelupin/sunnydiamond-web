import {
  generateJewelleryListingMetadata,
  JewelleryListingRoutePage,
} from "@/features/jewellery-product/pages/JewelleryListingRoutePage";

export const revalidate = 60;

const searchParams = Promise.resolve({});

export function generateMetadata() {
  return generateJewelleryListingMetadata({ searchParams });
}

export default function Page() {
  return JewelleryListingRoutePage({ searchParams });
}
