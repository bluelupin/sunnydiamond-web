"use client";

import { cn } from "@/shared/utils/cn";
import type { PolicyAccordionSection } from "@/features/cms/data/policyCertificationsContent";
import PolicyText from "./PolicyText";

type PolicyAccordionSectionContentProps = {
  section: PolicyAccordionSection;
  isMobile: boolean;
};

export default function PolicyAccordionSectionContent({
  section,
  isMobile,
}: PolicyAccordionSectionContentProps) {
  if (section.richHtml) {
    return (
      <div
        className={cn(
          // Inherit accordion typography from parent — only structure CKEditor markup.
          "[&_*]:text-inherit [&_*]:font-[inherit] [&_*]:leading-[inherit]",
          "[&_p]:m-0 [&_p]:whitespace-pre-line",
          isMobile ? "[&_p+p]:mt-4 [&_ul+_*]:mt-4 [&_ol+_*]:mt-4" : "[&_p+p]:mt-6 [&_ul+_*]:mt-6 [&_ol+_*]:mt-6",
          "[&_a]:break-words [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-darkblack [&_a]:focus-visible:outline [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2",
          "[&_ol]:flex [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:list-decimal",
          "[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:list-disc",
          isMobile ? "[&_ol]:ms-[21px] [&_ul]:ms-[21px]" : "[&_ol]:ms-6 [&_ul]:ms-6",
          "[&_li]:list-item",
        )}
        dangerouslySetInnerHTML={{ __html: section.richHtml }}
      />
    );
  }

  return (
    <>
      {section.intro ? (
        <p className="whitespace-pre-line">
          <PolicyText text={section.intro} />
        </p>
      ) : null}
      {section.body ? (
        <p className="whitespace-pre-line">
          <PolicyText text={section.body} />
        </p>
      ) : null}
      {section.listItems?.length ? (
        <ol
          className={cn("flex flex-col gap-2", isMobile ? "ms-[21px]" : "ms-6")}
        >
          {section.listItems.map((item, index) => (
            <li key={index} className="list-decimal">
              <PolicyText text={item} />
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );
}
