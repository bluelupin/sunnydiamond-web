"use client";
import Link from "next/link";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedContactInfoCard } from "@/services/contact/contact-page.types";
import Image from "next/image";
import React from "react";
type ContactInfoSectionProps = {
  intro: {
    description: string;
    mobileDescription: string;
  };
  infoCards: NormalizedContactInfoCard[];
};

const ContactInfoSection = ({ intro, infoCards }: ContactInfoSectionProps) => {
  return (
    <section aria-labelledby="contact-intro" className="w-full md:px-10 xl:px-[150px] md:px-10">
      <div className="mx-auto flex w-full max-w-1360 flex-col items-center md:gap-10 gap-16 md:pt-16">
        <Reveal
          as="p"
          id="contact-intro"
          direction="up"
          className="max-w-[606px] text-center font-gill text-base font-light leading-110 text-[#535353] md:text-xl md:text-darkblack"
        >
          <span className="md:hidden">{intro.mobileDescription}</span>
          <span className="hidden md:inline">{intro.description}</span>
        </Reveal>
        <div className="w-full md:grid-cols-3 grid-cols-1 md:gap-4 gap-4 grid md:items-stretch md:bg-transparent bg-gray300 px-4 py-2">
          {infoCards.map((card, index) => {
            const isExternal =
              card.variant === "link" && /^https?:\/\//i.test(card.link.href);
            return (
              <React.Fragment key={card.id}>
                <Reveal
                  // key={card.id}
                  direction="up"
                  delay={index * 0.05}
                  className="flex h-full flex-col items-center self-stretch bg-gray300 xl:py-6 xl:px-6 md:py-5 md:px-5 py-4 xl:gap-6 gap-4"
                >
                  <h2 className="w-full text-center font-larken lg:text-2xl text-xl font-light leading-110 text-darkblack">
                    {card.title}
                  </h2>

                  <div className="flex w-full flex-1 flex-col items-center justify-between xl:gap-6 gap-4">
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
                    <div className="flex w-full items-center justify-center gap-2">
                      <Image className="shrink-0 md:hidden"
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
                      <Link
                        href={card.link.href}
                        className="inline-flex border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack break-all"
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        {card.link.label}
                      </Link>
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
      </div>
    </section>
  );
};

export default ContactInfoSection;
