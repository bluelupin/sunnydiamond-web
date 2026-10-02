import type { AppointmentBookingWindow } from "@/shared/utils/appointmentTimeSlots";

/** First selectable appointment day is today + this many calendar days. */
export const APPOINTMENT_MIN_DAYS_AHEAD = 3;

const sharedAppointmentLeadTime: Pick<
  AppointmentBookingWindow,
  "minNoticeMinutes" | "minDaysAhead"
> = {
  minNoticeMinutes: 0,
  minDaysAhead: APPOINTMENT_MIN_DAYS_AHEAD,
};

export const STORE_VISIT_BOOKING_WINDOW: AppointmentBookingWindow = {
  ...sharedAppointmentLeadTime,
  maxDaysAhead: 60,
};

export const VIDEO_CALL_BOOKING_WINDOW: AppointmentBookingWindow = {
  ...sharedAppointmentLeadTime,
  maxDaysAhead: 30,
};

export const TRY_AT_HOME_BOOKING_WINDOW: AppointmentBookingWindow = {
  ...sharedAppointmentLeadTime,
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

export const APPOINTMENT_COUNTRY_CODES = [
  { code: "+91", country: "IN" },
  { code: "+1", country: "US" },
  { code: "+44", country: "GB" },
] as const;

/** Default country code for phone inputs (India). */
export const DEFAULT_COUNTRY_CODE = APPOINTMENT_COUNTRY_CODES[0].code;

export const appointmentFieldClassName =
  "h-14 w-full bg-[#F2F2F2] px-3 font-gill text-base leading-110 text-darkblack placeholder:text-[#999999] outline-none";

export const appointmentLabelClassName = "font-gill text-base leading-110 text-darkblack";
