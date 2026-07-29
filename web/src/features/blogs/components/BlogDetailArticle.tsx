import Image from "next/image";
import type { BlogContentBlock } from "../types";

type BlogDetailArticleProps = {
  introParagraphs: string[];
  sections: Array<{
    id: string;
    heading: string;
    blocks: BlogContentBlock[];
  }>;
};

function renderBlock(block: BlogContentBlock) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          className={
            block.emphasis === "regular"
              ? "font-gill text-[20px] font-normal leading-110 text-darkblack"
              : "font-gill text-[20px] font-light leading-110 text-darkblack"
          }
        >
          {block.text}
        </p>
      );

    case "labeled_lines":
      return (
        <div className="flex flex-col gap-2">
          {block.lines.map((line) => (
            <p
              key={`${line.label}-${line.text}`}
              className="font-gill text-[20px] font-light leading-110 text-darkblack"
            >
              <span className="font-normal">{line.label}</span>
              {line.text}
            </p>
          ))}
        </div>
      );

    case "bullet_list":
      return (
        <ul className="flex flex-col gap-2">
          {block.items.map((item) => (
            <li
              key={item.text}
              className="ms-[30px] list-disc font-gill text-[20px] font-light leading-110 text-darkblack"
            >
              {item.lead ? (
                <>
                  <span className="font-normal">{item.lead}</span>
                  {item.text}
                </>
              ) : (
                item.text
              )}
            </li>
          ))}
        </ul>
      );

    case "image_row":
      return (
        <div className="flex w-full flex-col gap-0 md:flex-row">
          {block.images.map((image) => (
            <div
              key={image.src}
              className="relative h-[226px] w-full min-w-0 flex-1 overflow-hidden md:h-[496px]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 437px"
              />
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

const BlogDetailArticle = ({ introParagraphs, sections }: BlogDetailArticleProps) => {
  return (
    <article className="min-w-0 flex-1 desktop:max-w-[875px]">
      <div className="flex flex-col gap-10">
        {introParagraphs.length > 0 ? (
          <div className="flex flex-col gap-4 font-gill text-[20px] font-light leading-110 text-darkblack">
            {introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex scroll-mt-28 flex-col gap-6"
          >
            <h2 className="font-larken text-32 font-light leading-110 text-darkblack">
              {section.heading}
            </h2>
            <div className="flex flex-col gap-6">
              {section.blocks.map((block, index) => (
                <div key={`${section.id}-${index}`}>{renderBlock(block)}</div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
};

export default BlogDetailArticle;
