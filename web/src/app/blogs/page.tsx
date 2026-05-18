import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { blogs } from "@/data/blogs";
import BlogListingPage from "@/components/site-pages/BlogListingPage";

export const metadata: Metadata = constructMetadata({
  title: "Blogs",
  description: "Sunny Diamonds blog listing placeholder.",
});

export default function Page() {
  return <BlogListingPage posts={blogs} />;
}
