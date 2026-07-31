import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import type { CareerJobSubmissionPayload } from "./careers.types";

export type SubmitCareerApplicationInput = CareerJobSubmissionPayload & {
  resumeFile?: File | null;
};

/**
 * POST /api/submissions-job-openings
 * JSON when no resume; multipart when `resumeFile` is attached:
 *   data → JSON string
 *   resume → file
 */
export async function submitCareerApplication(
  payload: SubmitCareerApplicationInput,
  signal?: AbortSignal,
): Promise<void> {
  const { resumeFile, ...fields } = payload;
  const data = {
    jobID: fields.jobID,
    jobTitle: fields.jobTitle,
    location: fields.location,
    department: fields.department,
    experience: fields.experience,
    personalDetails: fields.personalDetails,
    educationDetails: fields.educationDetails,
    workExperience: fields.workExperience,
    skillsAndLanguages: fields.skillsAndLanguages,
    addInfo: fields.addInfo,
  };

  if (typeof File !== "undefined" && resumeFile instanceof File) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("resume", resumeFile, resumeFile.name || "resume");

    await apiFetch(STRAPI_ENDPOINTS.jobOpeningSubmissions, {
      method: "POST",
      signal,
      body: formData,
    });
    return;
  }

  await apiFetch(STRAPI_ENDPOINTS.jobOpeningSubmissions, {
    method: "POST",
    signal,
    body: { data },
  });
}
