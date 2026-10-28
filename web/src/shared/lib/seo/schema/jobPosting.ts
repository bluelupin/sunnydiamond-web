import { siteConfig } from "@/shared/lib/siteConfig";
import { BRAND_LOGO_URL, getAbsoluteUrl } from "@/shared/lib/seo/siteConfig";
import type { NormalizedCareerJob } from "@/services/careers/careers.types";

const EMPLOYMENT_TYPES: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
};

// Google wants the full posting; current CMS openings keep it in sections, and
// descriptionHtml is only set for the legacy single-field format.
function buildDescription(job: NormalizedCareerJob): string {
  const sections: Array<[string | undefined, string | undefined]> = [
    [job.jobSummaryTitle, job.jobSummary],
    [job.rolesTitle, job.rolesAndResponsibilities],
    [job.skillsTitle, job.skills],
    ...(job.qualifications ?? []).map((q): [string, string] => [q.label, q.text]),
    [job.whatWeAreLookingForTitle, job.whatWeAreLookingFor],
  ];
  const html = sections
    .filter(([, body]) => body?.trim())
    .map(([title, body]) => (title ? `<h3>${title}</h3>${body}` : body))
    .join("");

  return html || job.descriptionHtml || job.summary;
}

export function buildJobPostingJsonLd(job: NormalizedCareerJob) {
  const employmentType = EMPLOYMENT_TYPES[job.type];

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: buildDescription(job),
    datePosted: job.postedAt,
    ...(employmentType ? { employmentType } : {}),
    identifier: {
      "@type": "PropertyValue",
      name: siteConfig.brand.name,
      value: job.jobCode,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.brand.name,
      sameAs: getAbsoluteUrl("/"),
      logo: BRAND_LOGO_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
  };
}
