"use client";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedContactInfoCard } from "@/services/contact/contact-page.types";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import Image from "next/image";
import React from "react";
import ContactPhoneLink from "./ContactPhoneLink";
import { DetailTextLink } from "@/features/products/components/detail/shared";
type ContactInfoSectionProps = {
  intro: {
    description: string;
    mobileDescription: string;
  } | null;
  infoCards: NormalizedContactInfoCard[];
};

const ContactInfoSection = ({ intro, infoCards }: ContactInfoSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <section
      aria-labelledby={intro ? "contact-intro" : undefined}
      className="w-full lg:pt-16 lg:pb-[104px] md:pt-10 md:pb-20 pt-10 pb-16"
    >
      <div className="flex w-full flex-col items-center md:gap-10 gap-6">
        {intro ? (
          <Reveal
            as="p"
            id="contact-intro"
            direction="up"
            className="max-w-[606px] text-center font-gill text-base font-light leading-110 text-[#535353] md:text-xl md:text-darkblack"
          >
            <span className="md:hidden">{intro.mobileDescription}</span>
            <span className="hidden md:inline">{intro.description}</span>
          </Reveal>
        ) : null}
        {infoCards.length > 0 ? (
          <div className="w-full md:grid-cols-3 grid-cols-1 md:gap-3 gap-5 grid md:items-stretch md:bg-transparent bg-gray300 py-2">
            {infoCards.map((card, index) => {
              const cmsOpenInNewTab = card.link.openInNewTab;
              const cmsTargetType = card.link.targetType?.toLowerCase();
              const hasCmsOpenInNewTab = typeof cmsOpenInNewTab === "boolean";
              const hasCmsTargetType =
                cmsTargetType === "internal" || cmsTargetType === "external";

              const openInNewTab = hasCmsOpenInNewTab
                ? cmsOpenInNewTab
                : hasCmsTargetType
                  ? cmsTargetType === "external"
                  :
                  Boolean(
                    card.link.href &&
                    card.variant === "link" &&
                    /^https?:\/\//i.test(card.link.href),
                  );

              return (
                <React.Fragment key={card.id}>
                  <Reveal
                    direction="up"
                    delay={index * 0.05}
                    data-cms-option-id={card.id}
                    className="flex h-full flex-col items-center self-stretch bg-gray300 xl:py-6 xl:px-6 md:py-5 md:px-5 px-4 py-4 lg:gap-6 gap-4"
                  >
                    <h2 className="w-full text-center font-larken lg:text-2xl text-xl font-light leading-110 text-darkblack">
                      {isMobile && card.mobileTitle ? card.mobileTitle : card.title}
                    </h2>

                    <div className="flex w-full flex-1 flex-col items-center justify-between lg:gap-6 gap-4">
                      <div className="flex w-full flex-col items-center justify-center text-center">
                        {card.variant === "phone" && card.hours.length > 0 ? (
                          <div className="flex flex-col items-center gap-3 text-base leading-110 text-darkblack">
                            {card.hours.map((entry) => (
                              <div
                                key={`${entry.label}-${entry.value}`}
                                className="flex flex-wrap items-center justify-center gap-3"
                              >
                                {entry.label ? (
                                  <span className="font-gill font-light">
                                    {entry.label}
                                  </span>
                                ) : null}
                                <span className="font-gill font-normal">
                                  {entry.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : card.description ? (
                          <p className="font-gill text-base font-light leading-110 text-darkblack">
                            {card.description}
                          </p>
                        ) : null}
                      </div>
                      {card.link.href && card.link.label ? (
                        <div className="flex w-full items-center justify-center gap-2">
                          <Image
                            className="shrink-0 md:hidden"
                            src={
                              card.variant === "email"
                                ? "/images/contact/icon-email.svg"
                                : "/images/contact/icon-whatsapp.svg"
                            }
                            alt=""
                            width={20}
                            height={20}
                            aria-hidden
                          />
                          {card.variant === "phone" ? (
                            <ContactPhoneLink
                              href={card.link.href}
                              label={card.link.label}
                              variant="detail"
                              className="max-w-full break-all"
                            />
                          ) : (
                            <DetailTextLink
                              href={card.link.href}
                              target={openInNewTab ? "_blank" : undefined}
                              rel={openInNewTab ? "noopener noreferrer" : undefined}
                            >
                              {card.link.label}
                            </DetailTextLink>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </Reveal>
                  {index !== infoCards.length - 1 && (
                    <div className="h-px w-full bg-gray50 md:hidden" aria-hidden />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ContactInfoSection;
