import { Header } from '@/modules/homepage/components/nav/header'
import { Toaster } from 'react-hot-toast'


export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={` antialiased`}
			>
				<Header />
				<main className='flex flex-col min-h-screen bg-[#0f0e0d]'>
					<div className='container mx-auto'>{children}</div>
				</main>
			</body>
		</html>
	)
}
