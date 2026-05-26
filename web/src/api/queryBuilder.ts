export function buildQueryString(params: Record<string, unknown>): string {
  const parts: string[] = [];

  function serialize(key: string, value: unknown): void {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => serialize(`${key}[${index}]`, item));
      return;
    }

    if (typeof value === "object") {
      Object.entries(value).forEach(([childKey, childValue]) => {
        const nestedKey = key ? `${key}[${childKey}]` : childKey;
        serialize(nestedKey, childValue);
      });
      return;
    }

    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }

  Object.entries(params).forEach(([key, value]) => serialize(key, value));
  return parts.join("&");
}
