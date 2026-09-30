/** How far ahead shoppers can schedule digital gift card delivery. */
export const GIFT_CARD_DIGITAL_DATE_RANGE_YEARS = 1;

const toDateValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Selectable delivery dates: from today through the same calendar day one year ahead. */
export function getGiftCardDigitalDateBounds(
  referenceDate = new Date(),
): { minDate: string; maxDate: string } {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const max = new Date(today);
  max.setFullYear(max.getFullYear() + GIFT_CARD_DIGITAL_DATE_RANGE_YEARS);

  return {
    minDate: toDateValue(today),
    maxDate: toDateValue(max),
  };
}

export function isGiftCardDigitalDeliveryDateInBounds(
  value: string,
  referenceDate = new Date(),
): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  const parsed = new Date(`${trimmed}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  parsed.setHours(0, 0, 0, 0);
  const { minDate, maxDate } = getGiftCardDigitalDateBounds(referenceDate);
  const min = new Date(`${minDate}T00:00:00`);
  const max = new Date(`${maxDate}T00:00:00`);

  return parsed.getTime() >= min.getTime() && parsed.getTime() <= max.getTime();
}
