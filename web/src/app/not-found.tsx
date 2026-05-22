import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import NotFoundPageView from "@/features/cms/components/NotFoundPage";

export const metadata: Metadata = constructMetadata({
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  noIndex: true,
});

export default function NotFoundPage() {
  return <NotFoundPageView />;
}
