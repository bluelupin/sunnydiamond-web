import Image from "next/image";
import type { BlogContentBlock } from "../types";

type BlogDetailArticleProps = {
  introParagraphs: string[];
  sections: Array<{
    id: string;
    heading: string;
    headingHtml?: string;
    blocks: BlogContentBlock[];
  }>;
};

const blogHeadingClassName =
  "blog-cms-heading font-larken text-2xl font-light leading-110 text-darkblack md:text-32";

const blogHtmlClassName =
  "blog-cms-html font-gill text-base font-light text-darkblack md:text-[20px]";

function renderBlock(block: BlogContentBlock) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          className={
            block.emphasis === "regular"
              ? "mb-6 font-gill text-base font-normal leading-[1.45] text-darkblack last:mb-0 md:mb-8 md:text-[20px]"
              : "mb-6 font-gill text-base font-light leading-[1.45] text-darkblack last:mb-0 md:mb-8 md:text-[20px]"
          }
        >
          {block.text}
        </p>
      );

    case "labeled_lines":
      return (
        <div className="mb-6 flex flex-col gap-3 last:mb-0 md:mb-8">
          {block.lines.map((line) => (
            <p
              key={`${line.label}-${line.text}`}
              className="font-gill text-base font-light leading-[1.45] text-darkblack md:text-[20px]"
            >
              <span className="font-normal">{line.label}</span>
              {line.text}
            </p>
          ))}
        </div>
      );

    case "bullet_list":
      return (
        <ul className="mb-6 flex flex-col gap-3 last:mb-0 md:mb-8">
          {block.items.map((item) => (
            <li
              key={item.text}
              className="ms-6 list-disc font-gill text-base font-light leading-[1.45] text-darkblack md:ms-[30px] md:text-[20px]"
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
        <div className="mb-6 flex w-full flex-row gap-0 last:mb-0 md:mb-8">
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

    case "html":
      return (
        <div
          className={blogHtmlClassName}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    default:
      return null;
  }
}

function renderSectionHeading(heading: string, headingHtml?: string) {
  if (headingHtml) {
    return (
      <h2
        className={blogHeadingClassName}
        dangerouslySetInnerHTML={{ __html: headingHtml }}
      />
    );
  }

  if (!heading) return null;

  return <h2 className={blogHeadingClassName}>{heading}</h2>;
}

const BlogDetailArticle = ({ introParagraphs, sections }: BlogDetailArticleProps) => {
  return (
    <article className="min-w-0 flex-1 desktop:max-w-[875px]">
      <div className="flex flex-col gap-6 md:gap-10">
        {introParagraphs.length > 0 ? (
          <div className="flex flex-col gap-6 font-gill text-base font-normal leading-[1.45] text-darkblack md:gap-8 md:text-[20px] md:font-light">
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
            {renderSectionHeading(section.heading, section.headingHtml)}
            <div className="flex flex-col gap-6 md:gap-8">
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
