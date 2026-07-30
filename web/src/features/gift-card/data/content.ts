/** Figma nodes 1049:49593, 1049:49826, 1049:50059, delivery & success screens */
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
  address: {
    useCurrentLocationLabel: "USE CURRENT LOCATION",
    detectingLocationLabel: "DETECTING LOCATION...",
    heading: "Delivery Address",
    addressLine1Label: "Address line 1",
    addressLine2Label: "Address Line 2 (Optional)",
    pincodeLabel: "Pin code",
    cityLabel: "City",
    stateLabel: "State",
    placeholder: "Enter",
    invalidPincodeError: "Invalid Pincode",
    estimatedDeliveryPrefix: "Estimated order delivery by",
    payNowLabel: "PAY NOW",
  },
  success: {
    title: "Gift Card Confirmed",
    physicalMessage:
      "Your physical gift card order has been placed and will be delivered to the recipient by",
    digitalMessage:
      "Your digital gift card has been sent to the recipient and will be available shortly.",
    image: {
      src: "/images/gifting/gift-cards.png",
      alt: "Sunny Diamonds gift card",
    },
    trackOrderLabel: "TRACK ORDER",
    backToShoppingLabel: "GO BACK TO SHOPPING",
    backToShoppingHref: "/jewellery",
  },
  cta: {
    addDetails: "ADD DETAILS",
  },
};
