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
    <div className="flex flex-col gap-6 bg-white p-4 lg:p-6">
      <h4 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
        {title}
      </h4>
      <div className="flex w-full flex-col gap-2 font-gill text-base leading-110 text-darkblack">
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
    <div className="flex flex-col gap-4 bg-white p-4 lg:gap-6 lg:p-6">
      <h4 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
        {title}
      </h4>
      {note.trim() ? (
        <p className="font-gill text-sm font-normal leading-110 whitespace-pre-line text-darkblack lg:text-base lg:font-light">
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

  const addressLines = [address.addressLine1, address.addressLine2, cityStatePincode].filter(
    Boolean,
  );

  const mobileAddressText = [address.name, ...addressLines, address.phone]
    .filter((part): part is string => Boolean(part))
    .join("\n");

  return (
    <div className="flex flex-col gap-6 bg-white p-4 lg:gap-4 lg:p-6">
      <h4 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
        {title}
      </h4>

      <p className="font-gill text-base font-light leading-110 whitespace-pre-line text-darkblack lg:hidden">
        {mobileAddressText}
      </p>

      <div className="hidden flex-col gap-2 font-gill text-base leading-110 text-darkblack lg:flex">
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

function ProfileAppointmentStoreVisit({
  title,
  storeVisit,
  directionsLabel,
}: {
  title: string;
  storeVisit: NonNullable<ProfileAppointmentUi["storeVisit"]>;
  directionsLabel: string;
}) {
  return (
    <div className="flex flex-col gap-6 bg-white p-4 lg:bg-gray300 lg:p-6">
      <h4 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-xl lg:font-light">
        {title}
      </h4>

      <div className="flex flex-col gap-2 font-gill text-base leading-110 text-darkblack">
        <p className="font-normal">{storeVisit.city}</p>
        <div className="font-light">
          {storeVisit.lines.map((line, index) => (
            <p key={`${index}-${line}`}>{line}</p>
          ))}
        </div>
      </div>

      {storeVisit.directionsHref ? (
        <DetailTextLink
          href={storeVisit.directionsHref}
          className="text-sm uppercase lg:inline-flex lg:items-center lg:gap-2"
        >
          {directionsLabel}
          <ChevronRight className="hidden size-4 lg:block" aria-hidden />
        </DetailTextLink>
      ) : null}
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
    <div className="flex flex-col gap-6 bg-white p-4 lg:p-6">
      <h4 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
        {content.bookingDetailsTitle}
      </h4>

      <div className="flex w-full flex-col gap-4 font-gill text-base font-normal leading-110 text-darkblack lg:hidden">
        <div className="flex w-full flex-col gap-2">
          <p>{dateLabel}</p>
          <p>{bookingDate}</p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <p>{timeLabel}</p>
          <p>{bookingTime}</p>
        </div>
      </div>

      <div className="hidden flex-col gap-4 lg:flex lg:flex-row">
        <div className="flex min-h-[82px] flex-1 flex-col justify-between gap-2 lg:gap-0">
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
  const notesText =
    typeof appointment.notes === "string"
      ? appointment.notes.trim()
      : String(appointment.notes ?? "").trim();

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
        <ProfileAppointmentStoreVisit
          title={content.storeVisitTitle}
          storeVisit={appointment.storeVisit}
          directionsLabel={content.getDirectionsLabel}
        />
      ) : null}

      <ProfileAppointmentBookingDetails
        dateLabel={content.bookingDateLabel}
        timeLabel={content.bookingTimeLabel}
        bookingDate={appointment.bookingDate}
        bookingTime={appointment.bookingTime}
      />

      {notesText ? (
        <ProfileAppointmentNote title={content.notesLabel} note={notesText} />
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <DetailDarkButton
            type="button"
            className="w-full lg:order-2 lg:min-w-0 lg:flex-1"
            onClick={onReschedule}
            disabled={!appointment.canReschedule}
          >
            {content.rescheduleLabel}
          </DetailDarkButton>
          <DetailOutlineButton
            type="button"
            className="w-full lg:order-1 lg:min-w-0 lg:flex-1"
            onClick={onCancel}
            disabled={!appointment.canCancel}
          >
            {content.cancelLabel}
          </DetailOutlineButton>
        </div>

        {appointment.rescheduleNote ? (
          <ProfileInfoNote>{appointment.rescheduleNote}</ProfileInfoNote>
        ) : null}
      </div>
    </ProfileCard>
  );
}
