import type { ProfileAppointmentUi } from "../types/profileUi.types";

function normalizeClubPart(value?: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

function getAppointmentAddressClubKey(appointment: ProfileAppointmentUi): string {
  if (appointment.appointmentAddress) {
    const a = appointment.appointmentAddress;
    return [
      normalizeClubPart(a.addressLine1),
      normalizeClubPart(a.addressLine2),
      normalizeClubPart(a.city),
      normalizeClubPart(a.state),
      normalizeClubPart(a.pincode),
    ].join("|");
  }

  if (appointment.storeVisit) {
    return [
      normalizeClubPart(appointment.storeVisit.city),
      ...appointment.storeVisit.lines.map(normalizeClubPart),
    ].join("|");
  }

  return "";
}

/**
 * Open (cancellable/reschedulable) vs closed (cancelled/completed) must not share a club key,
 * otherwise a re-book on the same slot merges into the cancelled card.
 */
function getAppointmentClubLifecycle(appointment: ProfileAppointmentUi): "open" | "closed" {
  if (appointment.canCancel || appointment.canReschedule) {
    return "open";
  }
  return "closed";
}

/**
 * Same type + date + time + address (or showroom) → one clubbed list item.
 * Video calls club on date + time (address key is empty); try-at-home / store visit
 * also include address. Cancelled/completed rows never club with an active booking
 * on the same slot.
 */
export function getAppointmentClubKey(appointment: ProfileAppointmentUi): string {
  return [
    appointment.type,
    getAppointmentClubLifecycle(appointment),
    normalizeClubPart(appointment.requestedDate),
    normalizeClubPart(appointment.bookingTime),
    getAppointmentAddressClubKey(appointment),
  ].join("::");
}

export function clubProfileAppointments(
  appointments: ProfileAppointmentUi[],
): ProfileAppointmentUi[] {
  const grouped = new Map<string, ProfileAppointmentUi>();

  for (const appointment of appointments) {
    const key = getAppointmentClubKey(appointment);
    const existing = grouped.get(key);

    if (!existing) {
      grouped.set(key, {
        ...appointment,
        products: [...appointment.products],
        clubbedAppointmentIds: [appointment.id],
      });
      continue;
    }

    const productIds = new Set(existing.products.map((product) => product.id));
    for (const product of appointment.products) {
      if (!productIds.has(product.id)) {
        existing.products.push(product);
        productIds.add(product.id);
      }
    }

    existing.clubbedAppointmentIds = [
      ...(existing.clubbedAppointmentIds ?? [existing.id]),
      appointment.id,
    ];

    if (appointment.canCancel === false) {
      existing.canCancel = false;
    }
    if (appointment.canReschedule === false) {
      existing.canReschedule = false;
    }
    if (appointment.rescheduleLimitReached) {
      existing.rescheduleLimitReached = true;
    }
  }

  return Array.from(grouped.values());
}
