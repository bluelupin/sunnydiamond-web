import { parseAppointmentBookingDate } from "./tryAtHomeBooking";

/**
 * Parse the start clock time from a slot label like "10:00 AM - 11:00 AM"
 * or "9:00 AM". Returns null when unparsable.
 */
export function parseAppointmentSlotStartMinutes(slot: string): number | null {
  const match = slot
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/** Spec: cancel stays enabled until 1 minute before the scheduled start. */
export function canCancelAppointmentUntilOneMinuteBefore(
  requestedDate: string,
  selectedTimeSlot: string,
  referenceDate = new Date(),
): boolean {
  const bookingDate = parseAppointmentBookingDate(requestedDate);
  const startMinutes = parseAppointmentSlotStartMinutes(selectedTimeSlot);

  if (!bookingDate || startMinutes == null) {
    return Boolean(requestedDate.trim());
  }

  const start = new Date(
    bookingDate.getFullYear(),
    bookingDate.getMonth(),
    bookingDate.getDate(),
    Math.floor(startMinutes / 60),
    startMinutes % 60,
    0,
    0,
  );

  const cancelDeadline = new Date(start.getTime() - 60_000);
  return referenceDate.getTime() < cancelDeadline.getTime();
}
