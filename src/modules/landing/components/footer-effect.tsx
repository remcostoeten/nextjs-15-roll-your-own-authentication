'use client';

import React, { useRef } from 'react';
import { useCanvas } from '../hooks/use-canvas';
import '../styles/footer-effect.css';

const FooterEffect: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useCanvas(
		canvasRef as React.RefObject<HTMLCanvasElement>,
		containerRef as React.RefObject<HTMLDivElement>
	);

	return (
		<div ref={containerRef} className="a-hole">
			<canvas ref={canvasRef} className="js-canvas"></canvas>
			<div className="aura"></div>
			<div className="overlay"></div>
		</div>
	);
};

export default FooterEffect;
