import { parseAppointmentSlotStartMinutes } from "@/shared/utils/appointmentTimeSlots";

export type TryAtHomeBookingSummary = {
  date: string;
  selectedSlot: string | null;
};

const BOOKING_WEEKDAY_DISPLAY: Intl.DateTimeFormatOptions = {
  weekday: "long",
};

const BOOKING_DATE_PART_DISPLAY: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

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

type AppointmentModifyDeadline = {
  deadline: Date;
  /** False when the slot has no readable start time; the deadline is then date-only. */
  hasTime: boolean;
};

/**
 * Booking changes (add items, reschedule) are allowed until the slot start minus the booking
 * notice (client rule: 2 h store visit / video call, 48 h Try at Home). Without a readable
 * slot time the appointment day's start is used.
 */
function getModifyDeadline(
  requestedDate: string,
  selectedSlot: string | null | undefined,
  minNoticeMinutes: number,
): AppointmentModifyDeadline | null {
  const bookingDate = parseBookingDate(requestedDate);
  if (!bookingDate) {
    return null;
  }

  const startMinutes = parseAppointmentSlotStartMinutes(selectedSlot ?? "");
  const start = new Date(
    bookingDate.getFullYear(),
    bookingDate.getMonth(),
    bookingDate.getDate(),
    startMinutes == null ? 0 : Math.floor(startMinutes / 60),
    startMinutes == null ? 0 : startMinutes % 60,
  );

  return {
    deadline: new Date(start.getTime() - minNoticeMinutes * 60_000),
    hasTime: startMinutes != null,
  };
}

/** Rescheduling uses the original three-calendar-day cutoff. */
export const APPOINTMENT_MODIFY_DEADLINE_DAYS = 3;

export function canModifyAppointmentBeforeDeadline(
  requestedDate: string,
  referenceDate = new Date(),
): boolean {
  const bookingDate = parseBookingDate(requestedDate);
  return bookingDate != null && getDaysUntilAppointment(bookingDate, referenceDate) >= APPOINTMENT_MODIFY_DEADLINE_DAYS;
}

function formatDeadlineTime(date: Date): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours % 12 || 12}:${minutes} ${hours < 12 ? "AM" : "PM"}`;
}

function formatModifyDeadline(
  requestedDate: string,
  selectedSlot: string | null | undefined,
  minNoticeMinutes: number,
  includeWeekday: boolean,
  includeTime = true,
): string {
  const modifyDeadline = getModifyDeadline(requestedDate, selectedSlot, minNoticeMinutes);
  if (!modifyDeadline) {
    return "";
  }

  const { deadline, hasTime } = modifyDeadline;
  const datePart = deadline.toLocaleDateString("en-IN", BOOKING_DATE_PART_DISPLAY);
  const dateLabel = includeWeekday
    ? `${deadline.toLocaleDateString("en-IN", BOOKING_WEEKDAY_DISPLAY)}, ${datePart}`
    : datePart;
  return includeTime && hasTime ? `${dateLabel}, ${formatDeadlineTime(deadline)}` : dateLabel;
}

/** Figma success: "Booking for: Sunday, 14 May 2026; 12:00 PM" (start time only). */
export const formatTryAtHomeBookingLabel = ({
  date,
  selectedSlot,
}: TryAtHomeBookingSummary): string => {
  const bookingDate = parseBookingDate(date);
  const timeLabel = formatSuccessBookingStartTime(selectedSlot);

  if (!bookingDate || !timeLabel) {
    return "Booking details will be shared shortly";
  }

  const day = bookingDate.toLocaleDateString("en-IN", BOOKING_WEEKDAY_DISPLAY);
  const datePart = bookingDate.toLocaleDateString("en-IN", BOOKING_DATE_PART_DISPLAY);

  return `Booking for: ${day}, ${datePart}; ${timeLabel}`;
};

/** Success screen: show "9:00 AM" from "9:00 AM - 10:00 AM". */
export function formatSuccessBookingStartTime(selectedSlot: string | null | undefined): string {
  const trimmed = selectedSlot?.trim() ?? "";
  if (!trimmed) {
    return "";
  }

  const rangeSplit = trimmed.split(/\s*[-–—]\s*/);
  return (rangeSplit[0] ?? trimmed).trim();
}

/** Figma success: "You can add more items till Friday, 12 May 2026" (date only). */
export const formatTryAtHomeAddItemsDeadline = (
  date: string,
  selectedSlot: string | null | undefined,
  minNoticeMinutes: number,
): string => formatModifyDeadline(date, selectedSlot, minNoticeMinutes, true, false);

/** Listing note: "Appointment can be rescheduled before {date}" (date only). */
export const formatTryAtHomeRescheduleDeadline = (
  date: string,
): string => {
  const deadline = parseBookingDate(date);
  if (!deadline) return "";
  deadline.setDate(deadline.getDate() - APPOINTMENT_MODIFY_DEADLINE_DAYS);
  return deadline.toLocaleDateString("en-IN", BOOKING_DATE_PART_DISPLAY);
};

export type TryAtHomeSlotAddress = {
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  city: string;
  state?: string;
};

function normalizeClubPart(value?: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

function isTryAtHomeFormTag(formTag: string): boolean {
  const normalized = formTag.trim().toLowerCase();
  return normalized.includes("try") || normalized.includes("home");
}

function isCancelledWorkflowStatus(status: string): boolean {
  return status.trim().toLowerCase().includes("cancel");
}

/**
 * Count other Try at Home products already booked for the same date + time + address.
 * Used on the success screen: "Your booking has N more items".
 */
export function countAdditionalTryAtHomeItemsForSlot(
  appointments: Array<{
    formTag: string;
    workflowStatus: string;
    requestedDate: string;
    selectedTimeSlot: string;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    productId: string | null;
    productName: string | null;
    products: Array<{ productId: string | null; productName: string | null }>;
  }>,
  slot: {
    date: string;
    selectedSlot: string | null;
    address: TryAtHomeSlotAddress;
    /** Exclude the product just booked so the count is "more items", not total. */
    currentProductId?: string;
  },
): number {
  const targetDate = normalizeAppointmentDateInput(slot.date);
  const targetTime = normalizeClubPart(slot.selectedSlot);
  // State is collected in the form but not persisted on product-submissions, so omit it.
  const targetAddress = [
    normalizeClubPart(slot.address.addressLine1),
    normalizeClubPart(slot.address.addressLine2),
    normalizeClubPart(slot.address.city),
    normalizeClubPart(slot.address.pincode),
  ].join("|");
  const currentProductId = slot.currentProductId?.trim() ?? "";

  if (!targetDate || !targetTime) {
    return 0;
  }

  let moreItems = 0;

  for (const appointment of appointments) {
    if (!isTryAtHomeFormTag(appointment.formTag)) continue;
    if (isCancelledWorkflowStatus(appointment.workflowStatus)) continue;

    const date = normalizeAppointmentDateInput(appointment.requestedDate);
    const time = normalizeClubPart(appointment.selectedTimeSlot);
    const address = [
      normalizeClubPart(appointment.addressLine1),
      normalizeClubPart(appointment.addressLine2),
      normalizeClubPart(appointment.city),
      normalizeClubPart(appointment.pincode),
    ].join("|");

    if (date !== targetDate || time !== targetTime || address !== targetAddress) {
      continue;
    }

    const products =
      appointment.products.length > 0
        ? appointment.products
        : appointment.productId || appointment.productName
          ? [{ productId: appointment.productId, productName: appointment.productName }]
          : [];

    for (const product of products) {
      const productId = product.productId?.trim() ?? "";
      if (currentProductId && productId && productId === currentProductId) {
        continue;
      }
      moreItems += 1;
    }
  }

  return moreItems;
}

/**
 * Count other video call products already booked for the same date + time
 * (video calls have no address — same rule as Profile > Appointments clubbing).
 * Used on the success screen: "Your booking has N more items".
 */
export function countAdditionalVideoCallItemsForSlot(
  appointments: Parameters<typeof countAdditionalTryAtHomeItemsForSlot>[0],
  slot: {
    date: string;
    selectedSlot: string | null;
    /** Exclude the product just booked so the count is "more items", not total. */
    currentProductId?: string;
  },
): number {
  const targetDate = normalizeAppointmentDateInput(slot.date);
  const targetTime = normalizeClubPart(slot.selectedSlot);
  const currentProductId = slot.currentProductId?.trim() ?? "";

  if (!targetDate || !targetTime) {
    return 0;
  }

  let moreItems = 0;

  for (const appointment of appointments) {
    if (!appointment.formTag.trim().toLowerCase().includes("video")) continue;
    if (isCancelledWorkflowStatus(appointment.workflowStatus)) continue;

    const date = normalizeAppointmentDateInput(appointment.requestedDate);
    const time = normalizeClubPart(appointment.selectedTimeSlot);

    if (date !== targetDate || time !== targetTime) {
      continue;
    }

    const products =
      appointment.products.length > 0
        ? appointment.products
        : appointment.productId || appointment.productName
          ? [{ productId: appointment.productId, productName: appointment.productName }]
          : [];

    for (const product of products) {
      const productId = product.productId?.trim() ?? "";
      if (currentProductId && productId && productId === currentProductId) {
        continue;
      }
      moreItems += 1;
    }
  }

  return moreItems;
}
