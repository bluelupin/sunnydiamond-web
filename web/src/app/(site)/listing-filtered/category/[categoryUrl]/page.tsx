import {
  generateJewelleryCategoryMetadata,
  JewelleryCategoryRoutePage,
  type JewelleryCategoryRoutePageProps,
} from "@/features/jewellery-product/pages/JewelleryCategoryRoutePage";

export function generateMetadata(props: JewelleryCategoryRoutePageProps) {
  return generateJewelleryCategoryMetadata(props);
}

export default function Page(props: JewelleryCategoryRoutePageProps) {
  return JewelleryCategoryRoutePage(props);
}
