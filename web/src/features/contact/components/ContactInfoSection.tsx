"use client";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedContactInfoCard } from "@/services/contact/contact-page.types";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import Image from "next/image";
import React from "react";
import { cn } from "@/shared/utils/cn";
import { contactCardLayoutClasses } from "../data/contactHeroFigmaSpec";
import ContactCardCtaLink from "./ContactCardCtaLink";
import ContactPhoneLink from "./ContactPhoneLink";
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
      className="w-full"
    >
      <div className="mx-auto flex w-full flex-col items-center gap-16 md:gap-10">
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
        <div className={contactCardLayoutClasses.grid}>
          {infoCards.map((card, index) => {
            const isExternal =
              card.variant === "link" && /^https?:\/\//i.test(card.link.href);
            return (
              <React.Fragment key={card.id}>
                <Reveal
                  direction="up"
                  delay={index * 0.05}
                  data-cms-option-id={card.id}
                  className={cn(
                    contactCardLayoutClasses.card,
                    contactCardLayoutClasses.cardCompact,
                  )}
                >
                  <h2 className="w-full text-center font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
                    {isMobile && card.mobileTitle ? card.mobileTitle : card.title}
                  </h2>

                  <div className="flex w-full flex-1 flex-col items-center justify-between gap-4 md:gap-6">
                    <div className="flex w-full flex-col items-center justify-center text-center">
                      {card.variant === "phone" && card.hours.length > 0 ? (
                        <div className="flex flex-col items-center gap-3 text-base leading-110 text-darkblack">
                          {card.hours.map((entry) => (
                            <div
                              key={`${entry.label}-${entry.value}`}
                              className={contactCardLayoutClasses.hoursRow}
                            >
                              {entry.label ? (
                                <span className={contactCardLayoutClasses.hoursLabel}>
                                  {entry.label}
                                </span>
                              ) : null}
                              <span className={contactCardLayoutClasses.hoursValue}>
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
                        <ContactPhoneLink href={card.link.href} label={card.link.label} />
                      ) : (
                        <ContactCardCtaLink
                          href={card.link.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                        >
                          {card.link.label}
                        </ContactCardCtaLink>
                      )}
                    </div>
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
