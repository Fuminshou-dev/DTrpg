"use client";

import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ConvexClientProvider>
  );
}
