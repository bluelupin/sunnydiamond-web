import type { ErrorPageVariant } from "@/features/error/types";

/** agent.mdc — luxury error state palette */
export const errorPageTheme = {
  background: "#F6EFE3",
  primaryText: "#1E1E1E",
  secondaryText: "#6B6B6B",
  accent: "#B8894E",
  neutralAccent: "#D9C5A1",
} as const;

export const errorPageCopy = {
  badge: "Temporary Service Interruption",
  headline: "We'll Be Right Back",
  description:
    "We're making a few improvements behind the scenes to provide you with a better experience. Thank you for your patience.",
  tryAgain: "Try Again",
  goHome: "Go to Homepage",
  contactSupport: "Contact Support",
  footerMessage: "Your patience is appreciated. Our team is working to restore service.",
  statusCard: {
    status: "Status",
    lastChecked: "Last Checked",
    estimatedTime: "Estimated Time",
    errorCode: "Reference",
  },
} as const;

export const errorPageVariants: Record<
  ErrorPageVariant,
  { statusMessage: string; statusLabel: string; estimatedMinutes?: number }
> = {
  "server-unavailable": {
    statusMessage: "Our servers are temporarily unavailable.",
    statusLabel: "Server Unavailable",
    estimatedMinutes: 15,
  },
  deploying: {
    statusMessage: "We're currently deploying a new update.",
    statusLabel: "Maintenance in Progress",
    estimatedMinutes: 15,
  },
  "content-load-failed": {
    statusMessage: "We couldn't load this content.",
    statusLabel: "Content Unavailable",
  },
  "service-unavailable": {
    statusMessage: "This service is temporarily unavailable.",
    statusLabel: "Service Interruption",
    estimatedMinutes: 15,
  },
  unexpected: {
    statusMessage:
      "We're making a few improvements behind the scenes to provide you with a better experience.",
    statusLabel: "Temporary Interruption",
  },
};