'use client';

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useId } from 'react';

export type tSplashCheckbox = {
	checked: boolean;
	onChange: () => void;
	size?: number;
	color?: string;
	variant?: 'round' | 'square';
};

const checkboxStyles = cva(
	'absolute top-0 left-0 border-2 appearance-none cursor-pointer transition',
	{
		variants: {
			variant: {
				round: 'rounded-full',
				square: 'rounded-[6px]',
			},
		},
		defaultVariants: {
			variant: 'round',
		},
	}
);

export const CustomCheckbox = ({
	checked,
	onChange,
	size = 24,
	color = '#866efb',
	variant = 'round',
}: tSplashCheckbox) => {
	const id = useId();

	return (
		<div className="relative" style={{ width: size, height: size }}>
			<div className="relative" style={{ width: size, height: size }}>
				<input
					type="checkbox"
					id={id}
					checked={checked}
					onChange={onChange}
					className={clsx(
						checkboxStyles({ variant }),
						'z-10',
						'border-neutral-300',
						'w-full h-full'
					)}
					style={{
						WebkitTapHighlightColor: 'transparent',
					}}
				/>
				<label
					htmlFor={id}
					className={clsx(
						'absolute top-0 left-0 pointer-events-none',
						variant === 'round' ? 'rounded-full' : 'rounded-[6px]'
					)}
					style={{
						width: size,
						height: size,
					}}
				/>
				<svg
					className="absolute z-20 pointer-events-none"
					viewBox="0 0 15 14"
					width={size * 0.6}
					height={size * 0.6}
					style={{
						top: size * 0.2,
						left: size * 0.17,
					}}
					fill="none"
				>
					<motion.path
						d="M2 8.36364L6.23077 12L13 2"
						stroke="#fff"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeDasharray="19"
						strokeDashoffset={checked ? 0 : 19}
						transition={{
							delay: 0.2,
							duration: 0.3,
							ease: 'easeInOut',
						}}
					/>
				</svg>
			</div>

			{/* Goo filter defs */}
			<svg className="absolute w-0 h-0">
				<defs>
					<filter id="goo-12">
						<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
						<feColorMatrix
							in="blur"
							result="goo-12"
							mode="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
						/>
						<feBlend in="SourceGraphic" in2="goo-12" />
					</filter>
				</defs>
			</svg>

			<style jsx>{`
        input:checked + label {
          animation: splash-12 0.6s ease forwards;
          background: ${color};
        }

        @keyframes splash-12 {
          40% {
            background: ${color};
            box-shadow:
              0 -18px 0 -8px ${color},
              16px -8px 0 -8px ${color},
              16px 8px 0 -8px ${color},
              0 18px 0 -8px ${color},
              -16px 8px 0 -8px ${color},
              -16px -8px 0 -8px ${color};
          }

          100% {
            background: ${color};
            box-shadow:
              0 -36px 0 -10px transparent,
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
};
