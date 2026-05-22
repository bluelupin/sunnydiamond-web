import Layout from "@/shared/ui/layout/Layout";
import { PrimaryLink } from "@/shared/ui/PrimaryButton";
import type { BlogPost } from "@/features/cms/data/blogs";

interface BlogDetailPageProps {
  post: BlogPost;
}

const BlogDetailPage = ({ post }: BlogDetailPageProps) => {
  return (
    <Layout>
      <article className="container py-14 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Blog Detail
          </p>
          <h1 className="mt-4 text-h1 text-foreground">{post.title}</h1>
          <p className="mt-4 text-sm uppercase tracking-widest text-muted-foreground">
            {post.date}
          </p>
          <div className="mt-8 space-y-6 text-base leading-8 text-foreground/80">
            <p>
              This is the placeholder detail page for the Sunny Diamonds blog route.
            </p>
            <p>
              The final editorial layout, imagery, and rich article UI can be added here later without changing the route structure.
            </p>
          </div>
          <div className="mt-10">
            <PrimaryLink href="/blogs">Back to Blogs</PrimaryLink>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogDetailPage;
