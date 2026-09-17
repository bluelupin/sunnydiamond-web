export type TryAtHomeBookingSummary = {
  date: string;
  selectedSlot: string | null;
};

const BOOKING_DATE_DISPLAY: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

/** Booking changes (add items, reschedule) allowed until this many days before the appointment. */
export const APPOINTMENT_MODIFY_DEADLINE_DAYS = 3;

function parseBookingDate(value: string): Date | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (isoMatch) {
    const date = new Date(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3]),
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function parseAppointmentBookingDate(value: string): Date | null {
  return parseBookingDate(value);
}

export function normalizeAppointmentDateInput(value: string): string {
  const bookingDate = parseBookingDate(value);

  if (!bookingDate) {
    return "";
  }

  const year = bookingDate.getFullYear();
  const month = String(bookingDate.getMonth() + 1).padStart(2, "0");
  const day = String(bookingDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDaysUntilAppointment(
  bookingDate: Date,
  referenceDate = new Date(),
): number {
  const reference = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const booking = new Date(
    bookingDate.getFullYear(),
    bookingDate.getMonth(),
    bookingDate.getDate(),
  );

  return Math.round((booking.getTime() - reference.getTime()) / 86_400_000);
}

export function canModifyAppointmentBeforeDeadline(
  requestedDate: string,
  referenceDate = new Date(),
): boolean {
  const bookingDate = parseBookingDate(requestedDate);
  if (!bookingDate) {
    return false;
  }

  return (
    getDaysUntilAppointment(bookingDate, referenceDate) >= APPOINTMENT_MODIFY_DEADLINE_DAYS
  );
}

export const formatTryAtHomeBookingLabel = ({
  date,
  selectedSlot,
}: TryAtHomeBookingSummary): string => {
  const bookingDate = parseBookingDate(date);
  const timeLabel = selectedSlot?.trim();

  if (!bookingDate || !timeLabel) {
    return "Booking details will be shared shortly";
  }

  const formattedDate = bookingDate.toLocaleDateString("en-IN", BOOKING_DATE_DISPLAY);

  return `Booking for: ${formattedDate}; ${timeLabel}`;
};

export const formatTryAtHomeAddItemsDeadline = (date: string): string => {
  const bookingDate = parseBookingDate(date);

  if (!bookingDate) {
    return "";
  }

  const deadline = new Date(bookingDate);
  deadline.setDate(deadline.getDate() - APPOINTMENT_MODIFY_DEADLINE_DAYS);

  return deadline.toLocaleDateString("en-IN", BOOKING_DATE_DISPLAY);
};
