"use client";

import { createContext, useContext, type ReactNode } from "react";

const NotFoundPageShellContext = createContext(false);

/** Enables Figma 7332:67685 surfaces (header #FBFAF6) only on the global 404 page. */
export function NotFoundPageShellProvider({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <NotFoundPageShellContext.Provider value={active}>{children}</NotFoundPageShellContext.Provider>
  );
}

export function useNotFoundPageShell(): boolean {
  return useContext(NotFoundPageShellContext);
}
