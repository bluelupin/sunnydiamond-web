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
    <div className="mx-auto flex w-full max-w-1440 flex-col gap-10">
      {rows.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}-${row.map((post) => post.id).join("-")}`}
          className="flex flex-col gap-10 md:flex-row md:items-start md:justify-center md:gap-2"
        >
          {row.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BlogsCardGrid;
