import { formatCustomerFullName, splitProfileFullName } from "@/shared/utils/customerName";

export { formatCustomerFullName, splitProfileFullName };

export function getProfileAvatarInitial(firstName?: string | null): string {
  const visible = formatCustomerFullName(firstName);
  if (!visible) {
    return "?";
  }

  return visible.charAt(0).toUpperCase();
}

export function formatOrderStatus(status: string): string {
  return status
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const ORDER_DATE_DISPLAY: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

const FORMATTED_ORDER_DATE_PATTERN = /^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/;

function parseOrderDateValue(value: string): Date | null {
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

  const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(trimmed);
  if (slashMatch) {
    const day = Number(slashMatch[1]);
    const month = Number(slashMatch[2]);
    const year = Number(slashMatch[3]);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  return null;
}

export function formatOrderDate(orderDate: string): string {
  const trimmed = orderDate.trim();

  if (!trimmed) {
    return orderDate;
  }

  if (FORMATTED_ORDER_DATE_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const date = parseOrderDateValue(trimmed);

  if (!date) {
    return trimmed;
  }

  return date.toLocaleDateString("en-IN", ORDER_DATE_DISPLAY);
}

/** Figma mobile order meta — e.g. "28 Oct 2026". */
export function formatOrderDateMobileMeta(orderDate: string): string {
  const trimmed = orderDate.trim();

  if (!trimmed) {
    return orderDate;
  }

  const date = parseOrderDateValue(trimmed);

  if (!date) {
    return trimmed;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** True once the calendar day of `value` has fully passed; unreadable dates are never past. */
export function isOrderDateBeforeToday(value: string, now = new Date()): boolean {
  const date = parseOrderDateValue(value);
  if (!date) {
    return false;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() < today.getTime();
}

export function formatOrderTotal(amount: number, currency: string): string {
  const roundedAmount = Math.round(amount);
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedAmount);

  if (currency === "INR") {
    return `₹${formattedAmount}`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedAmount);
}

export function formatAddressLines(lines: string[]): string {
  return lines.filter(Boolean).join(", ");
}

export function formatAppointmentDate(requestedDate: string): string {
  const trimmed = requestedDate.trim();
  if (!trimmed) {
    return requestedDate;
  }

  const date = parseOrderDateValue(trimmed);
  if (!date) {
    return trimmed;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatAppointmentFormTag(formTag: string): string {
  return formTag
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatAppointmentStatus(status: string): string {
  return formatOrderStatus(status);
}

