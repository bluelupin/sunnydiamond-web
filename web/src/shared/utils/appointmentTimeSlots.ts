/**
 * Parse the start clock time from a slot label like "10:00 AM - 11:00 AM"
 * or "9:00 AM". Returns null when unparsable.
 */
export function parseAppointmentSlotStartMinutes(slot: string): number | null {
  const match = slot.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function parseBookingDateLocal(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

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

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export type AppointmentBookingWindow = {
  /** A slot must start at least this long after now (when {@link minDaysAhead} is not set). */
  minNoticeMinutes: number;
  /** Earliest bookable calendar day = start of today + this many days (local). */
  minDaysAhead?: number;
  /** Last bookable day, counted from today (inclusive). */
  maxDaysAhead: number;
};

/** Selectable calendar range (YYYY-MM-DD) for a booking window. */
export function getAppointmentBookingDateBounds(
  window: AppointmentBookingWindow,
  referenceDate = new Date(),
): { minDate: string; maxDate: string } {
  const today = startOfLocalDay(referenceDate);
  const earliest =
    window.minDaysAhead != null && window.minDaysAhead > 0
      ? (() => {
          const date = new Date(today);
          date.setDate(date.getDate() + window.minDaysAhead);
          return date;
        })()
      : new Date(referenceDate.getTime() + window.minNoticeMinutes * 60_000);
  const latest = new Date(today);
  latest.setDate(latest.getDate() + window.maxDaysAhead);

  return { minDate: toDateInputValue(earliest), maxDate: toDateInputValue(latest) };
}

/** True when the slot starts after now plus the required notice for the selected booking date. */
export function isAppointmentTimeSlotAvailable(
  slot: string,
  bookingDateValue: string,
  referenceDate = new Date(),
  minNoticeMinutes = 0,
): boolean {
  const bookingDate = parseBookingDateLocal(bookingDateValue);
  const startMinutes = parseAppointmentSlotStartMinutes(slot);

  if (!bookingDate || startMinutes == null) {
    return Boolean(slot.trim());
  }

  const bookingDay = startOfLocalDay(bookingDate);
  const today = startOfLocalDay(referenceDate);

  if (bookingDay.getTime() > today.getTime() && minNoticeMinutes <= 0) {
    return true;
  }

  if (bookingDay.getTime() < today.getTime()) {
    return false;
  }

  const slotStart = new Date(
    bookingDate.getFullYear(),
    bookingDate.getMonth(),
    bookingDate.getDate(),
    Math.floor(startMinutes / 60),
    startMinutes % 60,
    0,
    0,
  );

  return slotStart.getTime() > referenceDate.getTime() + minNoticeMinutes * 60_000;
}

/** Drop slots whose start time has already passed when booking for today (or a past date). */
export function filterAvailableAppointmentTimeSlots(
  slots: readonly string[],
  bookingDateValue: string,
  referenceDate = new Date(),
): string[] {
  if (!bookingDateValue.trim()) {
    return [...slots];
  }

  return slots.filter((slot) =>
    isAppointmentTimeSlotAvailable(slot, bookingDateValue, referenceDate),
  );
}
