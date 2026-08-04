"use client";

import Image from "next/image";
import Link from "next/link";
import { ContactSupportIcon } from "./ContactSupportIcon";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedContactInfoCard } from "@/services/contact/contact-page.types";

const contactLinkClassName =
  "inline-flex border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack";

const mobileLinkClassName =
  "inline-flex border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack";

type ContactInfoSectionProps = {
  intro: {
    description: string;
    mobileDescription: string;
  };
  infoCards: NormalizedContactInfoCard[];
};

const ContactInfoMobileCard = ({
  card,
  showDivider,
}: {
  card: NormalizedContactInfoCard;
  showDivider: boolean;
}) => {
  const title = card.mobileTitle || card.title;
  const isExternal = card.variant === "link" && /^https?:\/\//i.test(card.link.href);

  return (
    <div className="flex w-full flex-col gap-6">
      {showDivider ? <div className="h-px w-full bg-gray50" aria-hidden /> : null}
      <div className="flex w-full flex-col gap-6">
        <h2 className="text-center font-larken text-xl font-light leading-110 text-darkblack">
          {title}
        </h2>

        <div className="flex w-full flex-col items-center gap-6">
          {card.variant === "phone" && card.hours.length > 0 ? (
            <div className="flex flex-col items-center gap-3 text-sm leading-110 text-darkblack">
              {card.hours.map((entry) => (
                <div
                  key={`${entry.label}-${entry.value}`}
                  className="flex flex-wrap items-center justify-center gap-3"
                >
                  {entry.label ? (
                    <span className="font-gill font-light">{entry.label}</span>
                  ) : null}
                  <span className="font-gill font-normal">{entry.value}</span>
                </div>
              ))}
            </div>
          ) : card.description ? (
            <p className="text-center font-gill text-sm font-light leading-110 text-darkblack">
              {card.description}
            </p>
          ) : null}

          {card.variant === "phone" ? (
            <Link
              href={card.link.href}
              className="flex items-center gap-2 font-gill text-base font-normal leading-110 text-darkblack"
            >
              <ContactSupportIcon name="phone" />
              {card.link.label}
            </Link>
          ) : (
            <Link
              href={card.link.href}
              className="flex items-center gap-2"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              <Image
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
              <span className={mobileLinkClassName}>{card.link.label}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const ContactInfoSection = ({ intro, infoCards }: ContactInfoSectionProps) => {
  return (
    <section aria-labelledby="contact-intro" className="w-full md:px-10 lg:px-[150px]">
      <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-10 md:pt-16">
        <Reveal
          as="p"
          id="contact-intro"
          direction="up"
          className="max-w-[606px] text-center font-gill text-base font-light leading-110 text-[#535353] md:text-xl md:text-darkblack"
        >
          <span className="md:hidden">{intro.mobileDescription}</span>
          <span className="hidden md:inline">{intro.description}</span>
        </Reveal>

        <div className="flex w-full flex-col gap-10 bg-gray300 px-4 py-6 md:hidden">
          {infoCards.map((card, index) => (
            <ContactInfoMobileCard
              key={card.id}
              card={card}
              showDivider={index > 0}
            />
          ))}
        </div>

        <div className="hidden w-full grid-cols-3 gap-4 md:grid md:items-stretch">
          {infoCards.map((card, index) => {
            const isExternal =
              card.variant === "link" && /^https?:\/\//i.test(card.link.href);

            return (
              <Reveal
                key={card.id}
                direction="up"
                delay={index * 0.05}
                className="flex h-full flex-col items-center self-stretch bg-gray300 p-6"
              >
                <h2 className="w-full text-center font-larken text-2xl font-light leading-110 text-darkblack">
                  {card.title}
                </h2>

                <div className="flex w-full flex-1 flex-col items-center justify-between gap-6 pt-6">
                  <div className="flex w-full flex-col items-center justify-center text-center">
                    {card.variant === "phone" && card.hours.length > 0 ? (
                      <div className="flex flex-col items-center gap-3 text-base leading-110 text-darkblack">
                        {card.hours.map((entry) => (
                          <div
                            key={`${entry.label}-${entry.value}`}
                            className="flex flex-wrap items-center justify-center gap-3"
                          >
                            {entry.label ? (
                              <span className="font-gill font-light">{entry.label}</span>
                            ) : null}
                            <span className="font-gill font-normal">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : card.description ? (
                      <p className="font-gill text-base font-light leading-110 text-darkblack">
                        {card.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex w-full items-center justify-center">
                    <Link
                      href={card.link.href}
                      className={contactLinkClassName}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                    >
                      {card.link.label}
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactInfoSection;
