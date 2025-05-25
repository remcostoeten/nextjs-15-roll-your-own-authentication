import { Navigation } from '@/modules/landing/components';
import { GlowingBento } from '@/modules/landing/components/glowing-bento';
import { Flex } from '@/shared/components/flex';
import { Container } from 'ui';
import FeaturesSection from '../modules/landing/components/features';

export default function HomePage() {
	return (
		<Flex column className="w-screen min-h-screen mx-auto">
			<Navigation />
			<Flex column gap="sm" center>
				<Container>
					<FeaturesSection />
					<GlowingBento />
				</Container>
			</Flex>
		</Flex>
	);
}
