import type { ReactNode } from "react";

export type AppStatusToastInput =
  | string
  | {
      title?: ReactNode;
      description?: ReactNode;
      variant?: "default" | "destructive";
    };

export function formatAppStatusToastMessage(input: AppStatusToastInput): string {
  if (typeof input === "string") {
    return input.trim();
  }

  const title =
    input.title != null && input.title !== "" ? String(input.title).trim() : "";
  const description =
    input.description != null && input.description !== ""
      ? String(input.description).trim()
      : "";

  if (title && description) {
    return `${title}. ${description}`;
  }

  return title || description || "Notice";
}
