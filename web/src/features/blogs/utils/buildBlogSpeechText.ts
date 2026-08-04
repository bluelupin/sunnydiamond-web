import type { BlogContentBlock, BlogDetailSection } from "../types";

function blockToSpeechLines(block: BlogContentBlock): string[] {
  switch (block.type) {
    case "paragraph":
      return [block.text];
    case "labeled_lines":
      return block.lines.map((line) => `${line.label}${line.text}`);
    case "bullet_list":
      return block.items.map((item) =>
        item.lead ? `${item.lead}${item.text}` : item.text,
      );
    case "image_row":
      return block.images.map((image) => image.alt).filter(Boolean);
    case "html":
      return [block.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()].filter(Boolean);
    default:
      return [];
  }
}

export function buildBlogSpeechText(
  title: string,
  introParagraphs: string[],
  sections: BlogDetailSection[],
): string {
  const parts: string[] = [];

  if (title.trim()) {
    parts.push(title.trim());
  }

  introParagraphs.forEach((paragraph) => {
    if (paragraph.trim()) {
      parts.push(paragraph.trim());
    }
  });

  sections.forEach((section) => {
    if (section.heading.trim()) {
      parts.push(section.heading.trim());
    }

    section.blocks.forEach((block) => {
      blockToSpeechLines(block).forEach((line) => {
        if (line.trim()) {
          parts.push(line.trim());
        }
      });
    });
  });

  return parts.join("\n\n");
}
