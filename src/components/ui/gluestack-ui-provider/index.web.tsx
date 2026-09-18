"use client";

import React, { useEffect, useLayoutEffect } from "react";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";

export type ModeType = "light" | "dark" | "system";

export const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function GluestackUIProvider({
  mode = "dark",
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
}) {
  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const doc = document.documentElement;
    doc.classList.add("dark");
    doc.classList.remove("light");
    doc.style.colorScheme = "dark";
  }, [mode]);

  return (
    <OverlayProvider>
      <ToastProvider>{props.children}</ToastProvider>
    </OverlayProvider>
  );
}