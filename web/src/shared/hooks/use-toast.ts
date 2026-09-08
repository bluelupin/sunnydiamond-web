"use client";

import type { ReactNode } from "react";
import {
  dismissGlobalAppStatusToast,
  showGlobalAppStatusToast,
} from "@/shared/context/AppStatusToastContext";
import {
  formatAppStatusToastMessage,
  type AppStatusToastInput,
} from "@/shared/lib/appStatusToastMessage";

type ToastInput = AppStatusToastInput;

type ToastResult = {
  id: string;
  dismiss: () => void;
  update: (props: { title?: ReactNode; description?: ReactNode }) => void;
};

const GLOBAL_TOAST_ID = "app-status-toast";

function toast(input: ToastInput): ToastResult {
  const message = formatAppStatusToastMessage(input);
  showGlobalAppStatusToast(message);

  return {
    id: GLOBAL_TOAST_ID,
    dismiss: dismissGlobalAppStatusToast,
    update: (props) => {
      showGlobalAppStatusToast(
        formatAppStatusToastMessage({
          title: props.title,
          description: props.description,
        }),
      );
    },
  };
}

function useToast() {
  return {
    toasts: [] as Array<{ id: string }>,
    toast,
    dismiss: dismissGlobalAppStatusToast,
  };
}

export { useToast, toast };
export type { ToastInput };
