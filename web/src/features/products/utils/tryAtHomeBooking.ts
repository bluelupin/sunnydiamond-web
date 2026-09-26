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

function getModifyDeadlineDate(requestedDate: string): Date | null {
  const bookingDate = parseBookingDate(requestedDate);
  if (!bookingDate) {
    return null;
  }

  const deadline = new Date(bookingDate);
  deadline.setDate(deadline.getDate() - APPOINTMENT_MODIFY_DEADLINE_DAYS);
  return deadline;
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

/** Figma success: "You can add more items till Friday, 12 May 2026" */
export const formatTryAtHomeAddItemsDeadline = (date: string): string => {
  const deadline = getModifyDeadlineDate(date);
  if (!deadline) {
    return "";
  }

  const day = deadline.toLocaleDateString("en-IN", BOOKING_WEEKDAY_DISPLAY);
  const datePart = deadline.toLocaleDateString("en-IN", BOOKING_DATE_PART_DISPLAY);
  return `${day}, ${datePart}`;
};

/** Listing note: "Appointment can be rescheduled before {date}" — date only. */
export const formatTryAtHomeRescheduleDeadline = (date: string): string => {
  const deadline = getModifyDeadlineDate(date);
  if (!deadline) {
    return "";
  }

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
