/** Figma nodes 1049:49593, 1049:49826, 1049:50059 */
export const giftCardFlowContent = {
  title: "Gift Card",
  cardTypes: {
    label: "Type of Gift Card",
    physical: "Physical",
    digital: "Digital",
  },
  amount: {
    label: "Amount*",
    presetLabel: "or choose from",
    presets: [1000, 5000, 10000] as const,
    min: 1000,
    max: 50000,
    step: 500,
    default: 5000,
  },
  occasion: {
    label: "Occasion*",
    placeholder: "Select Occasion",
    options: [
      { label: "Wedding", value: "wedding" },
      { label: "Anniversary", value: "anniversary" },
      { label: "Birthday", value: "birthday" },
      { label: "Festive", value: "festive" },
    ],
  },
  message: {
    label: "Add a Message",
    placeholder: "Write a personalised note here",
  },
  details: {
    senderHeading: "Sender's Address",
    receiverHeading: "Receiver's Address",
    sameAsSenderLabel: "Same address as sender's details",
    fullNameLabel: "Full Name*",
    phoneLabel: "Phone No.*",
    emailLabel: "Email ID",
    placeholder: "Enter",
  },
  cta: {
    addDetails: "ADD DETAILS",
  },
};
