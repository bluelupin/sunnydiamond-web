import type { Metadata } from "next";
import NotFoundPageView from "@/features/cms/components/NotFoundPage";
import { notFoundContent } from "@/features/cms/data/notFoundContent";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import Layout from "@/shared/ui/layout/Layout";

export const metadata: Metadata = constructMetadata({
  title: notFoundContent.title,
  description: `${notFoundContent.descriptionLine1} ${notFoundContent.descriptionLine2}`,
  noIndex: true,
});

export default function NotFoundPage() {
  return (
    <Layout notFoundShell>
      <NotFoundPageView />
    </Layout>
  );
}
