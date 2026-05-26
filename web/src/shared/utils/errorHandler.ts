export function getApiErrorMessage(error: unknown): string {
  if (!error) {
    return "An unexpected API error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return "An unexpected API error occurred.";
    }
  }

  return "An unexpected API error occurred.";
}
