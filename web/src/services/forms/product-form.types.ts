export type StrapiProductFormTimeSlot = {
  id?: number;
  timeString?: string | null;
};

export type StrapiProductFormDropdownOption = {
  id?: number;
  optionValue?: string | null;
};

export type StrapiProductFormDynamicField = {
  id?: number;
  label?: string | null;
  fieldType?: string | null;
  placeholder?: string | null;
  isRequired?: boolean | null;
  formStep?: string | null;
  dropdownOptions?: StrapiProductFormDropdownOption[] | null;
};

export type StrapiProductFormStateOption = {
  id?: number;
  documentId?: string;
  name?: string | null;
  code?: string | null;
  label?: string | null;
  value?: string | null;
};

export type StrapiProductForm = {
  id?: number;
  documentId?: string;
  formName?: string | null;
  formTag?: string | null;
  submitButtonText?: string | null;
  allowImageUpload?: boolean | null;
  isMultiStep?: boolean | null;
  stepOneButtonText?: string | null;
  stateOptions?: StrapiProductFormStateOption[] | null;
  availableTimeSlots?: StrapiProductFormTimeSlot[] | null;
  dynamicFields?: StrapiProductFormDynamicField[] | null;
};

export type NormalizedProductForm = {
  formName: string;
  formTag: string;
  submitButtonText: string;
  stepOneButtonText?: string;
  allowImageUpload: boolean;
  isMultiStep: boolean;
  timeSlots: string[];
  stateOptions: string[];
  nameLabel?: string;
  namePlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  dateLabel?: string;
  datePlaceholder?: string;
  notesLabel?: string;
  notesPlaceholder?: string;
  notesRequired: boolean;
  addressLine1Label?: string;
  addressLine1Placeholder?: string;
  addressLine2Label?: string;
  addressLine2Placeholder?: string;
  pincodeLabel?: string;
  pincodePlaceholder?: string;
  cityLabel?: string;
  cityPlaceholder?: string;
  stateLabel?: string;
  statePlaceholder?: string;
  /** Dropdown options on the State dynamic field (separate from the top-level `stateOptions` relation). */
  stateFieldOptions: string[];
  purposeOptions: string[];
  purposeLabel?: string;
  purposePlaceholder?: string;
  purposeRequired: boolean;
};

export type ProductSubmissionPayload = {
  formTag: string;
  /** Left out for the store visit form, along with productId. */
  productName?: string;
  productId?: string;
  productSku?: string;
  metalColour?: string;
  metalPurity?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  /** Magento customer id from `/api/auth/me` — links submission to My Appointments. */
  magentoCustomerId?: number;
  requestDetails?: string;
  purposeOfVisit?: string;
  requestedDate?: string;
  selectedTimeSlot?: string;
  /** Showroom documentId — used by the store visit form for My Appointments. */
  preferredShowroom?: string;
  addressLine1?: string;
  addressLine2?: string;
  pincode?: string;
  city?: string;
  state?: string;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  consentAccepted?: boolean;
  workflowStatus?: string;
  uploadedImage?: File | null;
};
