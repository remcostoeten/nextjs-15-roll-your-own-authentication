'use client';

import { cn } from '@/shared/utilities/cn';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const checkboxVariants = cva('relative inline-flex items-center justify-center', {
	variants: {
		variant: {
			rounded: '[&_input]:rounded-full [&_label]:rounded-full',
			square: '[&_input]:rounded-md [&_label]:rounded-md',
		},
		size: {
			sm: 'w-4 h-4',
			md: 'w-6 h-6',
			lg: 'w-8 h-8',
		},
	},
	defaultVariants: {
		variant: 'rounded',
		size: 'md',
	},
});

type BaseCheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

interface CustomCheckboxProps extends BaseCheckboxProps, VariantProps<typeof checkboxVariants> {
	color?: string;
}

const CustomCheckbox = React.forwardRef<HTMLInputElement, CustomCheckboxProps>(
	({ className, variant, size, color = '#866efb', ...props }, ref) => {
		const id = React.useId();
		const uniqueId = `goo-${id}`;

		return (
			<div className={cn('checkbox-wrapper relative', className)}>
				<div className={cn('cbx', checkboxVariants({ variant, size }))}>
					<input
						type="checkbox"
						id={id}
						ref={ref}
						className="absolute inset-0 cursor-pointer appearance-none border-2 border-gray-300 transition-colors checked:border-0"
						style={{ backgroundColor: props.checked ? color : 'transparent' }}
						{...props}
					/>
					<label
						htmlFor={id}
						className="pointer-events-none absolute inset-0 transform-gpu"
					/>
					<svg
						width="15"
						height="14"
						viewBox="0 0 15 14"
						fill="none"
						className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2"
					>
						<path
							d="M2 8.36364L6.23077 12L13 2"
							stroke="white"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeDasharray="19"
							strokeDashoffset="19"
							className="transition-all duration-300 ease-in-out checked:stroke-dashoffset-0 [input:checked+label+svg>&]:stroke-dashoffset-0"
						/>
					</svg>
				</div>

				<svg className="absolute" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<filter id={uniqueId}>
							<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
							<feColorMatrix
								in="blur"
								mode="matrix"
								values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
								result="goo"
							/>
							<feBlend in="SourceGraphic" in2="goo" />
						</filter>
					</defs>
				</svg>

				<style jsx>{`
          .checkbox-wrapper {
            filter: url('#${uniqueId}');
          }

          .cbx input:checked + label {
            animation: splash-${uniqueId} 0.6s ease forwards;
          }

          @keyframes splash-${uniqueId} {
            40% {
              background: ${color};
              box-shadow: 0 -18px 0 -8px ${color},
                16px -8px 0 -8px ${color},
                16px 8px 0 -8px ${color},
                0 18px 0 -8px ${color},
                -16px 8px 0 -8px ${color},
                -16px -8px 0 -8px ${color};
            }

            100% {
              background: ${color};
              box-shadow: 0 -36px 0 -10px transparent,
                32px -16px 0 -10px transparent,
                32px 16px 0 -10px transparent,
                0 36px 0 -10px transparent,
                -32px 16px 0 -10px transparent,
                -32px -16px 0 -10px transparent;
            }
          }
        `}</style>
			</div>
		);
	}
);

CustomCheckbox.displayName = 'CustomCheckbox';

export { CustomCheckbox, type CustomCheckboxProps };
