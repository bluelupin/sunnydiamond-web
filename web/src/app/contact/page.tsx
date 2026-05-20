import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import ContactPageView from "@/features/cms/components/ContactPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.contact.title,
  description: seoContent.contact.description,
  canonicalPath: "/contact",
});

export default function Page() {
  return <ContactPageView />;
}
