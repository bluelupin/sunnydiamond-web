export type CustomerAppointmentShowroom = {
  documentId: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string;
  mapUrl: string;
  pincode: string;
};

export type CustomerAppointmentProduct = {
  documentId: string;
  productId: string | null;
  productName: string | null;
  requestedDate: string;
  selectedTimeSlot: string;
  workflowStatus: string;
};

export type CustomerAppointment = {
  documentId: string;
  appointmentGroupId: string | null;
  formTag: string;
  productName: string | null;
  productId: string | null;
  products: CustomerAppointmentProduct[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  requestedDate: string;
  selectedTimeSlot: string;
  workflowStatus: string;
  customerMessage: string | null;
  /** Dedicated purpose field when CMS returns one; otherwise parsed from customerMessage. */
  purposeOfVisit: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  pincode: string | null;
  city: string | null;
  state: string | null;
  preferredShowroom: CustomerAppointmentShowroom | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomerAppointmentsPage = {
  appointments: CustomerAppointment[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export type StrapiCustomerAppointmentShowroom = {
  documentId?: string | null;
  name?: string | null;
  slug?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  mapUrl?: string | null;
  directionsUrl?: string | null;
  pincode?: string | null;
  phone?: string | null;
};

export type StrapiCustomerAppointmentProduct = {
  documentId?: string | null;
  productId?: string | number | null;
  productName?: string | null;
  requestedDate?: string | null;
  selectedTimeSlot?: string | null;
  workflowStatus?: string | null;
};

export type StrapiCustomerAppointment = {
  documentId?: string | null;
  appointmentGroupId?: string | null;
  formTag?: string | null;
  productName?: string | null;
  productId?: string | number | null;
  products?: StrapiCustomerAppointmentProduct[] | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  requestedDate?: string | null;
  selectedTimeSlot?: string | null;
  workflowStatus?: string | null;
  requestDetails?: string | null;
  notes?: string | null;
  message?: string | null;
  customerMessage?: string | null;
  purposeOfVisit?: string | null;
  purpose?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  pincode?: string | null;
  city?: string | null;
  state?: string | null;
  preferredShowroom?: StrapiCustomerAppointmentShowroom | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type StrapiCustomerAppointmentsResponse = {
  data?: StrapiCustomerAppointment[] | null;
  meta?: {
    pagination?: {
      page?: number | null;
      pageSize?: number | null;
      pageCount?: number | null;
      total?: number | null;
    } | null;
  } | null;
};

export type StrapiAppointmentMutationResponse = {
  data?: {
    documentId?: string | null;
    appointmentGroupId?: string | null;
    requestedDate?: string | null;
    selectedTimeSlot?: string | null;
    workflowStatus?: string | null;
    affectedProductDocumentIds?: string[] | null;
  } | null;
  meta?: {
    changed?: boolean | null;
  } | null;
};
