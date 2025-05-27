'use client';

import { Header } from '@/components/header';
import GlowingBento from '@/modules/landing/components/glowing-bento';
import { Flex } from '@/shared/components/flex';
import { Container } from 'ui';
import FeaturesSection from '../modules/landing/components/features';

export default function HomePage() {
	return (
		<>
			<Header />
			<Flex column className="w-screen min-h-screen mx-auto relative bg-background">
				<Container>
					<FeaturesSection />
					<GlowingBento />
				</Container>
			</Flex>
		</>
	);
}
