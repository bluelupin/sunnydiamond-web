function readNestedErrorMessage(error: Record<string, unknown>): string | null {
  const nestedError = error.error;

  if (typeof nestedError === "string" && nestedError.trim()) {
    return nestedError.trim();
  }

  if (nestedError && typeof nestedError === "object" && nestedError !== null) {
    const nestedMessage = (nestedError as { message?: unknown }).message;
    if (typeof nestedMessage === "string" && nestedMessage.trim()) {
      return nestedMessage.trim();
    }
  }

  return null;
}

export function getApiErrorMessage(error: unknown): string {
  if (!error) {
    return "";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    const nestedMessage = readNestedErrorMessage(record);
    if (nestedMessage) {
      return nestedMessage;
    }

    const message = record.message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }

    try {
      return JSON.stringify(error);
    } catch {
      return "";
    }
  }

  return "";
}
