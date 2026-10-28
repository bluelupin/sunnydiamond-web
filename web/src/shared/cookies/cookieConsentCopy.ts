import { buildPolicyCertificationsHref } from "@/features/cms/utils/policyCertificationsRoutes";

export const COOKIE_CONSENT_COPY = {
  title: "We Value Your Privacy",
  description:
    "We use cookies to enhance your browsing experience and analyse site traffic. By continuing, you agree to our",
  privacyPolicyHref: buildPolicyCertificationsHref("privacy-policy"),
  privacyPolicyLabel: "Privacy Policy",
  acceptAll: "Accept all",
  decline: "Decline",
} as const;
