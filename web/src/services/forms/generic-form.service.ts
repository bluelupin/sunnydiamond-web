import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapGenericForm } from "./generic-form.mapper";
import type {
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

export async function createGenericSubmission(
  payload: GenericSubmissionPayload,
  signal?: AbortSignal,
): Promise<void> {
  await apiFetch(STRAPI_ENDPOINTS.genericSubmissions, {
    method: "POST",
    signal,
    body: {
      data: {
        ...payload,
        workflowStatus: payload.workflowStatus ?? "New",
        consentAccepted: payload.consentAccepted ?? true,
      },
    },
  });
}

export type { NormalizedGenericForm, GenericSubmissionPayload };
