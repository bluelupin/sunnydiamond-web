import Link from "next/link";
import Layout from "@/shared/ui/layout/Layout";
import { PrimaryLink } from "@/shared/ui/PrimaryButton";
import type { BlogPost } from "@/features/cms/data/blogs";

interface BlogListingPageProps {
  posts: readonly BlogPost[];
}

const BlogListingPage = ({ posts }: BlogListingPageProps) => {
  return (
    <Layout>
      <section className="container py-14 md:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Blogs
            </p>
            <h1 className="mt-4 text-h1 text-foreground">Stories and updates</h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
              This route is ready for the blog UI and links through to each detail page.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-[1.5rem] border border-border/60 bg-card p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {post.date}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                <div className="mt-6">
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="inline-flex items-center text-sm font-semibold uppercase tracking-widest text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <PrimaryLink href="/">Back to Home</PrimaryLink>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogListingPage;
