import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import DiamondsForEveryonePage from "@/features/diamonds-for-everyone/components/DiamondsForEveryonePage";
import { diamondsForEveryonePageContent } from "@/features/diamonds-for-everyone/data/content";

export const metadata: Metadata = constructMetadata({
  title: diamondsForEveryonePageContent.hero.title,
  description:
    "Start your Diamonds for Everyone savings plan from ₹1,000 a month. Enjoy the 11+1 plan and redeem your savings for fine jewellery at Sunny Diamonds.",
  canonicalPath: "/diamonds-for-everyone",
});

export default function Page() {
  return <DiamondsForEveryonePage />;
}
