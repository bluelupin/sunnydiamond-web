"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { profileTabsContent } from "../data/profileContent";

const ordersContent = profileTabsContent.orders;

type UseOrderInvoiceDownloadResult = {
  download: (orderNumber: string) => Promise<void>;
  downloadingNumber: string | null;
  error: string | null;
};

export function useOrderInvoiceDownload(): UseOrderInvoiceDownloadResult {
  const { toast } = useToast();
  const [downloadingNumber, setDownloadingNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(
    async (orderNumber: string) => {
      const invoiceUrl = `/api/customer/orders/${encodeURIComponent(orderNumber)}/invoice`;

      setDownloadingNumber(orderNumber);
      setError(null);

      try {
        // The route 302s to a short-lived signed URL, so failures (no invoice yet,
        // expired session) must be caught before the browser navigates away.
        const response = await fetch(invoiceUrl, { redirect: "manual", cache: "no-store" });

        if (response.type === "opaqueredirect" || response.ok) {
          window.location.assign(invoiceUrl);
          return;
        }

        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? ordersContent.invoiceErrorDescription);
      } catch (downloadError) {
        const message =
          downloadError instanceof Error
            ? downloadError.message
            : ordersContent.invoiceErrorDescription;

        setError(message);
        toast({
          title: ordersContent.invoiceErrorTitle,
          description: message,
          variant: "destructive",
        });
      } finally {
        setDownloadingNumber(null);
      }
    },
    [toast],
  );

  return { download, downloadingNumber, error };
}
