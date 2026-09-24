export function getGiftCardDigitalDateBounds(): { minDate: string; maxDate: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const max = new Date(today);
  max.setFullYear(max.getFullYear() + 1);

  const toDateValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    minDate: toDateValue(today),
    maxDate: toDateValue(max),
  };
}
