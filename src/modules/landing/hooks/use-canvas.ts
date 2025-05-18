import { RefObject, useEffect, useRef } from 'react';
import { initDiscs, initLines, initParticles } from '../helper/canvas-util';

interface RenderState {
	width: number;
	height: number;
	dpi: number;
	discs: any[];
	lines: any[];
	particles: any[];
	startDisc: any;
	endDisc: any;
	clip: any;
	particleArea: any;
	linesCanvas: OffscreenCanvas | null;
	linesCtx: CanvasRenderingContext2D | null;
	animationId: number | null;
}

export const useCanvas = (
	canvasRef: RefObject<HTMLCanvasElement>,
	containerRef: RefObject<HTMLDivElement>
) => {
	const renderStateRef = useRef<RenderState>({
		width: 0,
		height: 0,
		dpi: window.devicePixelRatio,
		discs: [],
		lines: [],
		particles: [],
		startDisc: null,
		endDisc: null,
		clip: {},
		particleArea: {},
		linesCanvas: null,
		linesCtx: null,
		animationId: null,
	});

	// Setup and initialize canvas
	const setupCanvas = () => {
		if (!canvasRef.current || !containerRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const rect = containerRef.current.getBoundingClientRect();

		// Set canvas size
		const width = rect.width;
		const height = rect.height;
		const dpi = window.devicePixelRatio;

		canvas.width = width * dpi;
		canvas.height = height * dpi;

		// Initialize state
		const state = renderStateRef.current;
		state.width = width;
		state.height = height;
		state.dpi = dpi;

		// Initialize the disc shapes
		state.startDisc = {
			x: width * 0.5,
			y: height * 0.45,
			w: width * 0.75,
			h: height * 0.7,
		};

		state.endDisc = {
			x: width * 0.5,
			y: height * 0.95,
			w: 0,
			h: 0,
		};

		// Setup discs, lines, particles
		state.discs = initDiscs(state.startDisc, state.endDisc, state);
		state.linesCanvas = new OffscreenCanvas(width, height);
		state.linesCtx = state.linesCanvas.getContext('2d');
		state.lines = initLines(state.discs, state);
		state.particles = initParticles(state);
	};

	// Animation tick function
	const tick = () => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const state = renderStateRef.current;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Scale for proper rendering
		ctx.save();
		ctx.scale(state.dpi, state.dpi);

		// Move/update elements
		moveDiscs(state);
		moveParticles(state);

		// Draw elements
		drawDiscs(ctx, state);
		drawLines(ctx, state);
		drawParticles(ctx, state);

		ctx.restore();

		// Continue animation
		state.animationId = requestAnimationFrame(tick);
	};

	// Move discs
	const moveDiscs = (state: RenderState) => {
		state.discs.forEach((disc) => {
			disc.p = (disc.p + 0.001) % 1;
			tweenDisc(disc, state.startDisc, state.endDisc);
		});
	};

	// Move particles
	const moveParticles = (state: RenderState) => {
		state.particles.forEach((particle) => {
			particle.p = 1 - particle.y / state.particleArea.h;
			particle.x = particle.sx + particle.dx * particle.p;
			particle.y -= particle.vy;

			if (particle.y < 0) {
				const newParticle = initNewParticle(state);
				particle.y = newParticle.y;
			}
		});
	};

	// Draw discs
	const drawDiscs = (ctx: CanvasRenderingContext2D, state: RenderState) => {
		ctx.strokeStyle = '#444';
		ctx.lineWidth = 2;

		// Outer disc
		const outerDisc = state.startDisc;

		ctx.beginPath();
		ctx.ellipse(outerDisc.x, outerDisc.y, outerDisc.w, outerDisc.h, 0, 0, Math.PI * 2);
		ctx.stroke();
		ctx.closePath();

		// Inner discs
		state.discs.forEach((disc, i) => {
			if (i % 5 !== 0) return;

			if (disc.w < state.clip.disc.w - 5) {
				ctx.save();
				ctx.clip(state.clip.path);
			}

			ctx.beginPath();
			ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
			ctx.stroke();
			ctx.closePath();

			if (disc.w < state.clip.disc.w - 5) {
				ctx.restore();
			}
		});
	};

	// Draw lines
	const drawLines = (ctx: CanvasRenderingContext2D, state: RenderState) => {
		if (state.linesCanvas) {
			ctx.drawImage(state.linesCanvas, 0, 0);
		}
	};

	// Draw particles
	const drawParticles = (ctx: CanvasRenderingContext2D, state: RenderState) => {
		ctx.save();

		if (state.clip.path) {
			ctx.clip(state.clip.path);
		}

		state.particles.forEach((particle) => {
			ctx.fillStyle = particle.c;
			ctx.beginPath();
			ctx.rect(particle.x, particle.y, particle.r, particle.r);
			ctx.closePath();
			ctx.fill();
		});

		ctx.restore();
	};

	// Initialize a new particle
	const initNewParticle = (state: RenderState) => {
		return {
			y: state.particleArea.h,
			vy: 0.5 + Math.random(),
		};
	};

	// Tween a disc between start and end positions
	const tweenDisc = (disc: any, startDisc: any, endDisc: any) => {
		disc.x = tweenValue(startDisc.x, endDisc.x, disc.p);
		disc.y = tweenValue(startDisc.y, endDisc.y, disc.p, 'inExpo');
		disc.w = tweenValue(startDisc.w, endDisc.w, disc.p);
		disc.h = tweenValue(startDisc.h, endDisc.h, disc.p);
		return disc;
	};

	// Tween a value with optional easing
	const tweenValue = (start: number, end: number, p: number, ease = '') => {
		const delta = end - start;

		let easeFn = (t: number) => t; // Linear by default

		if (ease === 'inExpo') {
			easeFn = (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1)));
		}

		return start + delta * easeFn(p);
	};

	// Handle resize
	const handleResize = () => {
		if (renderStateRef.current.animationId) {
			cancelAnimationFrame(renderStateRef.current.animationId);
		}

		setupCanvas();
		renderStateRef.current.animationId = requestAnimationFrame(tick);
	};

	// Initialize effect
	useEffect(() => {
		setupCanvas();
		renderStateRef.current.animationId = requestAnimationFrame(tick);

		window.addEventListener('resize', handleResize);

		return () => {
			if (renderStateRef.current.animationId) {
				cancelAnimationFrame(renderStateRef.current.animationId);
			}
			window.removeEventListener('resize', handleResize);
		};
	}, []);
};
