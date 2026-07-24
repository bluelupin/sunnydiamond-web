"use client";

import Link from "next/link";
import type { AuthCustomer } from "@/features/auth/context/AuthContext";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { cn } from "@/shared/utils/cn";
import type { ProfileSectionId } from "../types";
import ProfileAddressesSection from "./ProfileAddressesSection";
import ProfileAppointmentsSection from "./ProfileAppointmentsSection";
import ProfileBespokeSection from "./ProfileBespokeSection";
import ProfileOrdersSection from "./ProfileOrdersSection";

type ProfileSectionContentProps = {
  section: ProfileSectionId;
  customer: AuthCustomer;
};

const fieldLabelClassName = "font-gill text-sm font-normal leading-110 text-neutral500";
const fieldValueClassName = "font-gill text-base font-light leading-110 text-darkblack";
const panelClassName = "rounded-sm bg-white p-6 md:p-8";

function ProfilePanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={panelClassName}>
      <div className="mb-6 space-y-2">
        <h2 className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32">
          {title}
        </h2>
        {description ? (
          <p className="font-gill text-base font-light leading-110 text-neutral500">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

const supportLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/faqs", label: "FAQs" },
  { href: "/order-tracking", label: "Order Tracking" },
  { href: "/returns-and-cancellations", label: "Returns & Cancellations" },
  { href: "/shipping-delivery", label: "Shipping & Delivery" },
  { href: "/exchange-and-resizing", label: "Exchange & Resizing" },
] as const;

const ProfileSectionContent = ({ section, customer }: ProfileSectionContentProps) => {
  if (section === "details") {
    return (
      <ProfilePanel title="Profile Details" description="Your Sunny Diamonds account information.">
        <dl className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <dt className={fieldLabelClassName}>Full Name</dt>
            <dd className={fieldValueClassName}>
              {[customer.firstname, customer.lastname].filter(Boolean).join(" ")}
            </dd>
          </div>
          <div className="space-y-2">
            <dt className={fieldLabelClassName}>Email</dt>
            <dd className={fieldValueClassName}>{customer.email}</dd>
          </div>
        </dl>
        <p className="mt-6 font-gill text-sm font-light leading-110 text-neutral500">
          To update your details, please contact our support team or visit a showroom.
        </p>
      </ProfilePanel>
    );
  }

  if (section === "orders") {
    return (
      <ProfilePanel title="My Orders" description="View your recent purchases and delivery status.">
        <ProfileOrdersSection />
      </ProfilePanel>
    );
  }

  if (section === "addresses") {
    return (
      <ProfilePanel title="My Addresses" description="Saved addresses for faster checkout.">
        <ProfileAddressesSection />
      </ProfilePanel>
    );
  }

  if (section === "appointments") {
    return (
      <ProfilePanel
        title="My Appointments"
        description="Book a visit or manage your upcoming consultations."
      >
        <ProfileAppointmentsSection />
      </ProfilePanel>
    );
  }

  if (section === "bespoke") {
    return (
      <ProfilePanel
        title="Bespoke Inspirations"
        description="Creations you’ve saved for custom jewellery conversations."
      >
        <ProfileBespokeSection />
      </ProfilePanel>
    );
  }

  return (
    <ProfilePanel title="Help & Support" description="We're here to help with your purchase journey.">
      <ul className="grid gap-3 sm:grid-cols-2">
        {supportLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "flex h-full items-center justify-between rounded-sm border border-neutral300",
                "bg-gray200/40 px-4 py-4 font-gill text-base font-light leading-110 text-darkblack",
                "transition-colors hover:border-darkblack hover:bg-white",
              )}
            >
              {link.label}
              <span aria-hidden className="text-neutral500">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-gill text-sm font-light leading-110 text-neutral500">
        Need more help?{" "}
        <DetailTextLink href="/contact" className="inline">
          Get in touch
        </DetailTextLink>
        .
      </p>
    </ProfilePanel>
  );
};

export default ProfileSectionContent;
