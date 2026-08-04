import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapGenericForm } from "./generic-form.mapper";
import type {
  ContactEnquiryPayload,
  GenericSubmissionPayload,
  NormalizedGenericForm,
  StrapiGenericForm,
} from "./generic-form.types";

const GENERIC_FORM_POPULATE_QUERY =
  "populate[availableTimeSlots]=true" +
  "&populate[dynamicFields][populate]=*" +
  "&populate[showrooms][populate][image][populate]=*";

export const getGenericFormByTag = cache(
  async (
    formTag: string,
    signal?: AbortSignal,
  ): Promise<NormalizedGenericForm | null> => {
    const query =
      `${GENERIC_FORM_POPULATE_QUERY}` +
      `&filters[formTag][$eq]=${encodeURIComponent(formTag)}`;

    const raw = await apiFetch<StrapiGenericForm[] | StrapiGenericForm>(
      `${STRAPI_ENDPOINTS.genericForms}?${query}`,
      { signal },
    );

    const entity = Array.isArray(raw) ? raw[0] : raw;
    return mapGenericForm(entity);
  },
);

/**
 * Browser → same-origin BFF → Strapi generic-submissions (Public create).
 * Used by store-locator/nav Book a Visit (`showroom-visit`).
 * Contact Us enquiry uses `submitContactEnquiry` → `/submit` instead.
 * PDP Visit Us / Try at Home / Video Call use product-submissions instead.
 */
export async function createGenericSubmission(
  payload: GenericSubmissionPayload,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch("/api/generic-submissions", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      data: {
        ...payload,
        workflowStatus: payload.workflowStatus ?? "New",
        consentAccepted: payload.consentAccepted ?? true,
      },
    }),
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Generic submission failed (${response.status})`;
    try {
      const payloadJson = (await response.json()) as { error?: string };
      if (payloadJson.error?.trim()) {
        message = payloadJson.error;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
}

/**
 * Contact Us enquiry → BFF → Strapi `POST /api/generic-submissions/submit`.
 * Flat JSON body (reasonForContact + message), not collection `{ data: … }`.
 */
export async function submitContactEnquiry(
  payload: ContactEnquiryPayload,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch("/api/generic-submissions/submit", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(payload),
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Contact enquiry failed (${response.status})`;
    try {
      const payloadJson = (await response.json()) as {
        error?: string | { message?: string };
      };
      if (typeof payloadJson.error === "string" && payloadJson.error.trim()) {
        message = payloadJson.error;
      } else if (
        payloadJson.error &&
        typeof payloadJson.error === "object" &&
        payloadJson.error.message?.trim()
      ) {
        message = payloadJson.error.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
}

export type { NormalizedGenericForm, GenericSubmissionPayload, ContactEnquiryPayload };
