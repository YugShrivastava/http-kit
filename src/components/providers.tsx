"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Navbar } from "./navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

function ClerkWithTheme({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  if (!resolvedTheme) return <ClerkProvider>{children}</ClerkProvider>;
  return (
    <ClerkProvider
      appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }}
    >
      {children}
    </ClerkProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkWithTheme>
        <>
          <Navbar />
          <main className="w-full flex-1">{children}</main>
        </>
      </ClerkWithTheme>
    </NextThemesProvider>
  );
}
