import Link from 'next/link'

export default function Page() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<main className="flex-1">
				<section className="container flex flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
					<h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
						Build your own authentication
					</h1>
					<p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
						A minimal, open-source authentication example showcasing
						how to implement secure user authentication in Next.js
						without external providers.
					</p>
					<div className="flex gap-4">
						<Link
							href="/sign-up"
							className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Get Started
						</Link>
						<Link
							href="https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							GitHub
						</Link>
					</div>
				</section>
			</main>
		</div>
	)
}
