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
              ? "font-gill text-base font-normal leading-110 text-darkblack md:text-[20px]"
              : "font-gill text-base font-light leading-110 text-darkblack md:text-[20px]"
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
              className="font-gill text-base font-light leading-110 text-darkblack md:text-[20px]"
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
              className="ms-6 list-disc font-gill text-base font-light leading-110 text-darkblack md:ms-[30px] md:text-[20px]"
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
        <div className="flex w-full flex-row gap-0">
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
      <div className="flex flex-col gap-6 md:gap-10">
        {introParagraphs.length > 0 ? (
          <div className="flex flex-col gap-4 font-gill text-base font-normal leading-110 text-darkblack md:text-[20px] md:font-light">
            {introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex scroll-mt-28 flex-col gap-4 md:gap-6"
          >
            <h2 className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32">
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
