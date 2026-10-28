import { buildPolicyCertificationsHref } from "@/features/cms/utils/policyCertificationsRoutes";

export const COOKIE_CONSENT_COPY = {
  title: "We Value Your Privacy",
  description:
    "We use cookies to enhance your browsing experience and analyse site traffic. By continuing, you agree to our",
  privacyPolicyHref: buildPolicyCertificationsHref("privacy-policy"),
  privacyPolicyLabel: "Privacy Policy",
  acceptAll: "Accept all",
  rejectNonEssential: "Reject non-essential",
  managePreferences: "Manage preferences",
  savePreferences: "Save preferences",
  necessaryTitle: "Strictly necessary",
  necessaryDescription:
    "Required for core site functions such as security, cart, and account access. These cannot be turned off.",
  analyticsTitle: "Analytics",
  analyticsDescription:
    "Help us understand how visitors interact with the website so we can improve performance and content.",
  marketingTitle: "Marketing",
  marketingDescription:
    "Allow us to show relevant offers and measure the effectiveness of our campaigns.",
} as const;
