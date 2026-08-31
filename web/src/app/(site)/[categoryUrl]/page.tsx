import {
  generateJewelleryCategoryMetadata,
  JewelleryCategoryRoutePage,
} from "@/features/jewellery-product/pages/JewelleryCategoryRoutePage";

type PageProps = {
  params: Promise<{ categoryUrl: string }>;
  searchParams: Promise<{ occasion?: string; category?: string }>;
};

export async function generateMetadata(props: PageProps) {
  return generateJewelleryCategoryMetadata(props);
}

export default function Page(props: PageProps) {
  return JewelleryCategoryRoutePage(props);
}
