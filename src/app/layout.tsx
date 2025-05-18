import { AuthStateWidget } from '@/modules/authenticatie/ui/AuthStateWidget';
import { ToastProvider } from '@/shared/components/ui/toast-provider';
import { geistMono } from 'core/config/fonts';
import { baseMetadata } from 'core/config/metadata';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/main.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	...baseMetadata(),
};

export const dynamic = 'force-static';
export const preferredRegion = 'home';
export const revalidate = false;

function ThemeScript() {
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: `
          (function() {
            try {
              // Add no-transitions class to prevent transition flashing
              document.documentElement.classList.add('no-transitions');

              const storedTheme = localStorage.getItem('theme')
              if (!storedTheme) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                document.documentElement.setAttribute('data-theme', prefersDark ? 'catpuccini-dark' : 'catpuccini')
                if (prefersDark) document.documentElement.classList.add('dark')
              } else {
                document.documentElement.setAttribute('data-theme', storedTheme)
                if (storedTheme.includes('-dark')) document.documentElement.classList.add('dark')
              }

              // Remove no-transitions class after a short delay
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  document.documentElement.classList.remove('no-transitions');
                });
              });
            } catch (e) {}
          })();
        `,
			}}
		/>
	);
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${geistMono.variable} ${geistMono.variable} ${inter.className}`}
			suppressHydrationWarning
		>
			<head>
				<ThemeScript />
			</head>
			<body>
				<AuthStateWidget />
				{children}
				<ToastProvider />
			</body>
		</html>
	);
}
