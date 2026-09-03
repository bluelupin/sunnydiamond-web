export type FieldValidation = {
  valid: boolean;
  error?: string;
};

/** Figma 2556:10875 — form field error state */
export const formFieldErrorTextColor = "#F91616";
export const formFieldErrorBackgroundColor = "#FEDCDC";

export const formFieldErrorClassName =
  "min-w-0 font-gill text-sm font-light leading-none text-[#F91616]";

export const invalidFieldClassName =
  "border border-[#F91616] bg-[#FEDCDC]";

export const invalidFieldContainerClassName =
  "border border-[#F91616] bg-[#FEDCDC]";

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

  if (
    !/^[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\.[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)+$/.test(
      trimmed,
    )
  ) {
    return { valid: false, error: "Enter a valid email address" };
  }

  return { valid: true };
};

export const validateRequiredEmail = (value: string): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, error: "Email is required" };
  }

  return validateOptionalEmail(trimmed);
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

  const max = parseDateOnly(getMaxSelectableDate());
  if (max && selected > max) {
    return { valid: false, error: "Date must be within 3 months from today" };
  }

  return { valid: true };
};

export const validateRequiredDate = (value: string): FieldValidation => {
  if (!value.trim()) {
    return { valid: false, error: "Select a date" };
  }

  return validateOptionalDate(value);
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

export type AppointmentContactValues = {
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  date: string;
  note: string;
  purpose?: string;
  selectedSlot?: string | null;
};

export type AppointmentContactValidationOptions = {
  noteRequired?: boolean;
  emailRequired?: boolean;
  validatePurpose?: boolean;
  dateRequired?: boolean;
  selectedSlotRequired?: boolean;
};

export type AppointmentContactField =
  | "name"
  | "phone"
  | "email"
  | "date"
  | "note"
  | "purpose"
  | "selectedSlot";

export const getAppointmentContactErrors = (
  values: AppointmentContactValues,
  options: AppointmentContactValidationOptions = {},
): Record<AppointmentContactField, string | undefined> => {
  const noteValidation = options.noteRequired
    ? validateRequiredNote(values.note)
    : validateOptionalNote(values.note);

  const dateValidation = options.dateRequired
    ? validateRequiredDate(values.date)
    : validateOptionalDate(values.date);

  return {
    name: validateRequiredName(values.name).error,
    phone: validatePhone(values.phone, values.countryCode).error,
    email: options.emailRequired
      ? validateRequiredEmail(values.email).error
      : validateOptionalEmail(values.email).error,
    date: dateValidation.error,
    note: noteValidation.error,
    purpose: options.validatePurpose
      ? validateRequiredSelection(values.purpose ?? "", "purpose").error
      : undefined,
    selectedSlot: options.selectedSlotRequired
      ? validateRequiredSelection(values.selectedSlot ?? "", "time slot").error
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

/** Preferred date upper bound: today + 3 months (inclusive). */
export const getMaxSelectableDate = (): string => {
  const max = new Date();
  max.setHours(0, 0, 0, 0);
  max.setMonth(max.getMonth() + 3);
  const year = max.getFullYear();
  const month = String(max.getMonth() + 1).padStart(2, "0");
  const day = String(max.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateOnly = (value: string): Date | undefined => {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

export const shouldShowFieldError = (touched: boolean, submitted: boolean, error?: string) =>
  Boolean(error && (touched || submitted));

export const validatePhoneOrEmail = (value: string): FieldValidation => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, error: "Phone number or email is required" };
  }

  if (trimmed.includes("@")) {
    return validateRequiredEmail(trimmed);
  }

  return validatePhone(trimmed, "+91");
};

/** True when the contact field is being used as an email address (not a phone). */
export const isCheckoutEmailContact = (value: string): boolean => /[a-zA-Z@]/.test(value);

export const validateOptionalPhone = (value: string, countryCode = "+91"): FieldValidation => {
  if (!value.trim()) {
    return { valid: true };
  }

  return validatePhone(value, countryCode);
};

/**
 * The storefront no longer carries its own COD ceiling. Magento holds both the
 * order minimum and the maximum, and a second copy here could only drift from
 * them — it did: the client capped COD at ₹40,000 while the backend also
 * required ₹20,000, so an order below the floor was accepted by the UI and then
 * silently placed as "Check / Money order". Availability now comes from the
 * cart's own available_payment_methods (isCodOfferedByBackend).
 */
export const validateCodOffered = (codOffered: boolean): FieldValidation => {
  if (!codOffered) {
    return {
      valid: false,
      error: "Cash on Delivery is not available for this order. Please use online payment.",
    };
  }

  return { valid: true };
};

export const validateCodEngravedCart = (hasEngravedItems: boolean): FieldValidation => {
  if (hasEngravedItems) {
    return {
      valid: false,
      error: "Cash on Delivery is not available for engraved items. Please use online payment.",
    };
  }

  return { valid: true };
};

export type CheckoutFormField =
  | "name"
  | "phoneOrEmail"
  | "shippingName"
  | "addressLine1"
  | "addressLine2"
  | "pincode"
  | "city"
  | "state"
  | "shippingPhone"
  | "billingName"
  | "billingAddressLine1"
  | "billingAddressLine2"
  | "billingPincode"
  | "billingCity"
  | "billingState"
  | "billingPhone";

export type CheckoutPaymentField = "cod";

export type CheckoutFormValues = {
  name: string;
  phoneOrEmail: string;
  shippingName: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  shippingPhone: string;
  billingSameAsShipping: boolean;
  billingName: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingPincode: string;
  billingCity: string;
  billingState: string;
  billingPhone: string;
};

export type CheckoutPaymentValues = {
  method: "card" | "upi" | "netbanking" | "cod";
};

const getAddressBlockErrors = (
  prefix: "shipping" | "billing",
  values: CheckoutFormValues,
  states: readonly string[],
): Partial<Record<CheckoutFormField, string | undefined>> => {
  if (prefix === "shipping") {
    return {
      shippingName: validateRequiredName(values.shippingName).error,
      addressLine1: validateAddressLine1(values.addressLine1).error,
      addressLine2: validateOptionalAddressLine2(values.addressLine2).error,
      pincode: validateIndianPincode(values.pincode).error,
      city: validateCity(values.city).error,
      state: validateIndianState(values.state, states).error,
      shippingPhone: validateOptionalPhone(values.shippingPhone).error,
    };
  }

  return {
    billingName: validateRequiredName(values.billingName).error,
    billingAddressLine1: validateAddressLine1(values.billingAddressLine1).error,
    billingAddressLine2: validateOptionalAddressLine2(values.billingAddressLine2).error,
    billingPincode: validateIndianPincode(values.billingPincode).error,
    billingCity: validateCity(values.billingCity).error,
    billingState: validateIndianState(values.billingState, states).error,
    billingPhone: validateOptionalPhone(values.billingPhone).error,
  };
};

export const getCheckoutFormErrors = (
  values: CheckoutFormValues,
  states: readonly string[],
): Partial<Record<CheckoutFormField, string | undefined>> => ({
  name: validateRequiredName(values.name).error,
  phoneOrEmail: validatePhoneOrEmail(values.phoneOrEmail).error,
  ...getAddressBlockErrors("shipping", values, states),
  ...(values.billingSameAsShipping
    ? {}
    : getAddressBlockErrors("billing", values, states)),
});

export const isCheckoutFormValid = (
  values: CheckoutFormValues,
  states: readonly string[],
): boolean =>
  Object.values(getCheckoutFormErrors(values, states)).every((error) => !error);

export const getCheckoutPaymentErrors = (
  values: CheckoutPaymentValues,
  codOffered: boolean,
  hasEngravedItems = false,
): Partial<Record<CheckoutPaymentField, string | undefined>> => {
  if (values.method === "cod") {
    return {
      // Engraved-cart restriction wins when both reasons apply: it names the
      // actual cause, where the generic message only says "not available".
      cod:
        validateCodEngravedCart(hasEngravedItems).error ??
        validateCodOffered(codOffered).error,
    };
  }

  return {};
};

export const isCheckoutPaymentValid = (
  values: CheckoutPaymentValues,
  codOffered: boolean,
  hasEngravedItems = false,
): boolean =>
  Object.values(getCheckoutPaymentErrors(values, codOffered, hasEngravedItems)).every(
    (error) => !error,
  );

export type ProfileAddressFormValues = {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  city: string;
  state: string;
  phone: string;
};

export type ProfileAddressFormField = keyof ProfileAddressFormValues;

export const getProfileAddressFormErrors = (
  values: ProfileAddressFormValues,
  states: readonly string[],
): Partial<Record<ProfileAddressFormField, string | undefined>> => ({
  name: validateRequiredName(values.name).error,
  addressLine1: validateAddressLine1(values.addressLine1).error,
  addressLine2: validateOptionalAddressLine2(values.addressLine2 ?? "").error,
  pincode: validateIndianPincode(values.pincode).error,
  city: validateCity(values.city).error,
  state: validateIndianState(values.state, states).error,
  phone: validatePhone(values.phone, "+91").error,
});

export const isProfileAddressFormValid = (
  values: ProfileAddressFormValues,
  states: readonly string[],
): boolean =>
  Object.values(getProfileAddressFormErrors(values, states)).every((error) => !error);
