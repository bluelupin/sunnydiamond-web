import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import CareersPage from "@/features/careers/components/CareersPage";

const fallback = footerPages.careers;

export const metadata: Metadata = constructMetadata({
  title: fallback.title,
  description: fallback.description,
  canonicalPath: "/careers",
});

export default function Page() {
  return <CareersPage />;
}
