'use client';

import { Header } from '@/components/header';
import GlowingBento from '@/modules/landing/components/glowing-bento';
import { Flex } from '@/shared/components/flex';
import { Container } from 'ui';
import  FeaturesSection from '../modules/landing/components/features';

/**
 * Renders the main home page layout with a header and a features section inside styled containers.
 *
 * @returns The JSX structure for the home page.
 */
export default function HomePage() {
	return (
		<>
			<Header />
			<Flex column className="w-screen min-h-screen mx-auto relative bg-background">
				<Container>
					<FeaturesSection />
				</Container>
			</Flex>
		</>
	);
}
