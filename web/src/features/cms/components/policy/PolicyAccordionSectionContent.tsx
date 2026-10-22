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
          "editor-content text-neutral500 [&_a]:underline [&_a]:underline-offset-4",
          isMobile ? "text-sm font-light" : "text-base font-normal",
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
