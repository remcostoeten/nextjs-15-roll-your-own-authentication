'use client';

import DottedMap from 'dotted-map';
import { memo } from 'react';

type TMapConfig = {
	height: number;
	grid: 'diagonal';
};

type TSvgOptions = {
	backgroundColor: string;
	color: string;
	radius: number;
};

const MAP_CONFIG: TMapConfig = {
	height: 55,
	grid: 'diagonal',
} as const;

const SVG_OPTIONS: TSvgOptions = {
	backgroundColor: 'var(--color-background)',
	color: 'currentColor',
	radius: 0.15,
} as const;

const map = new DottedMap(MAP_CONFIG);
const points = map.getPoints();

function DottedMapVisualComponent() {
	return (
		<div className="relative overflow-hidden">
			<div className="bg-radial z-1 to-background absolute inset-0 from-transparent to-75%"></div>
			<svg viewBox="0 0 120 60" style={{ background: SVG_OPTIONS.backgroundColor }}>
				{points.map((point, index) => (
					<circle
						key={index}
						cx={point.x}
						cy={point.y}
						r={SVG_OPTIONS.radius}
						fill={SVG_OPTIONS.color}
					/>
				))}
			</svg>
		</div>
	);
}

function LocationIndicatorComponent() {
	return (
		<div className="absolute inset-0 z-10 m-auto size-fit">
			<div className="rounded-(--radius) z-1 bg-muted relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
				<span className="text-lg">🇨🇩</span> Last connection from DR Congo
			</div>
			<div className="rounded-(--radius) absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-md shadow-zinc-950/5 bg-zinc-900"></div>
		</div>
	);
}

export const DottedMapVisual = memo(DottedMapVisualComponent);
export const LocationIndicator = memo(LocationIndicatorComponent);
