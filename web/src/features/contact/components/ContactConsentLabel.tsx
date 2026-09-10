import { Fragment } from "react";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { buildPolicyCertificationsHref } from "@/features/cms/utils/policyCertificationsRoutes";

type ConsentLabelSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

const CONSENT_LINK_MATCHERS: Array<{
  pattern: RegExp;
  href: string;
}> = [
  {
    pattern: /terms\s*(?:&|and)\s*conditions/gi,
    href: "/terms-and-conditions",
  },
  {
    pattern: /privacy\s*policy/gi,
    href: buildPolicyCertificationsHref("privacy-policy"),
  },
];

function parseContactConsentLabel(label: string): ConsentLabelSegment[] {
  const matches: Array<{
    index: number;
    length: number;
    label: string;
    href: string;
  }> = [];

  for (const matcher of CONSENT_LINK_MATCHERS) {
    const pattern = new RegExp(matcher.pattern.source, matcher.pattern.flags);
    const match = pattern.exec(label);

    if (!match || match.index === undefined) {
      continue;
    }

    matches.push({
      index: match.index,
      length: match[0].length,
      label: match[0],
      href: matcher.href,
    });
  }

  if (matches.length === 0) {
    return [{ type: "text", value: label }];
  }

  matches.sort((left, right) => left.index - right.index);

  const segments: ConsentLabelSegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.index < cursor) {
      continue;
    }

    if (match.index > cursor) {
      segments.push({ type: "text", value: label.slice(cursor, match.index) });
    }

    segments.push({ type: "link", label: match.label, href: match.href });
    cursor = match.index + match.length;
  }

  if (cursor < label.length) {
    segments.push({ type: "text", value: label.slice(cursor) });
  }

  return segments;
}

type ContactConsentLabelProps = {
  label: string;
};

const ContactConsentLabel = ({ label }: ContactConsentLabelProps) => {
  const segments = parseContactConsentLabel(label);

  return (
    <>
      {segments.map((segment, index) =>
        segment.type === "text" ? (
          <Fragment key={`text-${index}`}>{segment.value}</Fragment>
        ) : (
          <DetailTextLink
            key={`link-${index}`}
            href={segment.href}
            className="inline align-baseline"
          >
            {segment.label}
          </DetailTextLink>
        ),
      )}
    </>
  );
};

export default ContactConsentLabel;
