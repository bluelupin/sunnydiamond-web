import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";

export type SkillLanguageOption = { label: string; type: "Skill" | "Language" };

export async function fetchSkillsAndLanguages(search: string, signal?: AbortSignal): Promise<SkillLanguageOption[]> {
  const records = await apiFetch<Array<SkillLanguageOption & { attributes?: SkillLanguageOption }>>(
    STRAPI_ENDPOINTS.skillsAndLanguages,
    { params: search.trim() ? { search: search.trim() } : undefined, signal, cache: "no-store" },
  );
  return (records ?? []).map((record) => record.attributes ?? record).filter(
    (record) => typeof record.label === "string" && record.label.trim().length > 0 &&
      (record.type === "Skill" || record.type === "Language"),
  );
}
