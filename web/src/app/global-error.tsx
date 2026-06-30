"use client";

import { useEffect } from "react";
import ErrorPage from "@/features/error/components/ErrorPage";
import { inter, playfairDisplay } from "@/shared/lib/fonts";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global Root Layout Error:", error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
      >
        <ErrorPage
          variant="server-unavailable"
          onRetry={reset}
          errorCode={error.digest}
          className="min-h-screen"
        />
      </body>
    </html>
  );
}
