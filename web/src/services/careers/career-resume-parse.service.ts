import {
  mapCareerResumeParseResponse,
  type CareerResumePrefillData,
} from "./career-resume-parse.mapper";

export async function parseCareerResume(
  resumeFile: File,
  signal?: AbortSignal,
): Promise<CareerResumePrefillData> {
  const formData = new FormData();
  formData.append("resume", resumeFile, resumeFile.name || "resume");

  const response = await fetch("/api/careers/resume-parse", {
    method: "POST",
    body: formData,
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Resume parsing failed (${response.status})`;

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

  const payload = await response.json().catch(() => null);
  const parsed = mapCareerResumeParseResponse(payload);

  if (!parsed) {
    throw new Error("Resume parsing returned an empty response.");
  }

  const hasAnyValue = Object.values(parsed).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return typeof value === "string" && value.trim().length > 0;
  });

  if (!hasAnyValue) {
    throw new Error("No application details were found in this resume.");
  }

  return parsed;
}
