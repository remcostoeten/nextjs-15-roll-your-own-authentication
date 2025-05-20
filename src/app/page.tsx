import FeaturesSection from '@/components/features-9';
import { GlowingBento } from '@/modules/landing/components/glowing-bento';
import { MainNav } from '@/modules/navigation/components/MainNav';
import { Flex } from '@/shared/components/flex';
import { Container } from '@/shared/components/ui/container';

export default function HomePage() {
	return (
    <Flex column className='w-screen min-h-screen mx-auto'>
		<header className="w-screen sticky top-0 z-50 flex  border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
				<MainNav />
		</header>
<Flex column gap='sm' center >
  <Container>
			<FeaturesSection />
    	<GlowingBento />
</Container>
		</Flex>
    </Flex>
	);
}
