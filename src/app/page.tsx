import FeaturesSection from '@/components/features-9';
import { MainNav } from '@/modules/navigation/components/MainNav';
import { Flex } from '@/shared/components/flex';

export default function HomePage() {
	return (
    <Flex column>
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<MainNav />
			</div>
		</header>	<main className="min-h-screen">
			<FeaturesSection />
		</main>
    </Flex>
	);
}
