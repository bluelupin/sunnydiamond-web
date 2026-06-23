export type ProductAppointmentVariant = "schedule-video-call" | "try-at-home";

type ProductAppointmentPanelConfig = {
  title: string;
  noteLabel: string;
  noteLabelClassName: string;
  noteTextareaClassName: string;
  notePlaceholder: string;
  submitLabel: string;
  closeAriaLabel: string;
  dialogAriaLabel: string;
  successToast: {
    title: string;
    description: string;
  };
  idPrefix: string;
};

export const PRODUCT_APPOINTMENT_PANEL_CONFIG: Record<
  ProductAppointmentVariant,
  ProductAppointmentPanelConfig
> = {
  "schedule-video-call": {
    title: "Schedule a Video call",
    noteLabel: "Describe more about your visit",
    noteLabelClassName: "font-gill text-sm leading-110 text-darkblack",
    noteTextareaClassName: "font-gill text-sm leading-110",
    notePlaceholder: "Eg: I am looking for an engagement ring",
    submitLabel: "Schedule a Videocall",
    closeAriaLabel: "Close schedule video call panel",
    dialogAriaLabel: "Schedule a Video call",
    successToast: {
      title: "Video call scheduled",
      description: "Our team will confirm your appointment shortly.",
    },
    idPrefix: "video-call",
  },
  "try-at-home": {
    title: "Try At Home",
    noteLabel: "What are you looking for?",
    noteLabelClassName: "font-gill text-base leading-110 text-darkblack",
    noteTextareaClassName: "font-gill text-base leading-110",
    notePlaceholder: "Eg: I am looking for an engagement ring",
    submitLabel: "Add Address",
    closeAriaLabel: "Close try at home panel",
    dialogAriaLabel: "Try At Home",
    successToast: {
      title: "Try at home request received",
      description: "Our representative will get in touch with you soon.",
    },
    idPrefix: "try-at-home",
  },
};
