export type CustomerAppointmentShowroom = {
  documentId: string;
  name: string;
  slug: string;
  city: string;
  state: string;
};

export type CustomerAppointment = {
  documentId: string;
  formTag: string;
  productName: string | null;
  productId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  requestedDate: string;
  selectedTimeSlot: string;
  workflowStatus: string;
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
};

export type StrapiCustomerAppointment = {
  documentId?: string | null;
  formTag?: string | null;
  productName?: string | null;
  productId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  requestedDate?: string | null;
  selectedTimeSlot?: string | null;
  workflowStatus?: string | null;
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
