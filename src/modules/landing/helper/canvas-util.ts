export const initDiscs = (startDisc: any, endDisc: any, state: any) => {
	const { width, height } = state;
	const discs = [];
	const totalDiscs = 50; // Reduced for better performance

	let prevBottom = height;
	const clip: any = {};

	for (let i = 0; i < totalDiscs; i++) {
		const p = i / totalDiscs;
		const phase = Math.sin(p * Math.PI);

		const disc = {
			p,
			phase,
			x: width * 0.5,
			y: height * (0.3 + p * 0.5),
			w: width * 0.4 * (1 - p),
			h: height * 0.2 * (1 - p),
		};

		const bottom = disc.y + disc.h;

		if (bottom <= prevBottom) {
			clip.disc = { ...disc };
			clip.i = i;
		}

		prevBottom = bottom;
		discs.push(disc);
	}

	clip.path = new Path2D();
	clip.path.rect(0, 0, width, height);

	state.clip = clip;
	return discs;
};

export const initLines = (discs: any[], state: any) => {
	const { width, height, clip, linesCtx } = state;
	const lines = [];

	if (!linesCtx) return lines;

	const totalLines = 30; // Reduced for performance
	const angleStep = (Math.PI * 2) / totalLines;

	for (let i = 0; i < totalLines; i++) {
		lines.push([]);
	}

	discs.forEach((disc) => {
		for (let i = 0; i < totalLines; i++) {
			const angle = i * angleStep + disc.phase;
			const p = {
				x: disc.x + Math.cos(angle) * disc.w,
				y: disc.y + Math.sin(angle) * disc.h,
			};
			lines[i].push(p);
		}
	});

	linesCtx.strokeStyle = 'rgba(14, 165, 233, 0.1)';
	linesCtx.lineWidth = 1;

	lines.forEach((line) => {
		linesCtx.beginPath();
		line.forEach((p, i) => {
			if (i === 0) {
				linesCtx.moveTo(p.x, p.y);
			} else {
				linesCtx.lineTo(p.x, p.y);
			}
		});
		linesCtx.stroke();
	});

	return lines;
};

export const initParticles = (state: any) => {
	const { width, height } = state;
	const particles = [];
	const totalParticles = 40;

	for (let i = 0; i < totalParticles; i++) {
		particles.push({
			x: Math.random() * width,
			y: Math.random() * height,
			size: Math.random() * 2 + 1,
			speed: Math.random() * 1 + 0.5,
			opacity: Math.random() * 0.5 + 0.1,
		});
	}

	return particles;
};

export const tweenDisc = (disc: any, startDisc: any, endDisc: any) => {
	const t = (1 - Math.cos(disc.p * Math.PI)) / 2;
	disc.x = startDisc.x;
	disc.y = startDisc.y + (endDisc.y - startDisc.y) * t;
	disc.w *= 1 - t * 0.5;
	disc.h *= 1 - t * 0.5;
	disc.phase = (disc.phase + 0.01) % (Math.PI * 2);
	return disc;
};

export const tweenValue = (start: number, end: number, p: number, ease = '') => {
	const t = (1 - Math.cos(p * Math.PI)) / 2;
	return start + (end - start) * t;
};
