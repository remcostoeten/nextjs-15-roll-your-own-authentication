'use client';

import { Toaster } from "@/components/primitives/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
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
        <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        <Toaster />
      </NextThemesProvider>
    </AuthProvider>
  );
}
