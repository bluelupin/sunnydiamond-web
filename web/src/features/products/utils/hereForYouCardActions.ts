export type HereForYouPanelAction = "video-call" | "try-at-home" | "personalise";

export type HereForYouButtonVariant = "primary" | "secondary";

export type PersonaliseButtonVariant = "outline" | "primary" | "secondary";

/** Maps CMS modalTag values to existing PDP side-panel flows. */
export function resolveHereForYouPanelAction(
  modalTag?: string,
): HereForYouPanelAction | null {
  switch (modalTag?.trim().toLowerCase()) {
    case "product-video-call":
      return "video-call";
    case "try-at-home":
      return "try-at-home";
    case "product-personalisation":
    case "product-personalise":
      return "personalise";
    default:
      return null;
  }
}

/**
 * Preserves original PDP CTA styling for known panel actions.
 * Video call = dark button; try at home = text link (regardless of CMS style).
 */
export function resolveHereForYouButtonVariant(
  modalTag?: string,
  cmsStyle: HereForYouButtonVariant = "secondary",
): HereForYouButtonVariant {
  switch (modalTag?.trim().toLowerCase()) {
    case "product-video-call":
      return "primary";
    case "try-at-home":
      return "secondary";
    default:
      return cmsStyle;
  }
}

/**
 * Preserves original personalise card CTA styling.
 * Get in touch = outline button (regardless of CMS style).
 */
export function resolvePersonaliseButtonVariant(
  modalTag?: string,
  cmsStyle: HereForYouButtonVariant = "secondary",
): PersonaliseButtonVariant {
  switch (modalTag?.trim().toLowerCase()) {
    case "product-personalisation":
    case "product-personalise":
      return "outline";
    default:
      return cmsStyle === "primary" ? "primary" : "secondary";
  }
}
