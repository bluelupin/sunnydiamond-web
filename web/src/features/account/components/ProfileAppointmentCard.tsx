"use client";

import Image from "next/image";
import { Calendar, ChevronRight } from "lucide-react";
import {
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileAppointmentUi } from "../types/profileUi.types";
import { cn } from "@/shared/utils/cn";
import { ProfileCard, ProfileInfoNote } from "./profileUi";

const bookingFieldClassName =
  "flex h-14 w-full items-center bg-aboutInactive p-3 font-gill text-base font-normal leading-110 text-darkblack";

type ProfileAppointmentCardProps = {
  appointment: ProfileAppointmentUi;
  onReschedule: () => void;
  onCancel: () => void;
};

function ProductGallery({ products }: { products: ProfileAppointmentUi["products"] }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:justify-center lg:gap-6 lg:overflow-visible lg:px-0">
      {products.map((product) => (
        <div key={product.id} className="flex w-[100px] shrink-0 flex-col gap-2 lg:w-[176px]">
          <div className="relative h-[76px] w-full overflow-hidden bg-white lg:h-[135px]">
            <Image
              src={product.imageSrc}
              alt={product.name}
              fill
              className="object-cover"
              sizes="176px"
            />
          </div>
          <p className="font-gill text-base font-normal leading-110 text-darkblack">
            {product.name}
          </p>
        </div>
      ))}
    </div>
  );
}

function ProfileAppointmentPersonalDetails({
  title,
  name,
  phone,
  email,
}: {
  title: string;
  name: string;
  phone: string;
  email: string;
}) {
  return (
    <div className="bg-white p-4 lg:p-6">
      <h4 className="mb-4 font-larken text-2xl font-light leading-110 text-darkblack">
        {title}
      </h4>
      <div className="flex flex-col gap-2 font-gill text-base leading-110 text-darkblack">
        <p className="font-normal">{name}</p>
        <div className="font-light">
          <p>{phone}</p>
          <p>{email}</p>
        </div>
      </div>
    </div>
  );
}

function ProfileAppointmentNote({ title, note }: { title: string; note: string }) {
  return (
    <div className="bg-white p-4 lg:p-6">
      <h4 className="mb-4 font-larken text-2xl font-light leading-110 text-darkblack">
        {title}
      </h4>
      {note.trim() ? (
        <p className="font-gill text-base font-light leading-110 whitespace-pre-line text-darkblack">
          {note}
        </p>
      ) : null}
    </div>
  );
}

function ProfileAppointmentAddress({
  title,
  address,
}: {
  title: string;
  address: NonNullable<ProfileAppointmentUi["appointmentAddress"]>;
}) {
  const cityStatePincode = [address.city, address.state, address.pincode]
    .filter((part): part is string => Boolean(part))
    .join(", ");

  return (
    <div className="flex flex-col gap-4 bg-white p-4 lg:p-6">
      <h4 className="font-larken text-2xl font-light leading-110 text-darkblack">{title}</h4>
      <div className="flex flex-col gap-2 font-gill text-base leading-110 text-darkblack">
        <p className="font-normal">{address.name}</p>
        <div className="font-light">
          {address.addressLine1 ? <p>{address.addressLine1}</p> : null}
          {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
          {cityStatePincode ? <p>{cityStatePincode}</p> : null}
          {address.phone ? <p>{address.phone}</p> : null}
        </div>
      </div>
    </div>
  );
}

function ProfileAppointmentBookingDetails({
  dateLabel,
  timeLabel,
  bookingDate,
  bookingTime,
}: {
  dateLabel: string;
  timeLabel: string;
  bookingDate: string;
  bookingTime: string;
}) {
  const content = profileTabsContent.appointments;

  return (
    <div className="bg-white p-4 lg:p-6">
      <h4 className="mb-4 font-larken text-2xl font-light leading-110 text-darkblack">
        {content.bookingDetailsTitle}
      </h4>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex min-h-[82px] flex-1 flex-col justify-between gap-2 sm:gap-0">
          <span className="font-gill text-base font-normal leading-110 text-darkblack">
            {dateLabel}
          </span>
          <div className={cn(bookingFieldClassName, "justify-between")}>
            <span className="truncate">{bookingDate}</span>
            <Calendar className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <span className="font-gill text-base font-normal leading-110 text-darkblack">
            {timeLabel}
          </span>
          <div className={bookingFieldClassName}>
            <span className="truncate">{bookingTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileAppointmentCard({
  appointment,
  onReschedule,
  onCancel,
}: ProfileAppointmentCardProps) {
  const content = profileTabsContent.appointments;

  return (
    <ProfileCard className="relative flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <span
        className="absolute left-0 top-0 bg-mauve300 px-3 py-2 font-gill text-base font-normal leading-110 whitespace-nowrap text-darkblack"
      >
        {appointment.typeLabel}
      </span>

      <div className="pt-8">
        <ProductGallery products={appointment.products} />
      </div>

      <ProfileAppointmentPersonalDetails
        title={content.personalDetailsTitle}
        name={appointment.customerName}
        phone={appointment.customerPhone}
        email={appointment.customerEmail}
      />

      {appointment.appointmentAddress ? (
        <ProfileAppointmentAddress
          title={content.appointmentAddressTitle}
          address={appointment.appointmentAddress}
        />
      ) : null}

      {appointment.storeVisit ? (
        <div className="bg-gray300 p-4 lg:p-6">
          <h4 className="mb-4 font-larken text-xl font-light leading-110 text-darkblack">
            {content.storeVisitTitle}
          </h4>
          <div className="space-y-4">
            <div className="space-y-2 font-gill text-base leading-110 text-darkblack">
              <p className="font-normal">{appointment.storeVisit.city}</p>
              {appointment.storeVisit.lines.map((line) => (
                <p key={line} className="font-light">{line}</p>
              ))}
            </div>
            {appointment.storeVisit.directionsHref ? (
              <DetailTextLink
                href={appointment.storeVisit.directionsHref}
                className="inline-flex items-center gap-2 text-sm uppercase"
              >
                {content.getDirectionsLabel}
                <ChevronRight className="size-4" aria-hidden />
              </DetailTextLink>
            ) : null}
          </div>
        </div>
      ) : null}

      <ProfileAppointmentBookingDetails
        dateLabel={content.bookingDateLabel}
        timeLabel={content.bookingTimeLabel}
        bookingDate={appointment.bookingDate}
        bookingTime={appointment.bookingTime}
      />

      <ProfileAppointmentNote title={content.notesLabel} note={appointment.notes} />

      <div className="flex items-center gap-6">
        <DetailOutlineButton
          type="button"
          className="min-w-0 flex-1"
          onClick={onCancel}
          disabled={!appointment.canCancel}
        >
          {content.cancelLabel}
        </DetailOutlineButton>
        <DetailDarkButton
          type="button"
          className="min-w-0 flex-1"
          onClick={onReschedule}
          disabled={!appointment.canReschedule}
        >
          {content.rescheduleLabel}
        </DetailDarkButton>
      </div>

      {appointment.rescheduleNote ? (
        <ProfileInfoNote>{appointment.rescheduleNote}</ProfileInfoNote>
      ) : null}
    </ProfileCard>
  );
}
