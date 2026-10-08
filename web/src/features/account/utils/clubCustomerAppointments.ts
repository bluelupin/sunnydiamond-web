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

function appointmentNotesLine(appointment: ProfileAppointmentUi): string {
  return (typeof appointment.notes === "string" ? appointment.notes : String(appointment.notes ?? ""))
    .trim();
}

function appendDistinctNoteLines(existingLines: string[], incomingText: string): string[] {
  const lines = [...existingLines];

  for (const part of incomingText.split(/\r?\n/)) {
    const line = part.trim();
    if (line && !lines.includes(line)) {
      lines.push(line);
    }
  }

  return lines;
}

/** Append distinct note lines when clubbing multiple bookings on the same slot. */
function mergeClubbedAppointmentNotes(
  existing: ProfileAppointmentUi,
  incoming: ProfileAppointmentUi,
): void {
  const incomingText = appointmentNotesLine(incoming);
  if (!incomingText) {
    return;
  }

  const lines = appendDistinctNoteLines(
    appointmentNotesLine(existing)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
    incomingText,
  );

  existing.notes = lines.join("\n");

  if (existing.type === "store_visit") {
    const incomingRequirement = (incoming.yourRequirement ?? incomingText).trim();
    const requirementLines = appendDistinctNoteLines(
      (existing.yourRequirement ?? "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
      incomingRequirement,
    );

    if (requirementLines.length > 0) {
      existing.yourRequirement = requirementLines.join("\n");
    }
  }
}

function mergeNotesByAppointmentGroupId(
  appointments: ProfileAppointmentUi[],
): Map<string, string> {
  const byGroup = new Map<string, string[]>();

  for (const appointment of appointments) {
    const groupId = appointment.appointmentGroupId?.trim();
    if (!groupId) {
      continue;
    }

    const lines = byGroup.get(groupId) ?? [];
    byGroup.set(
      groupId,
      appendDistinctNoteLines(lines, appointmentNotesLine(appointment)),
    );
  }

  return new Map(
    [...byGroup.entries()].map(([groupId, lines]) => [groupId, lines.join("\n")]),
  );
}

function applyMergedGroupNotes(
  appointment: ProfileAppointmentUi,
  notesByGroupId: Map<string, string>,
): ProfileAppointmentUi {
  const groupId = appointment.appointmentGroupId?.trim();
  if (!groupId) {
    return appointment;
  }

  const mergedNotes = notesByGroupId.get(groupId)?.trim();
  if (!mergedNotes) {
    return appointment;
  }

  if (appointment.type === "store_visit") {
    return {
      ...appointment,
      notes: mergedNotes,
      yourRequirement: mergedNotes,
    };
  }

  return { ...appointment, notes: mergedNotes };
}

export function clubProfileAppointments(
  appointments: ProfileAppointmentUi[],
): ProfileAppointmentUi[] {
  const notesByGroupId = mergeNotesByAppointmentGroupId(appointments);
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

    mergeClubbedAppointmentNotes(existing, appointment);

    if (appointment.appointmentGroupId?.trim() && !existing.appointmentGroupId?.trim()) {
      existing.appointmentGroupId = appointment.appointmentGroupId;
    }

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

  return Array.from(grouped.values()).map((appointment) =>
    applyMergedGroupNotes(appointment, notesByGroupId),
  );
}
