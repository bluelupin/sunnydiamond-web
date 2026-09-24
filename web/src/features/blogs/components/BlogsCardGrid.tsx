import { BlogCard } from "./BlogCard";
import type { BlogPost } from "../types";

type BlogsCardGridProps = {
  posts: BlogPost[];
};

function chunkPosts(posts: BlogPost[], size: number): BlogPost[][] {
  const rows: BlogPost[][] = [];

  for (let index = 0; index < posts.length; index += size) {
    rows.push(posts.slice(index, index + size));
  }

  return rows;
}

const BlogsCardGrid = ({ posts }: BlogsCardGridProps) => {
  if (posts.length === 0) {
    return null;
  }

  const rows = chunkPosts(posts, 3);

  return (
    <div className="mx-auto flex w-full max-w-1440 flex-col md:gap-10 gap-6">
      {rows.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}-${row.map((post) => post.id).join("-")}`}
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-2"
        >
          {Array.from({ length: 3 }, (_, slotIndex) => {
            const post = row[slotIndex];

            if (!post) {
              return (
                <div
                  key={`empty-${rowIndex}-${slotIndex}`}
                  className="hidden min-w-0 md:block"
                  aria-hidden
                />
              );
            }

            return <BlogCard key={post.id} post={post} />;
          })}
        </div>
      ))}
    </div>
  );
};

export default BlogsCardGrid;
