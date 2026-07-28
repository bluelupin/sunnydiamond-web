"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import { appointmentFieldClassName } from "@/shared/constants/appointmentForm";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileAppointmentUi } from "../types/profileUi.types";
import { ProfileCard, ProfileInfoNote } from "./profileUi";

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

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-gill text-base font-light leading-110 text-darkblack">{label}</span>
      <div className={appointmentFieldClassName}>{value}</div>
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
        className="absolute left-0 top-0 bg-white px-3 py-2 font-gill text-base font-normal leading-110 text-darkblack"
      >
        {appointment.typeLabel}
      </span>

      <div className="pt-8">
        <ProductGallery products={appointment.products} />
      </div>

      <div className="bg-gray300 p-4 lg:p-6">
        <h4 className="mb-4 font-larken text-xl font-light leading-110 text-darkblack">
          {content.personalDetailsTitle}
        </h4>
        <div className="space-y-2 font-gill text-base leading-110 text-darkblack">
          <p className="font-normal">{appointment.customerName}</p>
          <p className="font-light">{appointment.customerPhone}</p>
          <p className="font-light">{appointment.customerEmail}</p>
        </div>
      </div>

      {appointment.appointmentAddress ? (
        <div className="bg-gray300 p-4 lg:p-6">
          <h4 className="mb-4 font-larken text-xl font-light leading-110 text-darkblack">
            {content.appointmentAddressTitle}
          </h4>
          <div className="space-y-2 font-gill text-base leading-110 text-darkblack">
            <p className="font-normal">{appointment.appointmentAddress.name}</p>
            {appointment.appointmentAddress.lines.map((line) => (
              <p key={line} className="font-light">{line}</p>
            ))}
          </div>
        </div>
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

      <div className="bg-gray300 p-4 lg:p-6">
        <h4 className="mb-4 font-larken text-xl font-light leading-110 text-darkblack">
          {content.bookingDetailsTitle}
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReadOnlyField label={content.bookingDateLabel} value={appointment.bookingDate} />
          <ReadOnlyField label={content.bookingTimeLabel} value={appointment.bookingTime} />
        </div>
      </div>

      <div className="bg-gray300 p-4 lg:p-6">
        <h4 className="mb-4 font-larken text-xl font-light leading-110 text-darkblack">
          {appointment.notesLabel}
        </h4>
        <p className="font-gill text-base font-light leading-110 text-darkblack">
          {appointment.notes}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <DetailOutlineButton
          type="button"
          className="w-full sm:flex-1"
          onClick={onReschedule}
          disabled={!appointment.canReschedule}
        >
          {content.rescheduleLabel}
        </DetailOutlineButton>
        <DetailDarkButton
          type="button"
          className="w-full sm:flex-1"
          onClick={onCancel}
          disabled={!appointment.canCancel}
        >
          {content.cancelLabel}
        </DetailDarkButton>
      </div>

      {appointment.rescheduleNote ? (
        <ProfileInfoNote>{appointment.rescheduleNote}</ProfileInfoNote>
      ) : null}
    </ProfileCard>
  );
}
