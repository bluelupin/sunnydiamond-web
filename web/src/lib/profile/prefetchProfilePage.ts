import { cache } from "react";
import { getProfilePage } from "@/services/profile/profile-page.service";

export const getCachedProfilePage = cache(async () => getProfilePage());
