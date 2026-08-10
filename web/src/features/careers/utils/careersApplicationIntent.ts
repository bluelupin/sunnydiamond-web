import type { CareersApplicationEntry } from "../types";

const STORAGE_KEY = "sunny-careers-application-entry";

type StashedCareerApplicationIntent = {
  entry: CareersApplicationEntry;
  resumeFile: File | null;
};

let stashedResumeFile: File | null = null;
let intentConsumed = false;
let cachedInitialIntent: StashedCareerApplicationIntent | null | undefined;

export function stashCareerApplicationIntent(
  entry: CareersApplicationEntry,
  resumeFile?: File,
): void {
  if (typeof window === "undefined") {
    return;
  }

  intentConsumed = false;
  cachedInitialIntent = undefined;
  stashedResumeFile = resumeFile ?? null;
  window.sessionStorage.setItem(STORAGE_KEY, entry);
}

export function consumeCareerApplicationIntent(): StashedCareerApplicationIntent | null {
  if (typeof window === "undefined" || intentConsumed) {
    return null;
  }

  intentConsumed = true;

  const entry = window.sessionStorage.getItem(STORAGE_KEY) as CareersApplicationEntry | null;
  window.sessionStorage.removeItem(STORAGE_KEY);

  const resumeFile = stashedResumeFile;
  stashedResumeFile = null;

  if (!entry && !resumeFile) {
    return null;
  }

  return {
    entry: entry ?? "manual",
    resumeFile,
  };
}

export function resolveInitialApplicationIntent(
  initialFlowStep: string,
): StashedCareerApplicationIntent | null {
  if (initialFlowStep !== "application") {
    return null;
  }

  if (cachedInitialIntent !== undefined) {
    return cachedInitialIntent;
  }

  cachedInitialIntent = consumeCareerApplicationIntent();
  return cachedInitialIntent;
}
