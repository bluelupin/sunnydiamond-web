"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import {
  defaultPolicyId,
  getPolicyById,
  policyCertificationsContent,
  type PolicyAccordionSection,
  type PolicyDocument,
} from "@/features/cms/data/policyCertificationsContent";

type PolicyCertificationsPageProps = {
  initialPolicyId?: string;
};

function filterSections(
  sections: PolicyAccordionSection[],
  query: string,
): PolicyAccordionSection[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return sections;
  }

  return sections.filter((section) => {
    const haystack = [
      section.title,
      section.intro,
      section.body,
      section.listItems?.join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

function PolicySearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex h-14 w-full items-center gap-2 bg-aboutInactive p-3">
      <span className="relative size-6 shrink-0 overflow-clip" aria-hidden>
        <span className="absolute inset-[12.5%]">
          <span className="absolute inset-[-2.78%]">
            <Image
              src="/images/careers/icon-search.svg"
              alt=""
              width={24}
              height={24}
              className="block size-full max-w-none"
            />
          </span>
        </span>
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600"
      />
    </label>
  );
}

function PolicySidebar({
  activePolicyId,
  onSelect,
}: {
  activePolicyId: string;
  onSelect: (policyId: string) => void;
}) {
  return (
    <nav
      aria-label="Policy categories"
      className="w-full shrink-0 border-neutral300 lg:w-[435px] lg:border-r lg:pr-6"
    >
      <div className="flex flex-col gap-6">
        {policyCertificationsContent.navGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-4">
            <p className="font-gill text-xl font-light leading-110 text-darkblack">
              {group.label}
            </p>
            <ul className="flex flex-col">
              {group.items.map((policy) => {
                const isActive = policy.id === activePolicyId;

                return (
                  <li key={policy.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(policy.id)}
                      className={cn(
                        "flex h-[70px] w-full items-center px-6 text-left transition-colors",
                        isActive
                          ? "border-r-2 border-darkblack bg-gray300 font-gill text-xl font-normal leading-110 text-darkblack"
                          : "font-gill text-xl font-light leading-110 text-darkblack hover:bg-gray300/60",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {policy.navLabel}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

function PolicyAccordionItem({
  section,
  isOpen,
  onToggle,
}: {
  section: PolicyAccordionSection;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex h-14 w-full items-center gap-2 text-left"
      >
        <span className="min-w-0 flex-1 font-gill text-base font-normal leading-110 text-darkblack">
          {section.title}
        </span>
        <span className="inline-flex size-6 shrink-0 items-center justify-center" aria-hidden>
          <Image
            src={
              isOpen
                ? "/images/cms/icon-accordion-minus.svg"
                : "/images/cms/icon-accordion-plus.svg"
            }
            alt=""
            width={17}
            height={17}
            className="size-[17px]"
          />
        </span>
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-6 pb-4 font-gill text-base font-normal leading-110 text-neutral500">
          {section.intro ? <p>{section.intro}</p> : null}
          {section.body ? <p>{section.body}</p> : null}
          {section.listItems?.length ? (
            <ol className="flex flex-col gap-2">
              {section.listItems.map((item, index) => (
                <li key={index} className="ms-6 list-decimal">
                  {item}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function PolicyAccordions({ sections }: { sections: PolicyAccordionSection[] }) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(
    sections[0]?.id ?? null,
  );

  useEffect(() => {
    if (!sections.some((section) => section.id === openSectionId)) {
      setOpenSectionId(sections[0]?.id ?? null);
    }
  }, [openSectionId, sections]);

  if (sections.length === 0) {
    return (
      <p className="font-gill text-base font-light leading-110 text-neutral500">
        {policyCertificationsContent.emptySearchLabel}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, index) => {
        const isOpen = openSectionId === section.id;

        return (
          <div key={section.id} className="flex flex-col gap-4">
            <PolicyAccordionItem
              section={section}
              isOpen={isOpen}
              onToggle={() =>
                setOpenSectionId((current) =>
                  current === section.id ? null : section.id,
                )
              }
            />
            {index < sections.length - 1 ? (
              <div className="h-px w-full bg-neutral300" aria-hidden />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function PolicyContentPanel({
  policy,
  searchQuery,
}: {
  policy: PolicyDocument;
  searchQuery: string;
}) {
  const filteredSections = useMemo(
    () => filterSections(policy.sections, searchQuery),
    [policy.sections, searchQuery],
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <h2 className="font-larken text-32 font-light leading-110 text-darkblack">
        {policy.contentTitle}
      </h2>
      <PolicyAccordions sections={filteredSections} />
    </div>
  );
}

function PolicySupportSection() {
  const { support } = policyCertificationsContent;

  return (
    <section
      aria-label="Customer support"
      className="bg-gray200 px-4 py-10 md:px-6 md:py-10"
    >
      <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-center gap-10 lg:flex-row lg:gap-16">
        <div className="flex max-w-[301px] flex-col items-center justify-between gap-6 p-4 text-center">
          <h3 className="font-larken text-2xl font-light leading-110 text-darkblack">
            {support.callTitle}
          </h3>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2 text-base leading-110 text-darkblack">
              {support.hours.map((entry) => (
                <div key={entry.label} className="flex flex-wrap items-center justify-center gap-3">
                  <span className="font-gill font-light">{entry.label}</span>
                  <span className="font-gill font-normal">{entry.value}</span>
                </div>
              ))}
            </div>
            <Link
              href={support.phoneHref}
              className="flex items-center gap-2 font-gill text-base font-normal leading-110 text-darkblack"
            >
              <Image
                src="/images/contact/icon-phone.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
              />
              {support.phoneLabel}
            </Link>
          </div>
          <Link
            href={support.contactHref}
            className="inline-flex h-14 items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-colors hover:bg-white"
          >
            {support.contactCtaLabel}
          </Link>
        </div>

        <div className="hidden h-[230px] w-px shrink-0 bg-neutral300 lg:block" aria-hidden />

        <div className="flex max-w-[316px] flex-col items-center justify-between gap-6 p-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-larken text-2xl font-light leading-110 text-darkblack">
              {support.emailTitle}
            </h3>
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              {support.emailDescription}
            </p>
            <Link
              href={support.emailHref}
              className="flex items-center gap-2 font-gill text-base font-normal leading-110 text-darkblack"
            >
              <Image
                src="/images/contact/icon-email.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
              />
              {support.emailLabel}
            </Link>
          </div>
          <Link
            href={support.emailHref}
            className="inline-flex h-14 items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-colors hover:bg-white"
          >
            {support.emailCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

const PolicyCertificationsPage = ({
  initialPolicyId = defaultPolicyId,
}: PolicyCertificationsPageProps) => {
  const [activePolicyId, setActivePolicyId] = useState(initialPolicyId);
  const [searchQuery, setSearchQuery] = useState("");

  const activePolicy = getPolicyById(activePolicyId) ?? getPolicyById(defaultPolicyId);

  if (!activePolicy) {
    return null;
  }

  const handlePolicySelect = (policyId: string) => {
    setActivePolicyId(policyId);
    setSearchQuery("");
  };

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-[1360px] px-4 py-10 md:px-10 md:py-16">
        <div className="flex flex-col items-center gap-10 pb-10 md:pb-16">
          <h1 className="text-center font-larken text-32 font-light leading-110 text-darkblack md:text-48">
            {policyCertificationsContent.pageTitle}
          </h1>
          <div className="w-full max-w-[623px]">
            <PolicySearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={policyCertificationsContent.searchPlaceholder}
            />
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-6">
          <PolicySidebar activePolicyId={activePolicyId} onSelect={handlePolicySelect} />
          <PolicyContentPanel policy={activePolicy} searchQuery={searchQuery} />
        </div>
      </section>

      <PolicySupportSection />
    </div>
  );
};

export default PolicyCertificationsPage;
