"use client";

import React from "react";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";

export type ModeType = "light" | "dark" | "system";

export function GluestackUIProvider({
  mode = "system",
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
}) {
  return (
    <OverlayProvider>
      <ToastProvider>{props.children}</ToastProvider>
    </OverlayProvider>
  );
}