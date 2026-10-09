/** Prefer `{field}Mobile` on small viewports when set; otherwise keep desktop/default copy. */
export function pickResponsiveDialogCopy<
  T extends Record<string, unknown>,
  K extends keyof T & string,
>(block: T, key: K, isMobile: boolean): string {
  if (isMobile) {
    const mobileKey = `${key}Mobile` as keyof T;
    const mobileValue = block[mobileKey];
    if (typeof mobileValue === "string" && mobileValue.trim()) {
      return mobileValue;
    }
  }

  const value = block[key];
  return typeof value === "string" ? value : "";
};
