import { parseAppointmentBookingDate } from "./tryAtHomeBooking";
import {
  parseAppointmentSlotStartMinutes,
} from "@/shared/utils/appointmentTimeSlots";

export { parseAppointmentSlotStartMinutes } from "@/shared/utils/appointmentTimeSlots";

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
