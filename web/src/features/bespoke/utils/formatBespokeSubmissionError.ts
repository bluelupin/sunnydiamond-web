import { getApiErrorMessage } from "@/shared/utils/errorHandler";
import type { AppointmentContactField } from "@/shared/utils/formValidation";

const DEFAULT_MESSAGE = "We couldn't submit your request right now. Please try again in a moment.";

const FIELD_MESSAGE_PATTERNS: Array<{ field: AppointmentContactField; pattern: RegExp }> = [
  { field: "name", pattern: /\bfullName\b/i },
  { field: "phone", pattern: /\bphone\b/i },
  { field: "email", pattern: /\bemail\b/i },
  { field: "note", pattern: /\bdesignVision\b/i },
];

export function formatBespokeSubmissionError(error: unknown): string {
  const message = getApiErrorMessage(error)?.trim();

  if (!message) {
    return DEFAULT_MESSAGE;
  }

  if (message.startsWith("Request failed with status")) {
    return DEFAULT_MESSAGE;
  }

  return message;
}

export function parseBespokeSubmissionFieldErrors(
  error: unknown,
): {
  fieldErrors: Partial<Record<AppointmentContactField, string>>;
  referenceImageError: string | null;
} {
  const message = formatBespokeSubmissionError(error);
  const fieldErrors: Partial<Record<AppointmentContactField, string>> = {};

  if (/referenceImage/i.test(message)) {
    return { fieldErrors, referenceImageError: message };
  }

  for (const { field, pattern } of FIELD_MESSAGE_PATTERNS) {
    if (pattern.test(message)) {
      fieldErrors[field] = message;
      return { fieldErrors, referenceImageError: null };
    }
  }

  return { fieldErrors, referenceImageError: null };
}
