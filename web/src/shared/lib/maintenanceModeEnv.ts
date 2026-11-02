/** Edge-safe maintenance env check (no Node.js fs). */
export function isMaintenanceModeEnabledByEnv(): boolean {
  const value = process.env.MAINTENANCE_MODE?.trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}
