export type TryAtHomeBookingSummary = {
  date: string;
  selectedSlot: string | null;
};

export const formatTryAtHomeBookingLabel = ({
  date,
  selectedSlot,
}: TryAtHomeBookingSummary): string => {
  if (!date) {
    return "Booking details will be shared shortly";
  }

  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeLabel = selectedSlot?.split(" - ")[0] ?? "12:00 PM";

  return `Booking for: ${formattedDate}; ${timeLabel}`;
};

export const formatTryAtHomeAddItemsDeadline = (date: string): string => {
  if (!date) {
    return "";
  }

  const bookingDate = new Date(`${date}T00:00:00`);
  const deadline = new Date(bookingDate);
  deadline.setDate(deadline.getDate() - 2);

  return deadline.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
