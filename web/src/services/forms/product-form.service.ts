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
 * Matches the working Postman request:
 * POST /api/product-submissions/submit
 * form-data:
 *   data → JSON string of fields
 *   uploadedImage → file (when attached)
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

  await apiFetch(STRAPI_ENDPOINTS.productSubmissionsSubmit, {
    method: "POST",
    signal,
    body: formData,
  });
}

export type { NormalizedProductForm, ProductSubmissionPayload };
