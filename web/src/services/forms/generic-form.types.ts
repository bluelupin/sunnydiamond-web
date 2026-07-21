export type StrapiGenericFormTimeSlot = {
  id?: number;
  timeString?: string | null;
};

export type StrapiGenericFormDropdownOption = {
  id?: number;
  optionValue?: string | null;
};

export type StrapiGenericFormDynamicField = {
  id?: number;
  label?: string | null;
  fieldType?: string | null;
  placeholder?: string | null;
  isRequired?: boolean | null;
  formStep?: string | null;
  dropdownOptions?: StrapiGenericFormDropdownOption[] | null;
};

export type StrapiShowroomImageMedia = {
  url?: string | null;
};

export type StrapiShowroomImage = {
  id?: number;
  altText?: string | null;
  caption?: string | null;
  desktopImage?: StrapiShowroomImageMedia | null;
  mobileImage?: StrapiShowroomImageMedia | null;
};

export type StrapiGenericFormShowroom = {
  id?: number;
  documentId?: string;
  name?: string | null;
  slug?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  email?: string | null;
  mapUrl?: string | null;
  openingHours?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  image?: StrapiShowroomImage | null;
};

export type StrapiGenericForm = {
  id?: number;
  documentId?: string;
  formName?: string | null;
  formTag?: string | null;
  submitButtonText?: string | null;
  availableTimeSlots?: StrapiGenericFormTimeSlot[] | null;
  dynamicFields?: StrapiGenericFormDynamicField[] | null;
  showrooms?: StrapiGenericFormShowroom[] | null;
};

export type NormalizedGenericFormShowroom = {
  id: string;
  /** Strapi showroom documentId for preferredShowroom relation */
  documentId?: string;
  tabLabel: string;
  storeName: string;
  address: string;
  phone: string;
  directionsUrl: string;
  heroImage: string;
};

export type NormalizedGenericFormField = {
  label: string;
  fieldType: string;
  placeholder?: string;
  isRequired: boolean;
  options: string[];
};

export type NormalizedGenericForm = {
  formName: string;
  formTag: string;
  submitButtonText: string;
  timeSlots: string[];
  showrooms: NormalizedGenericFormShowroom[];
  purposeOptions: string[];
  purposeLabel?: string;
  purposePlaceholder?: string;
  notesLabel?: string;
  notesPlaceholder?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  dateLabel?: string;
  datePlaceholder?: string;
  fields: NormalizedGenericFormField[];
};

export type GenericSubmissionPayload = {
  formTag: string;
  fullName: string;
  email?: string;
  phone: string;
  preferredShowroom?: string;
  preferredDate?: string;
  selectedTimeSlot?: string;
  notes?: string;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  consentAccepted?: boolean;
  workflowStatus?: string;
};
