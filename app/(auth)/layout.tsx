import { Center } from '@/shared/components/Center'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <Center>{children} </Center>
}
