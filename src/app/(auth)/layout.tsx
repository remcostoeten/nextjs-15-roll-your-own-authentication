import { Center } from '@/shared/components/center';

export default function RootLayout({ children }: PageProps) {
	return <Center fullscreen>{children}</Center>;
}
