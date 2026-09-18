import "../global.css";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WatchlistProvider } from "../src/context/WatchlistContext";
import { GluestackUIProvider } from "../src/components/ui/gluestack-ui-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <QueryClientProvider client={queryClient}>
        <WatchlistProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "rgb(var(--color-background-950))" },
              animation: "slide_from_right",
            }}
          />
        </WatchlistProvider>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
