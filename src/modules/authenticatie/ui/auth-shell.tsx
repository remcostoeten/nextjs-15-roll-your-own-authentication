'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { useRouter } from 'next/navigation';
import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { cn } from 'utilities';

type tAuthShellProps = {
	title: string;
	subtitle: string;
	formContent: ReactNode;
	footerLink?: { href: string; label: string };
	graphic?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export default function AuthShell({
	title,
	subtitle,
	formContent,
	footerLink,
	graphic,
	className,
	...props
}: tAuthShellProps) {
	const router = useRouter();
	const [mounted, setMounted] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleNavigate = (href: string) => {
		setIsTransitioning(true);
		router.push(href);
	};

	if (!mounted) {
		return (
			<div
				className={cn('flex min-h-screen items-center justify-center', className)}
				{...props}
			>
				<div className="w-full max-w-[720px] px-4">
					<Card className="overflow-hidden py-0 animate-pulse">
						<CardContent className="grid p-0 md:grid-cols-2 h-full min-h-[500px]">
							<div className="bg-muted" />
							<div className="bg-muted" />
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				'flex min-h-screen items-center justify-center transition-opacity duration-300',
				isTransitioning ? 'opacity-0' : 'opacity-100',
				className
			)}
			{...props}
		>
			<div className="w-full max-w-[720px] px-4">
				<Card className="overflow-hidden py-0">
					<CardContent className="grid p-0 md:grid-cols-2 h-full">
						<form
							className={cn(
								'pt-6 flex flex-col gap-6 p-6 md:p-8 transition-transform duration-300',
								isTransitioning ? 'translate-x-[-100%]' : 'translate-x-0'
							)}
						>
							<div className="flex flex-col items-center text-center">
								<h1 className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 bg-clip-text text-transparent text-3xl font-bold animate-gradient-x">
									{title}
								</h1>
								<p className="text-balance text-muted-foreground">{subtitle}</p>
							</div>

							{formContent}

							{footerLink && (
								<div className="text-center text-sm">
									<button
										type="button"
										className="underline underline-offset-4 transition-colors hover:text-primary"
										onClick={() => handleNavigate(footerLink.href)}
									>
										{footerLink.label}
									</button>
								</div>
							)}
						</form>

						<div
							className={cn(
								'relative hidden h-full min-h-[500px] bg-muted md:block overflow-hidden transition-transform duration-300',
								isTransitioning ? 'translate-x-[100%]' : 'translate-x-0'
							)}
						>
							{graphic}
						</div>
					</CardContent>
				</Card>

				<div className="mt-4 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
					By clicking continue, you agree to our{' '}
					<a href="#" className="transition-colors">
						Terms of Service
					</a>{' '}
					and{' '}
					<a href="#" className="transition-colors">
						Privacy Policy
					</a>
					.
				</div>
			</div>
		</div>
	);
}
