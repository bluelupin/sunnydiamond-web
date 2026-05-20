import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { blogs } from "@/features/cms/data/blogs";
import BlogListingPage from "@/features/cms/components/BlogListingPage";

export const metadata: Metadata = constructMetadata({
  title: "Blogs",
  description: "Sunny Diamonds blog listing placeholder.",
});

export default function Page() {
  return <BlogListingPage posts={blogs} />;
}
