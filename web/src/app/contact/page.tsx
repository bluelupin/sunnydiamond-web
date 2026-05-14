import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { seoContent } from "@/data/content";
import ContactPageView from "@/components/site-pages/ContactPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.contact.title,
  description: seoContent.contact.description,
});

export default function Page() {
  return <ContactPageView />;
}
