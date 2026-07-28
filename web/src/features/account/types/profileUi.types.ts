export type OrderFilterKey = "in_progress" | "delivered" | "cancelled" | "returned";

export type AppointmentFilterKey = "video_call" | "try_at_home" | "store_visit";

export type TimelineStepStatus = "completed" | "current" | "upcoming";

export type ProfileTimelineStep = {
  step: number;
  label: string;
  status: TimelineStepStatus;
};

export type ProfileOrderItemUi = {
  id: string;
  name: string;
  imageSrc: string;
  size?: string;
  metal?: string;
  isGift?: boolean;
  isBespoke?: boolean;
  useIconPlaceholder?: boolean;
  productUrlKey?: string | null;
  quantity: number;
};

export type ProfileOrderUi = {
  id: string;
  number: string;
  orderDate: string;
  statusLabel: string;
  category: OrderFilterKey;
  deliveryBy?: string;
  estimatedDeliveryLabel?: string;
  estimatedDeliveryValue?: string;
  timeline?: ProfileTimelineStep[];
  items: ProfileOrderItemUi[];
  grandTotal: number;
  currency: string;
  footnote?: string;
  showTrack: boolean;
  showCancel: boolean;
  showReturn: boolean;
  showDownloadInvoice: boolean;
  showCancelNote: boolean;
};

export type ProfileAppointmentProductUi = {
  id: string;
  name: string;
  imageSrc: string;
};

export type ProfileAppointmentUi = {
  id: string;
  type: AppointmentFilterKey;
  typeLabel: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  products: ProfileAppointmentProductUi[];
  appointmentAddress?: {
    name: string;
    lines: string[];
  };
  storeVisit?: {
    city: string;
    lines: string[];
    directionsHref?: string;
  };
  bookingDate: string;
  bookingTime: string;
  notesLabel: string;
  notes: string;
  rescheduleNote?: string;
  canReschedule: boolean;
  canCancel: boolean;
};

export type ProfileBespokeItemUi = {
  id: string;
  title: string;
  imageSrc: string;
  size?: string;
  metal?: string;
  price?: string;
  viewHref: string;
  savedAt?: string;
};
