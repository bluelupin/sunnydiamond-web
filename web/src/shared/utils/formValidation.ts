export type FieldValidation = {
  valid: boolean;
  error?: string;
};

export const formFieldErrorClassName = "font-gill text-sm leading-110 text-[#B42318]";

export const validateRequiredName = (value: string): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, error: "Name is required" };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: "Enter at least 2 characters" };
  }

  if (trimmed.length > 80) {
    return { valid: false, error: "Name is too long" };
  }

  if (!/^[\p{L}\s'.-]+$/u.test(trimmed)) {
    return { valid: false, error: "Enter a valid name" };
  }

  return { valid: true };
};

export const validatePhone = (value: string, countryCode: string): FieldValidation => {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return { valid: false, error: "Phone number is required" };
  }

  if (countryCode === "+91") {
    if (!/^[6-9]\d{9}$/.test(digits)) {
      return { valid: false, error: "Enter a valid 10-digit mobile number" };
    }
    return { valid: true };
  }

  if (countryCode === "+1") {
    if (!/^\d{10}$/.test(digits)) {
      return { valid: false, error: "Enter a valid 10-digit phone number" };
    }
    return { valid: true };
  }

  if (countryCode === "+44") {
    if (digits.length < 10 || digits.length > 11) {
      return { valid: false, error: "Enter a valid UK phone number" };
    }
    return { valid: true };
  }

  if (digits.length < 7 || digits.length > 15) {
    return { valid: false, error: "Enter a valid phone number" };
  }

  return { valid: true };
};

export const validateOptionalEmail = (value: string): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: true };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { valid: false, error: "Enter a valid email address" };
  }

  return { valid: true };
};

export const validateOptionalDate = (value: string): FieldValidation => {
  if (!value) {
    return { valid: true };
  }

  const selected = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(selected.getTime())) {
    return { valid: false, error: "Enter a valid date" };
  }

  if (selected < today) {
    return { valid: false, error: "Date cannot be in the past" };
  }

  return { valid: true };
};

export const validateIndianPincode = (value: string): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, error: "Pincode is required" };
  }

  if (!/^\d{6}$/.test(trimmed)) {
    return { valid: false, error: "Enter a valid 6-digit pincode" };
  }

  if (trimmed.startsWith("0")) {
    return { valid: false, error: "Enter a valid Indian pincode" };
  }

  return { valid: true };
};

export const validateCity = (value: string): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, error: "City is required" };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: "Enter at least 2 characters" };
  }

  if (!/^[\p{L}\s'.-]+$/u.test(trimmed)) {
    return { valid: false, error: "Enter a valid city name" };
  }

  return { valid: true };
};

export const validateAddressLine1 = (value: string): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, error: "Address is required" };
  }

  if (trimmed.length < 5) {
    return { valid: false, error: "Enter a complete address" };
  }

  if (trimmed.length > 120) {
    return { valid: false, error: "Address is too long" };
  }

  return { valid: true };
};

export const validateOptionalAddressLine2 = (value: string): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: true };
  }

  if (trimmed.length > 120) {
    return { valid: false, error: "Address line is too long" };
  }

  return { valid: true };
};

export const validateIndianState = (
  value: string,
  states: readonly string[],
): FieldValidation => {
  if (!value) {
    return { valid: false, error: "Select a state" };
  }

  if (!states.includes(value)) {
    return { valid: false, error: "Select a valid state" };
  }

  return { valid: true };
};

export const validateOptionalNote = (value: string, maxLength = 500): FieldValidation => {
  if (value.length > maxLength) {
    return { valid: false, error: `Keep your message under ${maxLength} characters` };
  }

  return { valid: true };
};

export const validateRequiredNote = (value: string, maxLength = 500): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, error: "This field is required" };
  }

  if (trimmed.length < 10) {
    return { valid: false, error: "Enter at least 10 characters" };
  }

  if (value.length > maxLength) {
    return { valid: false, error: `Keep your message under ${maxLength} characters` };
  }

  return { valid: true };
};

export const validateRequiredSelection = (
  value: string,
  label = "option",
): FieldValidation => {
  if (!value.trim()) {
    return { valid: false, error: `Select a ${label}` };
  }

  return { valid: true };
};

export const invalidFieldClassName = "border border-[#B42318]";

export type AppointmentContactValues = {
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  date: string;
  note: string;
  purpose?: string;
};

export type AppointmentContactValidationOptions = {
  noteRequired?: boolean;
  validatePurpose?: boolean;
};

export type AppointmentContactField =
  | "name"
  | "phone"
  | "email"
  | "date"
  | "note"
  | "purpose";

export const getAppointmentContactErrors = (
  values: AppointmentContactValues,
  options: AppointmentContactValidationOptions = {},
): Record<AppointmentContactField, string | undefined> => {
  const noteValidation = options.noteRequired
    ? validateRequiredNote(values.note)
    : validateOptionalNote(values.note);

  return {
    name: validateRequiredName(values.name).error,
    phone: validatePhone(values.phone, values.countryCode).error,
    email: validateOptionalEmail(values.email).error,
    date: validateOptionalDate(values.date).error,
    note: noteValidation.error,
    purpose: options.validatePurpose
      ? validateRequiredSelection(values.purpose ?? "", "purpose").error
      : undefined,
  };
};

export const isAppointmentContactValid = (
  values: AppointmentContactValues,
  options: AppointmentContactValidationOptions = {},
): boolean =>
  Object.values(getAppointmentContactErrors(values, options)).every((error) => !error);

export const sanitizePhoneInput = (value: string, countryCode: string): string => {
  const digits = value.replace(/\D/g, "");
  const maxLength = countryCode === "+91" || countryCode === "+1" ? 10 : 15;
  return digits.slice(0, maxLength);
};

export const sanitizePincodeInput = (value: string): string =>
  value.replace(/\D/g, "").slice(0, 6);

export const getMinSelectableDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const shouldShowFieldError = (touched: boolean, submitted: boolean, error?: string) =>
  Boolean(error && (touched || submitted));
