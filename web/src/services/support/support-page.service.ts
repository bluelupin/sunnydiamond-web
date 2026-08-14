import { cache } from "react";
import { fetchSupportPage } from "./support-page.fetch";

export const getSupportPage = cache(fetchSupportPage);

export { EMPTY_SUPPORT_PAGE } from "./support-page.types";
export type { NormalizedSupportPage } from "./support-page.types";
