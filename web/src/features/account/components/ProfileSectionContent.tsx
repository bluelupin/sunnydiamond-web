"use client";

import Link from "next/link";
import type { AuthCustomer } from "@/features/auth/context/AuthContext";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { cn } from "@/shared/utils/cn";
import type { ProfileSectionId } from "../types";
import ProfileAddressesSection from "./ProfileAddressesSection";
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

function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-sm border border-dashed border-neutral300 bg-gray200/60 p-6">
      <div className="space-y-2">
        <p className="font-gill text-base font-normal leading-110 text-darkblack">{title}</p>
        <p className="font-gill text-sm font-light leading-110 text-neutral500">{description}</p>
      </div>
      {actionHref && actionLabel ? (
        <CartPrimaryLink href={actionHref} className="w-full max-w-xs">
          {actionLabel}
        </CartPrimaryLink>
      ) : null}
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
        <EmptyState
          title="No upcoming appointments"
          description="Schedule a private consultation at your nearest Sunny Diamonds showroom."
          actionHref="/book-an-appointment"
          actionLabel="Book an Appointment"
        />
      </ProfilePanel>
    );
  }

  if (section === "bespoke") {
    return (
      <ProfilePanel
        title="Bespoke Inspirations"
        description="Commission a one-of-a-kind piece crafted around your story."
      >
        <div className="space-y-4">
          <p className="font-gill text-base font-light leading-110 text-neutral500">
            Explore bespoke designs, share your inspiration, and work with our master artisans to
            create jewellery made only for you.
          </p>
          <CartPrimaryLink href="/bespoke-jewellery" className="w-full max-w-xs">
            Explore Bespoke
          </CartPrimaryLink>
        </div>
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
