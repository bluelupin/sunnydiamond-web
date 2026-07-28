"use client";

import type { ReactNode } from "react";
import { toast as sonnerToast } from "sonner";

type ToastInput =
  | string
  | {
      title?: ReactNode;
      description?: ReactNode;
      variant?: "default" | "destructive";
    };

type ToastResult = {
  id: string;
  dismiss: () => void;
  update: (props: { title?: ReactNode; description?: ReactNode }) => void;
};

function toast(input: ToastInput): ToastResult {
  if (typeof input === "string") {
    const id = sonnerToast(input);
    return {
      id: String(id),
      dismiss: () => sonnerToast.dismiss(id),
      update: () => undefined,
    };
  }

  const title = input.title ?? "Notice";
  const options = {
    description: input.description,
  };

  const id =
    input.variant === "destructive"
      ? sonnerToast.error(title, options)
      : sonnerToast(title, options);

  return {
    id: String(id),
    dismiss: () => sonnerToast.dismiss(id),
    update: (props) => {
      sonnerToast(props.title ?? title, {
        id,
        description: props.description ?? input.description,
      });
    },
  };
}

function useToast() {
  return {
    toasts: [] as Array<{ id: string }>,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
        return;
      }
      sonnerToast.dismiss();
    },
  };
}

export { useToast, toast };
