import { ToastProvider } from "@/shared/components/toast";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
	return <ToastProvider><ThemeProvider>{children}</ThemeProvider></ToastProvider>;
}
