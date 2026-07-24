import { formatCartPrice } from "@/features/cart/utils/formatCartLine";

export function formatOrderStatus(status: string): string {
  return status
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatOrderDate(orderDate: string): string {
  const date = new Date(orderDate);

  if (Number.isNaN(date.getTime())) {
    return orderDate;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatOrderTotal(amount: number, currency: string): string {
  if (currency === "INR") {
    return formatCartPrice(amount);
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAddressLines(lines: string[]): string {
  return lines.filter(Boolean).join(", ");
}

export function formatAppointmentDate(requestedDate: string): string {
  // API sends YYYY-MM-DD — parse as local calendar date to avoid UTC shift.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(requestedDate.trim());
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

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

