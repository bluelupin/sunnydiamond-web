import type {
  AppointmentFilterKey,
  OrderFilterKey,
  ProfileAppointmentUi,
  ProfileBespokeItemUi,
  ProfileOrderUi,
  ProfileTimelineStep,
} from "../types/profileUi.types";

export const PROFILE_PREVIEW_MOCK_WHEN_EMPTY = true;

const PLACEHOLDER_RING_IMAGE = "/images/jewellery/plp/product-ring-transparent.png";
const PLACEHOLDER_NECKLACE_IMAGE = "/images/jewellery/plp/product-necklace-transparent.png";

function deliveryTimeline(currentStep: number): ProfileTimelineStep[] {
  const labels = [
    "In Production",
    "Packaged",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  return labels.map((label, index) => {
    const step = index + 1;
    let status: ProfileTimelineStep["status"] = "upcoming";

    if (step < currentStep) {
      status = "completed";
    } else if (step === currentStep) {
      status = "current";
    }

    return { step, label, status };
  });
}

function returnTimeline(currentStep: number): ProfileTimelineStep[] {
  const labels = [
    "Return Initiated",
    "Order Picked Up",
    "Refund Initiated",
    "Refunded Successfully",
  ];

  return labels.map((label, index) => {
    const step = index + 1;
    let status: ProfileTimelineStep["status"] = "upcoming";

    if (step < currentStep) {
      status = "completed";
    } else if (step === currentStep) {
      status = "current";
    }

    return { step, label, status };
  });
}

function cancelTimeline(currentStep: number): ProfileTimelineStep[] {
  const labels = ["Order Cancelled", "Refund Initiated", "Refunded Successfully"];

  return labels.map((label, index) => {
    const step = index + 1;
    let status: ProfileTimelineStep["status"] = "upcoming";

    if (step < currentStep) {
      status = "completed";
    } else if (step === currentStep) {
      status = "current";
    }

    return { step, label, status };
  });
}

const mockOrderItems = [
  {
    id: "item-1",
    name: "Anara Diamond Ring",
    imageSrc: PLACEHOLDER_RING_IMAGE,
    size: "14",
    metal: "White Gold",
    isGift: true,
    quantity: 1,
  },
  {
    id: "item-2",
    name: "Anara Diamond Ring",
    imageSrc: PLACEHOLDER_RING_IMAGE,
    size: "14",
    metal: "White Gold",
    isBespoke: true,
    useIconPlaceholder: true,
    quantity: 1,
  },
];

export const MOCK_PROFILE_ORDERS: ProfileOrderUi[] = [
  {
    id: "mock-order-1",
    number: "2148000",
    orderDate: "2026-10-30",
    statusLabel: "Order in Progress",
    category: "in_progress",
    deliveryBy: "30 October 2026",
    estimatedDeliveryLabel: "Estimated Delivery",
    estimatedDeliveryValue: "2 June 2026",
    timeline: deliveryTimeline(3),
    items: mockOrderItems,
    grandTotal: 12140,
    currency: "INR",
    showTrack: true,
    showCancel: true,
    showReturn: false,
    showDownloadInvoice: true,
    showCancelNote: true,
    footnote: "Orders can only be cancelled before they are shipped.",
  },
  {
    id: "mock-order-2",
    number: "2148001",
    orderDate: "2026-10-30",
    statusLabel: "Delivered",
    category: "delivered",
    deliveryBy: "30 October 2026",
    items: mockOrderItems.slice(0, 1),
    grandTotal: 9880,
    currency: "INR",
    showTrack: false,
    showCancel: false,
    showReturn: true,
    showDownloadInvoice: true,
    showCancelNote: false,
    footnote: "Orders can be returned till 30th September 2026",
  },
  {
    id: "mock-order-3",
    number: "2148002",
    orderDate: "2026-10-30",
    statusLabel: "Refund In Progress",
    category: "returned",
    deliveryBy: "30 October 2026",
    estimatedDeliveryLabel: "Estimated Delivery",
    estimatedDeliveryValue: "2 June 2026",
    timeline: returnTimeline(3),
    items: mockOrderItems,
    grandTotal: 12140,
    currency: "INR",
    showTrack: false,
    showCancel: false,
    showReturn: false,
    showDownloadInvoice: true,
    showCancelNote: false,
  },
  {
    id: "mock-order-4",
    number: "2148003",
    orderDate: "2026-10-30",
    statusLabel: "Cancelled",
    category: "cancelled",
    deliveryBy: "30 October 2026",
    estimatedDeliveryLabel: "Estimated Delivery",
    estimatedDeliveryValue: "Within 5-7 business days",
    timeline: cancelTimeline(2),
    items: mockOrderItems,
    grandTotal: 12140,
    currency: "INR",
    showTrack: false,
    showCancel: false,
    showReturn: false,
    showDownloadInvoice: true,
    showCancelNote: false,
  },
];

export const MOCK_PROFILE_APPOINTMENTS: ProfileAppointmentUi[] = [
  {
    id: "mock-appt-video",
    type: "video_call",
    typeLabel: "Video Call",
    customerName: "Bhavini Sharma",
    customerPhone: "+91 9876543210",
    customerEmail: "bhavini@example.com",
    products: [
      { id: "p1", name: "Alankara Diamond Ring", imageSrc: PLACEHOLDER_RING_IMAGE },
      { id: "p2", name: "Alankara Diamond Ring", imageSrc: PLACEHOLDER_RING_IMAGE },
    ],
    bookingDate: "14 June 2026",
    bookingTime: "11:00 AM – 12:00 PM",
    notesLabel: "Note",
    notes: "Dear Diya, wishing you a very prosperous Diwali",
    rescheduleNote: "Appointment can be rescheduled before 14 June 2026",
    canReschedule: true,
    canCancel: true,
  },
  {
    id: "mock-appt-home",
    type: "try_at_home",
    typeLabel: "Try at Home",
    customerName: "Bhavini Sharma",
    customerPhone: "+91 9876543210",
    customerEmail: "bhavini@example.com",
    products: [
      { id: "p1", name: "Alankara Diamond Ring", imageSrc: PLACEHOLDER_RING_IMAGE },
      { id: "p2", name: "Alankara Diamond Ring", imageSrc: PLACEHOLDER_RING_IMAGE },
      { id: "p3", name: "Alankara Diamond Ring", imageSrc: PLACEHOLDER_RING_IMAGE },
    ],
    appointmentAddress: {
      name: "Bhavini Sharma",
      addressLine1: "82, Besant Nagar",
      addressLine2: "E-39, 16th Cross Street, Elliot's Beach",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600090",
      phone: "+91 9876543210",
    },
    bookingDate: "14 June 2026",
    bookingTime: "2:00 PM – 3:00 PM",
    notesLabel: "Note",
    notes: "I am looking for an engagement ring. I have a theme in mind.",
    rescheduleNote: "Appointment can be rescheduled before 14 June 2026",
    canReschedule: true,
    canCancel: true,
  },
  {
    id: "mock-appt-store",
    type: "store_visit",
    typeLabel: "Store Visit",
    customerName: "Bhavini Sharma",
    customerPhone: "+91 9876543210",
    customerEmail: "bhavini@example.com",
    products: [],
    storeVisit: {
      city: "Kochi",
      lines: [
        "Sunny Diamonds Showroom",
        "MG Road, Kochi, Kerala – 682001",
      ],
      directionsHref: "/store-locator",
    },
    bookingDate: "14 June 2026",
    bookingTime: "4:00 PM – 5:00 PM",
    notesLabel: "Note",
    notes: "Looking for wedding bands for our anniversary.",
    rescheduleNote: "Appointment can be rescheduled before 14 June 2026",
    canReschedule: true,
    canCancel: true,
  },
];

export const MOCK_PROFILE_BESPOKE: ProfileBespokeItemUi[] = [
  {
    id: "mock-bespoke-1",
    creationDocumentId: "mock-creation-1",
    title: "Alankara Diamond Necklace",
    imageSrc: PLACEHOLDER_NECKLACE_IMAGE,
    size: "14",
    metal: "White Gold",
    price: "₹ 9,880",
    viewHref: "/bespoke-jewellery",
  },
  {
    id: "mock-bespoke-2",
    creationDocumentId: "mock-creation-2",
    title: "Alankara Diamond Necklace",
    imageSrc: PLACEHOLDER_NECKLACE_IMAGE,
    size: "14",
    metal: "White Gold",
    price: "₹ 9,880",
    viewHref: "/bespoke-jewellery",
  },
  {
    id: "mock-bespoke-3",
    creationDocumentId: "mock-creation-3",
    title: "Alankara Diamond Necklace",
    imageSrc: PLACEHOLDER_NECKLACE_IMAGE,
    size: "14",
    metal: "White Gold",
    price: "₹ 9,880",
    viewHref: "/bespoke-jewellery",
  },
  {
    id: "mock-bespoke-4",
    creationDocumentId: "mock-creation-4",
    title: "Alankara Diamond Necklace",
    imageSrc: PLACEHOLDER_NECKLACE_IMAGE,
    size: "14",
    metal: "White Gold",
    price: "₹ 9,880",
    viewHref: "/bespoke-jewellery",
  },
];

export function getMockOrdersByFilter(filter: OrderFilterKey): ProfileOrderUi[] {
  return MOCK_PROFILE_ORDERS.filter((order) => order.category === filter);
}

export function getMockAppointmentsByFilter(filter: AppointmentFilterKey): ProfileAppointmentUi[] {
  return MOCK_PROFILE_APPOINTMENTS.filter((appointment) => appointment.type === filter);
}
