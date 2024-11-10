'use client'

import AnimateIn from '@/shared/components/ui/nimate-in'

type TestimonialProps = {
	text: string
	author?: string
	tagline?: string
}

const TestimonialText = ({ text }: { text: string }) => {
	return (
		<div className="relative">
			<AnimateIn
				animation="fade"
				delay={0.3}
				className="absolute -top-8 -left-4 text-4xl text-zinc-700"
			>
				"
			</AnimateIn>
			<AnimateIn
				animation="fade"
				delay={0.3}
				className="absolute -bottom-8 -right-4 text-4xl text-zinc-700"
			>
				"
			</AnimateIn>
			<AnimateIn
				words={text}
				animation="both"
				delay={1.03}
				className="text-xl text-zinc-400 font-normal text-left tracking-normal relative z-10"
			/>
		</div>
	)
}

export default function Testimonial({
	text,
	author,
	tagline
}: TestimonialProps) {
	return (
		<AnimateIn animation="fade" delay={0.6} duration={0.5}>
			<blockquote className="relative flex flex-col gap-6 max-w-x1 max-w-lg                                                                                                                 ">
				<div className="relative py-8">
					<TestimonialText text={text} />
				</div>
				<footer className="flex items-center gap-2 -translate-y-10">
					<AnimateIn animation="fade" delay={1.5} duration={0.5}>
						<div
							className="h-10 w-10 rounded-full bg-zinc-800"
							aria-hidden="true"
						/>
					</AnimateIn>
					<div className="flex flex-col">
						<AnimateIn animation="fade" delay={1.7} duration={0.5}>
							<div className="text-sm text-zinc-500">
								{author}
							</div>
						</AnimateIn>
						<AnimateIn animation="fade" delay={1.9} duration={0.5}>
							<div className="text-sm text-zinc-500">
								{tagline}
							</div>
						</AnimateIn>
					</div>
				</footer>
			</blockquote>
		</AnimateIn>
	)
}
