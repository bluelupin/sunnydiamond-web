"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ContactSupportIcon } from "@/features/contact/components/ContactSupportIcon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  POLICY_QUERY_PARAM,
  resolvePolicyIdFromParam,
} from "@/features/cms/utils/policyCertificationsRoutes";
import type {
  PolicyAccordionSection,
  PolicyDocument,
  PolicyNavGroup,
} from "@/features/cms/data/policyCertificationsContent";
import { getPolicyFromPage } from "@/services/policy/policy-certifications-page.mapper";
import type { NormalizedPolicyCertificationsPage } from "@/services/policy/policy-certifications-page.types";

type PolicyCertificationsPageProps = {
  page: NormalizedPolicyCertificationsPage;
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

function filterNavGroups(
  navGroups: PolicyNavGroup[],
  query: string,
): PolicyNavGroup[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return navGroups;
  }

  return navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((policy) => {
        const labelHaystack = [
          policy.navLabel,
          policy.mobileNavLabel,
          policy.contentTitle,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (labelHaystack.includes(normalized)) {
          return true;
        }

        return filterSections(policy.sections, query).length > 0;
      }),
    }))
    .filter((group) => group.items.length > 0);
}

function resolveActivePolicyId(
  page: NormalizedPolicyCertificationsPage,
  candidate: string | undefined,
): string {
  if (candidate && getPolicyFromPage(page, candidate)) {
    return candidate;
  }
  if (getPolicyFromPage(page, page.defaultPolicyId)) {
    return page.defaultPolicyId;
  }
  return page.navGroups[0]?.items[0]?.id ?? page.defaultPolicyId;
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
              src="/icons/search-icon.svg"
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

function PolicyDesktopSidebar({
  navGroups,
  activePolicyId,
  onSelect,
}: {
  navGroups: PolicyNavGroup[];
  activePolicyId: string;
  onSelect: (policyId: string) => void;
}) {
  return (
    <nav
      aria-label="Policy categories"
      className="hidden w-full shrink-0 border-r border-neutral300 lg:block lg:w-[435px]"
    >
      <div className="flex flex-col gap-6">
        {navGroups.map((group) => (
          <div key={group.id} className="flex w-full flex-col items-start gap-4">
            <p className="font-gill text-xl font-light leading-110 text-darkblack">
              {group.label}
            </p>
            <ul className="flex w-full flex-col items-start">
              {group.items.map((policy) => {
                const isActive = policy.id === activePolicyId;

                return (
                  <li key={policy.id} className="w-full">
                    <button
                      type="button"
                      onClick={() => onSelect(policy.id)}
                      className={cn(
                        "flex h-[70px] w-full items-center p-6 text-left transition-colors",
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

function PolicyMobileNav({
  navGroups,
  emptySearchLabel,
  activePolicyId,
  searchQuery,
  onSelect,
}: {
  navGroups: PolicyNavGroup[];
  emptySearchLabel: string;
  activePolicyId: string;
  searchQuery: string;
  onSelect: (policyId: string) => void;
}) {
  const filteredGroups = useMemo(
    () => filterNavGroups(navGroups, searchQuery),
    [navGroups, searchQuery],
  );

  if (filteredGroups.length === 0) {
    return (
      <p className="font-gill text-base font-light leading-110 text-neutral500">
        {emptySearchLabel}
      </p>
    );
  }

  return (
    <nav aria-label="Policy categories" className="flex w-full flex-col gap-[29px]">
      {filteredGroups.map((group) => (
        <div key={group.id} className="flex w-full flex-col gap-6">
          <p className="font-gill text-base font-light leading-110 text-darkblack">
            {group.label}
          </p>
          <ul className="flex w-full flex-col gap-4">
            {group.items.map((policy, index) => {
              const isActive = policy.id === activePolicyId;
              const label = policy.mobileNavLabel ?? policy.navLabel;

              return (
                <li key={policy.id} className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => onSelect(policy.id)}
                    className="flex w-full items-center justify-between text-left"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="font-gill text-sm font-normal uppercase leading-110 text-darkblack">
                      {label}
                    </span>
                    <ChevronRight className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
                  </button>
                  {index < group.items.length - 1 ? (
                    <div className="h-px w-full bg-neutral300" aria-hidden />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function PolicyAccordionToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span className="relative size-6 shrink-0 overflow-clip" aria-hidden>
      <span className="absolute inset-[16.67%_14.58%_14.58%_16.67%]">
        <span className="absolute inset-[-3.03%]">
          <Image
            src={
              isOpen
                ? "/icons/icon-accordion-minus.svg"
                : "/icons/icon-accordion-plus.svg"
            }
            alt=""
            width={18}
            height={18}
            className="block size-full max-w-none"
          />
        </span>
      </span>
    </span>
  );
}

function PolicyAccordionItem({
  section,
  isOpen,
  onToggle,
  variant = "desktop",
}: {
  section: PolicyAccordionSection;
  isOpen: boolean;
  onToggle: () => void;
  variant?: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";
  const contentId = `policy-accordion-${section.id}`;
  const triggerId = `policy-accordion-trigger-${section.id}`;

  return (
    <div className={cn("flex flex-col", isOpen && "gap-4")}>
      <button
        type="button"
        id={triggerId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={cn(
          "flex w-full gap-2 text-left",
          isMobile
            ? isOpen
              ? "items-start"
              : "items-center"
            : "h-14 shrink-0 items-center",
        )}
      >
        <span className="min-w-0 flex-1 font-gill text-base font-normal leading-110 text-darkblack">
          {section.title}
        </span>
        <PolicyAccordionToggleIcon isOpen={isOpen} />
      </button>

      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        className={cn(
          "grid min-h-0 transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "flex flex-col font-gill leading-110 text-neutral500",
              isMobile
                ? "gap-4 text-sm font-light"
                : "gap-6 text-base font-normal",
            )}
          >
            {section.intro ? <p className="whitespace-pre-line">{section.intro}</p> : null}
            {section.body ? <p className="whitespace-pre-line">{section.body}</p> : null}
            {section.listItems?.length ? (
              <ol
                className={cn(
                  "flex flex-col gap-2",
                  isMobile ? "ms-[21px]" : "ms-6",
                )}
              >
                {section.listItems.map((item, index) => (
                  <li key={index} className="list-decimal">
                    {item}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicyAccordions({
  sections,
  emptySearchLabel,
  variant = "desktop",
}: {
  sections: PolicyAccordionSection[];
  emptySearchLabel: string;
  variant?: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";
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
        {emptySearchLabel}
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
              variant={variant}
              onToggle={() =>
                setOpenSectionId((current) =>
                  current === section.id ? null : section.id,
                )
              }
            />
            {index < sections.length - 1 ? (
              <div className="h-[0.5px] w-full bg-neutral300" aria-hidden />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function PolicyMobileDetailPanel({
  policy,
  emptySearchLabel,
  onBack,
}: {
  policy: PolicyDocument;
  emptySearchLabel: string;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 pb-16">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-darkblack"
          aria-label="Back to policy list"
        >
          <ChevronLeft className="size-6" strokeWidth={1.5} aria-hidden />
        </button>
        <h1 className="min-w-0 font-larken text-2xl font-light leading-110 text-darkblack">
          {policy.contentTitle}
        </h1>
      </div>
      <PolicyAccordions
        sections={policy.sections}
        emptySearchLabel={emptySearchLabel}
        variant="mobile"
      />
    </div>
  );
}

function PolicyContentPanel({
  policy,
  searchQuery,
  emptySearchLabel,
}: {
  policy: PolicyDocument;
  searchQuery: string;
  emptySearchLabel: string;
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
      <PolicyAccordions
        sections={filteredSections}
        emptySearchLabel={emptySearchLabel}
      />
    </div>
  );
}

function PolicySupportSection({
  support,
}: {
  support: NormalizedPolicyCertificationsPage["support"];
}) {
  if (!support.phoneLabel && !support.emailLabel) {
    return null;
  }

  const ctaClassName =
    "inline-flex h-14 items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-colors hover:bg-white";

  return (
    <section
      aria-label="Customer support"
      className="bg-gray300 px-4 py-10 lg:bg-gray200 lg:py-10"
    >
      <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-center gap-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex w-full max-w-[301px] flex-col items-center gap-4 text-center lg:h-[230px] lg:justify-between lg:gap-0 lg:p-4">
          <h3 className="w-full font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
            {support.callTitle}
          </h3>
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <div className="flex flex-col items-center gap-2 whitespace-nowrap text-base leading-110 text-darkblack">
              {support.hours.map((entry) => (
                <div
                  key={`${entry.label}-${entry.value}`}
                  className="flex items-center gap-3"
                >
                  <span className="font-gill font-light">{entry.label}</span>
                  <span className="font-gill font-normal">{entry.value}</span>
                </div>
              ))}
            </div>
            <Link
              href={support.phoneHref}
              className="flex w-full items-center justify-center gap-2 font-gill text-base font-normal leading-110 text-darkblack"
            >
              <ContactSupportIcon name="phone" />
              {support.phoneLabel}
            </Link>
          </div>
          <Link href={support.contactHref} className={cn(ctaClassName, "hidden lg:inline-flex")}>
            {support.contactCtaLabel}
          </Link>
        </div>

        <div className="h-px w-full shrink-0 bg-neutral300 lg:hidden" aria-hidden />

        <div
          className="hidden w-px shrink-0 self-stretch bg-neutral300 lg:block lg:h-[230px]"
          aria-hidden
        />

        <div className="flex w-full max-w-[316px] flex-col items-center gap-4 text-center lg:h-[222px] lg:w-[316px] lg:justify-between lg:gap-0 lg:p-4">
          <div className="flex w-full flex-col items-center gap-4">
            <h3 className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
              {support.emailTitle}
            </h3>
            <div className="flex w-full flex-col items-center gap-4">
              <p className="w-full font-gill text-base font-light leading-110 text-darkblack">
                {support.emailDescription}
              </p>
              <Link
                href={support.emailHref}
                className="flex w-full items-center justify-center gap-2 font-gill text-base font-normal leading-110 text-darkblack"
              >
                <ContactSupportIcon name="email" />
                {support.emailLabel}
              </Link>
            </div>
          </div>
          <Link href={support.emailHref} className={cn(ctaClassName, "hidden lg:inline-flex")}>
            {support.emailCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

const PolicyCertificationsPage = ({
  page,
  initialPolicyId,
}: PolicyCertificationsPageProps) => {
  const searchParams = useSearchParams();
  const policyFromUrl = resolvePolicyIdFromParam(
    searchParams?.get(POLICY_QUERY_PARAM),
  );

  const [activePolicyId, setActivePolicyId] = useState(() =>
    resolveActivePolicyId(page, policyFromUrl ?? initialPolicyId),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowDetail, setMobileShowDetail] = useState(Boolean(policyFromUrl));

  useEffect(() => {
    const resolvedFromUrl = resolvePolicyIdFromParam(
      searchParams?.get(POLICY_QUERY_PARAM),
    );
    if (!resolvedFromUrl) {
      return;
    }

    setActivePolicyId(resolveActivePolicyId(page, resolvedFromUrl));
    setSearchQuery("");
    setMobileShowDetail(true);
  }, [page, searchParams]);

  const activePolicy =
    getPolicyFromPage(page, activePolicyId) ??
    getPolicyFromPage(page, page.defaultPolicyId) ??
    page.navGroups[0]?.items[0];

  if (!activePolicy) {
    return null;
  }

  const handlePolicySelect = (policyId: string) => {
    setActivePolicyId(policyId);
    setSearchQuery("");
    setMobileShowDetail(true);
  };

  const handleDesktopPolicySelect = (policyId: string) => {
    setActivePolicyId(policyId);
    setSearchQuery("");
  };

  return (
    <React.Fragment>
      <section className="mx-auto 2xl:max-w-1920 max-w-1440 2xl:px-[60px] lg:px-10 md:px-8 px-4 md:pt-10 pt-8 md:pb-100 pb-16">
        <div className="flex flex-col gap-[29px] lg:hidden">
          {mobileShowDetail ? (
            <PolicyMobileDetailPanel
              policy={activePolicy}
              emptySearchLabel={page.emptySearchLabel}
              onBack={() => setMobileShowDetail(false)}
            />
          ) : (
            <>
              <h1 className="font-larken text-32 font-light leading-110 text-darkblack">
                {page.pageTitle}
              </h1>
              <PolicySearchField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={page.searchPlaceholder}
              />
              <PolicyMobileNav
                navGroups={page.navGroups}
                emptySearchLabel={page.emptySearchLabel}
                activePolicyId={activePolicyId}
                searchQuery={searchQuery}
                onSelect={handlePolicySelect}
              />
            </>
          )}
        </div>

        <div className="hidden lg:flex lg:flex-col">
          <div className="flex flex-col items-center gap-10 pb-16">
            <h1 className="text-center font-larken lg:text-5xl md:text-4xl text-32 font-light leading-110 text-darkblack">
              {page.pageTitle}
            </h1>
            <div className="w-full max-w-[623px]">
              <PolicySearchField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={page.searchPlaceholder}
              />
            </div>
          </div>

          <div className="flex flex-row gap-6">
            <PolicyDesktopSidebar
              navGroups={page.navGroups}
              activePolicyId={activePolicyId}
              onSelect={handleDesktopPolicySelect}
            />
            <PolicyContentPanel
              policy={activePolicy}
              searchQuery={searchQuery}
              emptySearchLabel={page.emptySearchLabel}
            />
          </div>
        </div>
      </section>
      <PolicySupportSection support={page.support} />
    </React.Fragment>
  );
};

export default PolicyCertificationsPage;
