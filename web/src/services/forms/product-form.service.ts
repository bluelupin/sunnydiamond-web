import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapProductForm } from "./product-form.mapper";
import type {
  NormalizedProductForm,
  ProductSubmissionPayload,
  StrapiProductForm,
} from "./product-form.types";

const PRODUCT_FORM_POPULATE_QUERY =
  "populate[stateOptions]=true" +
  "&populate[availableTimeSlots]=true" +
  "&populate[dynamicFields][populate]=*";

export async function getProductFormByTag(
  formTag: string,
  signal?: AbortSignal,
): Promise<NormalizedProductForm | null> {
  const query =
    `${PRODUCT_FORM_POPULATE_QUERY}` +
    `&filters[formTag][$eq]=${encodeURIComponent(formTag)}`;

  const raw = await apiFetch<StrapiProductForm[] | StrapiProductForm>(
    `${STRAPI_ENDPOINTS.productForms}?${query}`,
    { signal },
  );

  const entity = Array.isArray(raw) ? raw[0] : raw;
  return mapProductForm(entity);
}

/**
 * Browser posts to same-origin BFF so the Magento session cookie can be attached
 * as Bearer for CMS customer linking (My Appointments).
 *
 * BFF → POST /api/product-submissions/submit (multipart data + uploadedImage).
 */
export async function createProductSubmission(
  payload: ProductSubmissionPayload,
  signal?: AbortSignal,
): Promise<void> {
  const {
    uploadedImage,
    workflowStatus = "New",
    consentAccepted = true,
    ...fields
  } = payload;

  const data = {
    ...fields,
    workflowStatus,
    consentAccepted,
  };

  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  if (typeof File !== "undefined" && uploadedImage instanceof File) {
    formData.append(
      "uploadedImage",
      uploadedImage,
      uploadedImage.name || "reference-image",
    );
  }

  const response = await fetch("/api/product-submissions/submit", {
    method: "POST",
    body: formData,
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Product submission failed (${response.status})`;
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

export type { NormalizedProductForm, ProductSubmissionPayload };
