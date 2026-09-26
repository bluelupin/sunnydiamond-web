"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  formatSuccessBookingStartTime,
  parseAppointmentBookingDate,
} from "@/features/products/utils/tryAtHomeBooking";
import {
  addPieceToCustomerAppointment,
  getOpenCustomerAppointments,
} from "@/services/customer/customer-appointments.client";
import type { CustomerOpenAppointment } from "@/services/customer/customer-appointments.types";
import { DetailDarkButton } from "./shared";

// Built from booking-panel styles; awaits OneThing design review (R-AP-1).

type AddToAppointmentNoticeProps = {
  productId: string;
  productName: string;
};

type AddState = { status: "adding" } | { status: "added" } | { status: "error"; message: string };

/** "12 Oct, 11:00 AM, Kochi" (video calls have no showroom). */
function formatAppointmentWhen(appointment: CustomerOpenAppointment): string {
  const date = parseAppointmentBookingDate(appointment.requestedDate);
  return [
    date ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "",
    formatSuccessBookingStartTime(appointment.selectedTimeSlot),
    appointment.formTag === "product-store-visit" ? appointment.showroomCity?.trim() : "",
  ]
    .filter(Boolean)
    .join(", ");
}

const AddToAppointmentNotice = ({ productId, productName }: AddToAppointmentNoticeProps) => {
  const { customer } = useAuth();
  const pathname = usePathname() ?? "/";
  const customerId = customer?.id ?? null;
  // Tagged with the customer it was fetched for, so a sign-out/in never shows another list.
  const [loaded, setLoaded] = useState<{
    customerId: number;
    appointments: CustomerOpenAppointment[];
  } | null>(null);
  const [addStates, setAddStates] = useState<Record<string, AddState>>({});

  useEffect(() => {
    if (customerId == null) {
      return;
    }

    const controller = new AbortController();
    getOpenCustomerAppointments(controller.signal)
      .then((data) => setLoaded({ customerId, appointments: data ?? [] }))
      .catch(() => {
        // Optional hint only — hide on failure.
      });

    return () => controller.abort();
  }, [customerId]);

  const appointments =
    customerId != null && loaded?.customerId === customerId ? loaded.appointments : [];

  if (appointments.length === 0) {
    return null;
  }

  const handleAdd = async (documentId: string) => {
    setAddStates((prev) => ({ ...prev, [documentId]: { status: "adding" } }));
    try {
      const result = await addPieceToCustomerAppointment(documentId, {
        productId,
        productName,
        productPath: pathname,
      });
      // Keep the list in step with the CMS; changed=false means it was already on the appointment.
      setLoaded((prev) =>
        prev && {
          ...prev,
          appointments: prev.appointments.map((item) =>
            item.documentId === documentId ? { ...item, productIds: result.data.productIds } : item,
          ),
        },
      );
      setAddStates((prev) => {
        const next = { ...prev };
        if (result.meta.changed) next[documentId] = { status: "added" };
        else delete next[documentId];
        return next;
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not add this piece. Please try again.";
      setAddStates((prev) => ({ ...prev, [documentId]: { status: "error", message } }));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {appointments.map((appointment) => {
        const kind =
          appointment.formTag === "product-video-call" ? "your video call" : "your appointment";
        const when = formatAppointmentWhen(appointment);
        const alreadyAdded = appointment.productIds.includes(productId);
        const state = addStates[appointment.documentId];

        return (
          <div
            key={appointment.documentId}
            className="flex flex-col gap-3 bg-aboutInactive p-4 font-gill text-base font-light leading-110 text-darkblack"
          >
            {state?.status === "added" ? (
              <p role="status">{"Added. We've emailed you the updated list."}</p>
            ) : alreadyAdded ? (
              <p>{`This piece is already on ${kind} on ${when}.`}</p>
            ) : (
              <>
                <p>{`Add this piece to ${kind} on ${when}`}</p>
                <DetailDarkButton
                  className="uppercase disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={state?.status === "adding"}
                  onClick={() => {
                    void handleAdd(appointment.documentId);
                  }}
                >
                  {state?.status === "adding" ? "Adding…" : "Add to Appointment"}
                </DetailDarkButton>
                {state?.status === "error" ? (
                  <p role="alert" className="text-sm">
                    {state.message}
                  </p>
                ) : null}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AddToAppointmentNotice;
