'use client';

import { Toaster } from "@/components/primitives/toast";
import { AuthProvider } from "@/features/authentication/context/auth-context";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <AuthProvider>
      <NextThemesProvider {...props}>
        {children}
        <Toaster />
      </NextThemesProvider>
    </AuthProvider>
  );
}
