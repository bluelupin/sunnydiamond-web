"use client";

import {
  CartMetaRow,
  CartOutlineButton,
  CartPrimaryLink,
} from "@/features/cart/components/CartFlowUi";
import { useCustomerAppointments } from "../hooks/useCustomerAppointments";
import {
  formatAppointmentDate,
  formatAppointmentFormTag,
  formatAppointmentStatus,
} from "../utils/formatAccountData";

function AppointmentsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading appointments">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-sm border border-neutral300 bg-gray200/60"
        />
      ))}
    </div>
  );
}

const ProfileAppointmentsSection = () => {
  const { data, isLoading, error, page, setPage } = useCustomerAppointments(true);

  if (isLoading) {
    return <AppointmentsSkeleton />;
  }

  if (error) {
    return (
      <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (!data || data.appointments.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-sm border border-dashed border-neutral300 bg-gray200/60 p-6">
        <div className="space-y-2">
          <p className="font-gill text-base font-normal leading-110 text-darkblack">
            No upcoming appointments
          </p>
          <p className="font-gill text-sm font-light leading-110 text-neutral500">
            Schedule a private consultation at your nearest Sunny Diamonds showroom.
          </p>
        </div>
        <CartPrimaryLink href="/book-an-appointment" className="w-full max-w-xs">
          Book an Appointment
        </CartPrimaryLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {data.appointments.map((appointment) => {
          const title =
            appointment.productName ||
            (appointment.formTag
              ? formatAppointmentFormTag(appointment.formTag)
              : "Appointment");
          const showroomParts = [
            appointment.preferredShowroom?.name,
            appointment.preferredShowroom?.city,
            appointment.preferredShowroom?.state,
          ].filter(Boolean);
          const metaParts = [
            appointment.requestedDate
              ? formatAppointmentDate(appointment.requestedDate)
              : null,
            appointment.selectedTimeSlot || null,
            appointment.workflowStatus
              ? formatAppointmentStatus(appointment.workflowStatus)
              : null,
          ].filter(Boolean) as string[];

          return (
            <li
              key={appointment.documentId}
              className="rounded-sm border border-neutral300 bg-gray200/40 p-5 md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 space-y-3">
                  <div className="space-y-1">
                    <p className="font-gill text-base font-normal leading-110 text-darkblack">
                      {title}
                    </p>
                    {metaParts.length > 0 ? <CartMetaRow parts={metaParts} /> : null}
                  </div>

                  {showroomParts.length > 0 ? (
                    <p className="font-gill text-sm font-light leading-110 text-neutral500">
                      {showroomParts.join(", ")}
                    </p>
                  ) : null}

                  {appointment.formTag && appointment.productName ? (
                    <p className="font-gill text-sm font-light leading-110 text-neutral500">
                      {formatAppointmentFormTag(appointment.formTag)}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
                  <p className="font-gill text-base font-normal leading-110 text-darkblack">
                    {formatAppointmentStatus(appointment.workflowStatus)}
                  </p>
                  <CartPrimaryLink
                    href="/book-an-appointment"
                    className="w-full min-w-[180px] md:w-auto"
                  >
                    Book Another
                  </CartPrimaryLink>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {data.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4 pt-2">
          <CartOutlineButton
            type="button"
            className="w-auto min-w-[120px]"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </CartOutlineButton>
          <p className="font-gill text-sm font-light leading-110 text-neutral500">
            Page {data.currentPage} of {data.totalPages}
          </p>
          <CartOutlineButton
            type="button"
            className="w-auto min-w-[120px]"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </CartOutlineButton>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileAppointmentsSection;
