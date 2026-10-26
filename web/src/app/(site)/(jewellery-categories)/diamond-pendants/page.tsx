import {
  generateJewelleryCategoryMetadata,
  JewelleryCategoryRoutePage,
} from "@/features/jewellery-product/pages/JewelleryCategoryRoutePage";

export const revalidate = 60;
const params = Promise.resolve({ categoryUrl: "diamond-pendants" });
const searchParams = Promise.resolve({});

export function generateMetadata() {
  return generateJewelleryCategoryMetadata({ params, searchParams });
}

export default function Page() {
  return JewelleryCategoryRoutePage({ params, searchParams });
}
