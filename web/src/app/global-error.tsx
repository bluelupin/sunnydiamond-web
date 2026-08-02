"use client";

import { useEffect } from "react";
import "./globals.css";
import ErrorPage from "@/features/error/components/ErrorPage";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global Root Layout Error:", error);
  }, [error]);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-white font-body antialiased">
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
