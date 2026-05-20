"use client";

import React, { useEffect } from "react";
import Link from "next/link";

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
      <body className="h-full bg-background text-foreground antialiased flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="relative mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight">
              A critical error occurred
            </h1>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              The application encountered a critical runtime error. We apologize for the inconvenience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto min-w-[140px] px-6 py-3 bg-primary text-primary-foreground font-gill text-xs uppercase tracking-widest hover:bg-primary/95 active:scale-95 transition-all duration-150"
            >
              Reload Application
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto min-w-[140px] px-6 py-3 border border-border text-foreground font-gill text-xs uppercase tracking-widest hover:bg-accent transition-all duration-150"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
