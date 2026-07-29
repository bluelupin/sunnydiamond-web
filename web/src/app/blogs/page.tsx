import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { footerPages } from "@/features/cms/data/footerPages";
import BlogsPage from "@/features/blogs/components/BlogsPage";

const page = footerPages.blogs;

export const metadata: Metadata = constructMetadata({
  title: page.title,
  description: page.description,
  canonicalPath: "/blogs",
});

export default function Page() {
  return <BlogsPage />;
}
