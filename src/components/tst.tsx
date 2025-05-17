import { Flex } from '@/shared/components/flex';
import { Logo } from 'components/core/logo';
import { Button, Card, Input } from 'ui';

export default function Home() {
	return (
		<Card className="flex h-screen w-screen items-center justify-center">
			<Logo />
			<Flex column gap="md">
				<Input type="email" placeholder="Email" />
				<Button>Click me</Button>
			</Flex>
		</Card>
	);
}
