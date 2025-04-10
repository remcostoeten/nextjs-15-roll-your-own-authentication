import { Center } from '@/shared/components/center'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <Center>{children} </Center>
}
