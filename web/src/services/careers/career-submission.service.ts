import {
  mapCareerJobSubmissionToStrapi,
  type CareerJobSubmissionFormPayload,
} from "./career-submission.mapper";

export type SubmitCareerApplicationInput = CareerJobSubmissionFormPayload & {
  resumeFile?: File | null;
};

async function submitCareerApplicationViaBff(
  data: ReturnType<typeof mapCareerJobSubmissionToStrapi>,
  resumeFile: File | null | undefined,
  signal?: AbortSignal,
): Promise<void> {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  if (typeof File !== "undefined" && resumeFile instanceof File) {
    formData.append("resume", resumeFile, resumeFile.name || "resume");
  }

  const response = await fetch("/api/careers/submissions", {
    method: "POST",
    body: formData,
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Career submission failed (${response.status})`;

    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error?.trim()) {
        message = payload.error;
      }
    } catch {
      // ignore parse errors
    }

    throw new Error(message);
  }
}

/**
 * Browser → same-origin BFF → Strapi `POST /api/submissions-job-openings/submit`.
 * Always uses the custom submit action (standard collection POST is disabled on CMS).
 */
export async function submitCareerApplication(
  payload: SubmitCareerApplicationInput,
  signal?: AbortSignal,
): Promise<void> {
  const { resumeFile, ...fields } = payload;
  const data = mapCareerJobSubmissionToStrapi(fields);

  await submitCareerApplicationViaBff(data, resumeFile, signal);
}
