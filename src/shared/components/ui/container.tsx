import type { HTMLAttributes } from 'react';
import { cn } from 'utilities';

interface TProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export function Container({ className, ...props }: TProps) {
	return (
		<div className={cn('mx-auto max-w-[1024px] px-4 sm:px-6 lg:px-8', className)} {...props} />
	);
}
