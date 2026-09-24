import { DEFAULT_PROFILE_SECTION } from "../data/profileSections";
import type { ProfileSectionId } from "../types";
import { PROFILE_ORDER_QUERY_PARAM } from "./profileOrderNavigation";

function readProfileSearchParams(
  source?: URLSearchParams | string | null,
): URLSearchParams {
  if (source instanceof URLSearchParams) {
    return new URLSearchParams(source.toString());
  }

  if (typeof source === "string") {
    const trimmed = source.startsWith("?") ? source.slice(1) : source;
    return new URLSearchParams(trimmed);
  }

  return new URLSearchParams();
}

/** Build a profile section href, clearing nested order detail and normalizing the default section. */
export function buildProfileSectionHref(
  section: ProfileSectionId,
  currentSearch?: URLSearchParams | string | null,
): string {
  const params = readProfileSearchParams(currentSearch);
  params.delete(PROFILE_ORDER_QUERY_PARAM);

  if (section === DEFAULT_PROFILE_SECTION) {
    params.delete("section");
  } else {
    params.set("section", section);
  }

  const query = params.toString();
  return query ? `/profile?${query}` : "/profile";
}

export function getCurrentProfileHref(currentSearch?: URLSearchParams | string | null): string {
  const params = readProfileSearchParams(currentSearch);
  const query = params.toString();
  return query ? `/profile?${query}` : "/profile";
}
