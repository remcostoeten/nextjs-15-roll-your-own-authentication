import Header from '@/components/layout/navigation/Nav';
import { Toaster } from '@/components/primitives/toast';
import AnimatedBackground from '@/components/theme/background/animated-background';
import { ThemeProvider as ColorThemeProvider } from '@/components/theme/theme-context';
import { getUser } from '@/features/authentication/queries/get-user';
import { UserProfile } from '@/features/authentication/types';
import { cn } from '@/lib/utils';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { PageProps, fontMono, fontSans } from './layout';


export default async function RootLayout({
    children,
}: PageProps) {
    const user = await getUser();

    const userProfile: UserProfile = user ? {
        email: user.email || '',
        role: user.role as 'user' | 'admin',
        avatarUrl: user.avatarUrl
    } : {
        email: 'demo@example.com',
        role: 'user',
        avatarUrl: null
    };

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(
                'min-h-screen antialiased',
                fontSans.variable,
                fontMono.variable,
                'font-sans'
            )}>
                <TooltipProvider delayDuration={100}>
                    <NextThemesProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ColorThemeProvider>
                            <Header user={userProfile} />
                            {children}
                            <Toaster />
                            <AnimatedBackground />
                        </ColorThemeProvider>
                    </NextThemesProvider>
                </TooltipProvider>
            </body>
        </html>
    );
}
