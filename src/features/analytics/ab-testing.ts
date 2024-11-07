type Experiment = {
	id: string
	variants: string[]
	weights?: number[]
}

export function assignVariant(experiment: Experiment): string {
	const storedVariant = localStorage.getItem(`exp_${experiment.id}`)
	if (storedVariant) return storedVariant

	const variant = weightedRandom(experiment.variants, experiment.weights)
	localStorage.setItem(`exp_${experiment.id}`, variant)

	trackEvent('experiment_assigned', {
		experimentId: experiment.id,
		variant
	})

	return variant
}

function weightedRandom(items: string[], weights?: number[]): string {
	if (!weights) return items[Math.floor(Math.random() * items.length)]

	const totalWeight = weights.reduce((a, b) => a + b, 0)
	let random = Math.random() * totalWeight

	for (let i = 0; i < items.length; i++) {
		if (random < weights[i]) return items[i]
		random -= weights[i]
	}

	return items[0]
}
