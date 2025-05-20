import { Center } from '@/shared/components/center';
import { Logo } from '@/shared/components/core/logo';

export default function RootLayout({
 	children,
}: {
	children: React.ReactNode;
}) {
	return (
	<Center fullscreen>


		<Logo/>		{children}
	</Center>
	);
}
