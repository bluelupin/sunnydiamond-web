"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { invalidFieldContainerClassName } from "@/shared/utils/formValidation";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

type AppointmentDateFieldProps = {
  id: string;
  value: string;
  minDate: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

const parseDateString = (value: string): Date | undefined => {
  if (!value) return undefined;

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const toDateValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (value: string): string => {
  const date = parseDateString(value);
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getCalendarDays = (viewMonth: Date) => {
  const monthStart = startOfMonth(viewMonth);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      date,
      inMonth: date.getMonth() === viewMonth.getMonth(),
    };
  });
};

const AppointmentDateField = ({
  id,
  value,
  minDate,
  onChange,
  onBlur,
  hasError,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: AppointmentDateFieldProps) => {
  const selectedDate = parseDateString(value);
  const minSelectableDate = parseDateString(minDate) ?? new Date();
  minSelectableDate.setHours(0, 0, 0, 0);

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => selectedDate ?? minSelectableDate);

  const monthLabel = viewMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => getCalendarDays(viewMonth), [viewMonth]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setViewMonth(selectedDate ?? minSelectableDate);
      return;
    }

    onBlur?.();
  };

  const handleSelectDate = (date: Date) => {
    onChange(toDateValue(date));
    setOpen(false);
    onBlur?.();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "relative flex h-14 w-full items-center border border-transparent bg-[#F2F2F2] px-3 text-left",
            hasError && invalidFieldContainerClassName,
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 font-gill text-base leading-110",
              value ? "text-darkblack" : "text-neutral400",
            )}
          >
            {value ? formatDisplayDate(value) : "Select date"}
          </span>
          <span className="inline-flex size-6 shrink-0 items-center justify-center" aria-hidden>
            <Image src="/images/forms/calendar.svg" alt="" width={20} height={20} />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="z-[80] w-[320px] rounded-none border-neutral300 bg-white p-4 font-gill shadow-lg"
      >
        <div className="flex items-center justify-between pb-4">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() =>
              setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
            }
            className="inline-flex size-8 items-center justify-center text-darkblack"
          >
            <ChevronLeft size={20} strokeWidth={1.25} aria-hidden />
          </button>
          <p className="font-gill text-base leading-110 text-darkblack">{monthLabel}</p>
          <button
            type="button"
            aria-label="Next month"
            onClick={() =>
              setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
            }
            className="inline-flex size-8 items-center justify-center text-darkblack"
          >
            <ChevronRight size={20} strokeWidth={1.25} aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 pb-2">
          {WEEKDAY_LABELS.map((label) => (
            <span
              key={label}
              className="flex h-8 items-center justify-center font-gill text-xs font-light leading-110 text-neutral500"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ date, inMonth }) => {
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);

            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            const isToday = isSameDay(date, new Date());
            const isDisabled = normalizedDate < minSelectableDate;

            return (
              <button
                key={toDateValue(date)}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelectDate(date)}
                className={cn(
                  "flex h-9 items-center justify-center font-gill text-sm leading-110 transition-colors",
                  !inMonth && "text-neutral400",
                  inMonth && !isSelected && !isDisabled && "text-darkblack hover:bg-aboutInactive",
                  isSelected && "bg-[#DECAA0] font-normal text-darkblack",
                  isToday && !isSelected && "ring-1 ring-inset ring-neutral300",
                  isDisabled && "cursor-not-allowed text-neutral400 opacity-40",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AppointmentDateField;
