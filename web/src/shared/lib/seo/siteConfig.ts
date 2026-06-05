export type AppEnv = "local" | "qa" | "production";

export interface SiteEnvConfig {
  env: AppEnv;
  baseUrl: string; // full origin, no trailing slash
  indexing: boolean; // should search engines index this env
  label?: string;
}

const ENV =
  (process.env.NEXT_PUBLIC_APP_ENV as AppEnv) ||
  (process.env.NODE_ENV === "development" ? "local" : "production");

const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const effectiveBaseUrl = envSiteUrl ? envSiteUrl.replace(/\/$/, "") : undefined;

const configs: Record<AppEnv, SiteEnvConfig> = {
  local: {
    env: "local",
    baseUrl: "http://localhost:3000",
    indexing: false,
    label: "Local",
  },
  qa: {
    env: "qa",
    baseUrl: "https://sunnydiamonds-web-dev.on-forge.com/",
    indexing: true,
    label: "QA",
  },
  production: {
    env: "production",
    baseUrl:
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://sunnydiamonds.com",
    indexing: true,
    label: "Production",
  },
};

export const siteEnv: SiteEnvConfig = {
  ...(configs[ENV] ?? configs.production),
  baseUrl: effectiveBaseUrl ?? configs[ENV]?.baseUrl ?? configs.production.baseUrl,
};

export const getAbsoluteUrl = (path = "/") => {
  try {
    return new URL(path, siteEnv.baseUrl).toString();
  } catch {
    return `${siteEnv.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }
};

export default siteEnv;
