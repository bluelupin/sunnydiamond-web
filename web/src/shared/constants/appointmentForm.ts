import type { AppointmentBookingWindow } from "@/shared/utils/appointmentTimeSlots";

export const STORE_VISIT_BOOKING_WINDOW: AppointmentBookingWindow = {
  minNoticeMinutes: 2 * 60,
  maxDaysAhead: 60,
};

export const VIDEO_CALL_BOOKING_WINDOW: AppointmentBookingWindow = {
  minNoticeMinutes: 2 * 60,
  maxDaysAhead: 30,
};

export const TRY_AT_HOME_BOOKING_WINDOW: AppointmentBookingWindow = {
  minNoticeMinutes: 48 * 60,
  maxDaysAhead: 30,
};

export const APPOINTMENT_TIME_SLOTS = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
] as const;

import {
  DEFAULT_COUNTRY_CODE,
  PHONE_COUNTRY_ENTRIES,
  type PhoneCountryEntry,
} from "./phoneCountryCodes";

export { DEFAULT_COUNTRY_CODE };

/** Phone country dropdown (195 sovereign states; ISO + E.164). India is listed first. */
export const APPOINTMENT_COUNTRY_CODES: readonly PhoneCountryEntry[] = PHONE_COUNTRY_ENTRIES;

/** Figma 4903:44932 — Neutrals/200 fill; Neutrals/600 1px border on focus. */
export const appointmentFieldClassName =
  "h-14 w-full border border-transparent bg-[#F2F2F2] px-3 font-gill text-base leading-110 text-darkblack placeholder:text-[#999999] outline-none focus:border-darkblack";

export const appointmentLabelClassName = "font-gill text-base leading-110 text-darkblack";

/** Figma 4903:37722 — time slot button grid (all appointment flows). */
export const appointmentTimeSlotButtonBaseClassName =
  "flex h-14 min-w-0 flex-1 items-center justify-center px-3 font-gill text-base leading-110";

/** Figma 4903:37722 — Neutrals/200 fill, Neutrals/400 t3-16-Regular. */
export const appointmentTimeSlotUnselectedClassName =
  "bg-aboutInactive font-normal text-gray600";

export const appointmentTimeSlotDisabledClassName =
  "cursor-not-allowed bg-aboutInactive font-normal text-gray600 opacity-40";

export const appointmentTimeSlotSelectedGoldClassName =
  "bg-gold300 font-normal text-darkblack";

export const appointmentTimeSlotSelectedDarkClassName =
  "bg-darkblack font-normal text-white";
