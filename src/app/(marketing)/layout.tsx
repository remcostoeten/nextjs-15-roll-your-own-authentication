import { Header } from '@/modules/homepage/components/nav/header'


export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
				<><Header /><main className='flex flex-col min-h-screen bg-[#0f0e0d]'>
			<div className='container mx-auto'>{children}</div>
		</main></>
	)
}
