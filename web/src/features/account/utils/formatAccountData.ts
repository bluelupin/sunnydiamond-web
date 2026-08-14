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

export function formatOrderTotal(amount: number, currency: string): string {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  if (currency === "INR") {
    return `₹${formattedAmount}`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAddressLines(lines: string[]): string {
  return lines.filter(Boolean).join(", ");
}

export function formatAppointmentDate(requestedDate: string): string {
  return formatOrderDate(requestedDate);
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

