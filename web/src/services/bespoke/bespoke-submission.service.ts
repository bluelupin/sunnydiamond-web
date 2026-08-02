import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";

export type BespokeSubmissionPayload = {
  fullName: string;
  phone: string;
  email: string;
  designVision: string;
  referenceImage?: File | null;
};

/**
 * POST /api/bespoke-submissions/submit
 * JSON when no image; multipart when `referenceImage` is attached:
 *   data → JSON string
 *   referenceImage → file (max 5 MB)
 */
export async function createBespokeSubmission(
  payload: BespokeSubmissionPayload,
  signal?: AbortSignal,
): Promise<void> {
  const { referenceImage, ...fields } = payload;
  const data = {
    fullName: fields.fullName.trim(),
    phone: fields.phone.trim(),
    email: fields.email.trim(),
    designVision: fields.designVision.trim(),
  };

  if (typeof File !== "undefined" && referenceImage instanceof File) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("referenceImage", referenceImage, referenceImage.name || "reference-image");

    await apiFetch(STRAPI_ENDPOINTS.bespokeSubmissionsSubmit, {
      method: "POST",
      signal,
      body: formData,
    });
    return;
  }

  await apiFetch(STRAPI_ENDPOINTS.bespokeSubmissionsSubmit, {
    method: "POST",
    signal,
    body: data,
  });
}
