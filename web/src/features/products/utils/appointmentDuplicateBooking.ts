import { getCustomerAppointments } from "@/services/customer/customer-appointments.client";
import type { CustomerAppointment } from "@/services/customer/customer-appointments.types";
import {
  normalizeAppointmentDateInput,
  type TryAtHomeSlotAddress,
} from "@/features/products/utils/tryAtHomeBooking";

export const DUPLICATE_APPOINTMENT_TOAST = "Product already added to appointment";
export const DUPLICATE_APPOINTMENT_VIEW_LABEL = "VIEW";

type AppointmentBookingKind = "store_visit" | "video_call" | "try_at_home";

export type AppointmentDuplicateCandidate = {
  kind: AppointmentBookingKind;
  productId: string;
  date: string;
  selectedSlot: string | null;
  /** Try at Home only. */
  address?: TryAtHomeSlotAddress;
  /** Store Visit only — the showroom documentId sent as `preferredShowroom`. */
  showroomId?: string;
};

function normalizePart(value?: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

/** Same classification as the My Appointments listing. */
function inferBookingKind(formTag: string): AppointmentBookingKind {
  const normalized = formTag.toLowerCase();
  if (normalized.includes("video")) return "video_call";
  if (normalized.includes("home") || normalized.includes("try")) return "try_at_home";
  return "store_visit";
}

function isCancelled(status?: string | null): boolean {
  return normalizePart(status).includes("cancel");
}

// State is not persisted on product-submissions, so it is left out of the match.
function addressKey(address: {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  pincode?: string | null;
}): string {
  return [address.addressLine1, address.addressLine2, address.city, address.pincode]
    .map(normalizePart)
    .join("|");
}

function hasActiveProduct(appointment: CustomerAppointment, productId: string): boolean {
  if (appointment.products.length > 0) {
    return appointment.products.some(
      (product) =>
        normalizePart(product.productId) === productId && !isCancelled(product.workflowStatus),
    );
  }

  return normalizePart(appointment.productId) === productId;
}

function findDuplicateAppointmentBooking(
  appointments: CustomerAppointment[],
  candidate: AppointmentDuplicateCandidate,
): CustomerAppointment | null {
  const productId = normalizePart(candidate.productId);
  const date = normalizeAppointmentDateInput(candidate.date);
  const slot = normalizePart(candidate.selectedSlot);

  if (!productId || !date || !slot) {
    return null;
  }

  return (
    appointments.find((appointment) => {
      if (inferBookingKind(appointment.formTag) !== candidate.kind) return false;
      if (isCancelled(appointment.workflowStatus)) return false;
      if (normalizeAppointmentDateInput(appointment.requestedDate) !== date) return false;
      if (normalizePart(appointment.selectedTimeSlot) !== slot) return false;

      if (candidate.kind === "try_at_home") {
        if (!candidate.address || addressKey(appointment) !== addressKey(candidate.address)) {
          return false;
        }
      }

      if (candidate.kind === "store_visit") {
        const showroomId = normalizePart(candidate.showroomId);
        if (!showroomId || normalizePart(appointment.preferredShowroom?.documentId) !== showroomId) {
          return false;
        }
      }

      return hasActiveProduct(appointment, productId);
    }) ?? null
  );
}

/** Signed-in customers only; a failed lookup never blocks the booking. */
export async function hasDuplicateAppointmentBooking(
  candidate: AppointmentDuplicateCandidate,
): Promise<boolean> {
  try {
    const page = await getCustomerAppointments(1, 100);
    if (!page?.appointments?.length) {
      return false;
    }

    return findDuplicateAppointmentBooking(page.appointments, candidate) != null;
  } catch {
    return false;
  }
}
