'use client'

import { useEffect } from 'react'

export function HeatmapTracker() {
	useEffect(() => {
		let clicks: Array<{ x: number; y: number; timestamp: string }> = []
		let scrollPositions: Array<{ depth: number; timestamp: string }> = []

		const trackClick = (e: MouseEvent) => {
			clicks.push({
				x: e.pageX,
				y: e.pageY,
				timestamp: new Date().toISOString()
			})
		}

		const trackScroll = () => {
			const maxScroll =
				document.documentElement.scrollHeight - window.innerHeight
			const currentScroll = window.scrollY
			const scrollDepth = (currentScroll / maxScroll) * 100

			scrollPositions.push({
				depth: scrollDepth,
				timestamp: new Date().toISOString()
			})
		}

		// Send data every 5 seconds if there's new data
		const interval = setInterval(() => {
			if (clicks.length || scrollPositions.length) {
				fetch('/api/analytics/heatmap', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ clicks, scrollPositions })
				})
				clicks = []
				scrollPositions = []
			}
		}, 5000)

		window.addEventListener('click', trackClick)
		window.addEventListener('scroll', trackScroll)

		return () => {
			window.removeEventListener('click', trackClick)
			window.removeEventListener('scroll', trackScroll)
			clearInterval(interval)
		}
	}, [])

	return null
}
