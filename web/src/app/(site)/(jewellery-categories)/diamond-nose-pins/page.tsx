import {
  generateJewelleryCategoryMetadata,
  JewelleryCategoryRoutePage,
  type JewelleryCategoryRoutePageProps,
} from "@/features/jewellery-product/pages/JewelleryCategoryRoutePage";

type PageProps = Pick<JewelleryCategoryRoutePageProps, "searchParams">;
const params = Promise.resolve({ categoryUrl: "diamond-nose-pins" });

export function generateMetadata({ searchParams }: PageProps) {
  return generateJewelleryCategoryMetadata({ params, searchParams });
}

export default function Page({ searchParams }: PageProps) {
  return JewelleryCategoryRoutePage({ params, searchParams });
}
