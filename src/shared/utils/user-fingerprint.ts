import { UAParser } from 'ua-parser-js'
import { hashSync } from '@/shared/utils/crypto'

interface BrowserMetrics {
	userAgent: string
	language: string
	colorDepth: number
	deviceMemory?: number
	hardwareConcurrency: number
	resolution: string
	timezone: string
	sessionStorage: boolean
	localStorage: boolean
	indexedDB: boolean
	cpuClass?: string
	platform: string
	plugins: string[]
	canvas: string
	webgl: string
	webglVendor: string
	adBlock: boolean
	fonts: string[]
	audio: string
}

/**
 * Generates a canvas fingerprint
 */
const getCanvasFingerprint = (): string => {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')
	if (!ctx) return ''

	// Draw some unique patterns
	canvas.width = 200
	canvas.height = 50
	ctx.textBaseline = 'top'
	ctx.font = '14px Arial'
	ctx.fillStyle = '#f60'
	ctx.fillRect(125, 1, 62, 20)
	ctx.fillStyle = '#069'
	ctx.fillText('Fingerprint', 2, 15)
	ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
	ctx.fillText('Canvas', 4, 17)

	return canvas.toDataURL()
}

/**
 * Gets WebGL fingerprint
 */
const getWebGLFingerprint = (): { renderer: string; vendor: string } => {
	const canvas = document.createElement('canvas')
	const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

	if (!gl) return { renderer: '', vendor: '' }

	// Type assertion since we know these are WebGL specific parameters
	const glContext = gl as WebGLRenderingContext

	return {
		renderer: glContext.getParameter(glContext.RENDERER) || '',
		vendor: glContext.getParameter(glContext.VENDOR) || '',
	}
}

/**
 * Checks for common ad blockers
 */
const checkAdBlock = async (): Promise<boolean> => {
	const testElement = document.createElement('div')
	testElement.className = 'adsbox'
	document.body.appendChild(testElement)

	await new Promise((resolve) => setTimeout(resolve, 100))
	const isAdBlocked = testElement.offsetHeight === 0
	document.body.removeChild(testElement)

	return isAdBlocked
}

/**
 * Gets available system fonts
 */
const getAvailableFonts = async (): Promise<string[]> => {
	if (!document.fonts || !document.fonts.check) return []

	const fontList = [
		'Arial',
		'Times New Roman',
		'Courier New',
		'Georgia',
		'Verdana',
		'Helvetica',
		'Comic Sans MS',
		'Impact',
		'Tahoma',
		'Terminal',
	]

	const availableFonts = await Promise.all(
		fontList.map(async (font) => {
			const isAvailable = await document.fonts.check(`12px "${font}"`)
			return isAvailable ? font : ''
		})
	)

	return availableFonts.filter(Boolean)
}

/**
 * Gets audio fingerprint
 */
const getAudioFingerprint = (): string => {
	try {
		const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
		const oscillator = audioContext.createOscillator()
		const analyser = audioContext.createAnalyser()
		const gainNode = audioContext.createGain()
		const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1)

		gainNode.gain.value = 0 // Mute the sound
		oscillator.type = 'triangle' // Use triangle wave
		oscillator.connect(analyser)
		analyser.connect(scriptProcessor)
		scriptProcessor.connect(gainNode)
		gainNode.connect(audioContext.destination)

		oscillator.start(0)

		const audioData = new Float32Array(analyser.frequencyBinCount)
		analyser.getFloatFrequencyData(audioData)

		oscillator.stop()
		audioContext.close()

		return hashSync(audioData.join(','))
	} catch (e) {
		return ''
	}
}

/**
 * Generates a comprehensive browser fingerprint
 */
export const generateFingerprint = async (): Promise<string> => {
	const parser = new UAParser()
	const ua = parser.getResult()

	const metrics: BrowserMetrics = {
		userAgent: navigator.userAgent,
		language: navigator.language,
		colorDepth: screen.colorDepth,
		deviceMemory: (navigator as any).deviceMemory,
		hardwareConcurrency: navigator.hardwareConcurrency,
		resolution: `${screen.width}x${screen.height}x${screen.pixelDepth}`,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		sessionStorage: !!window.sessionStorage,
		localStorage: !!window.localStorage,
		indexedDB: !!window.indexedDB,
		cpuClass: (navigator as any).cpuClass,
		platform: navigator.platform,
		plugins: Array.from(navigator.plugins).map((p) => p.name),
		canvas: getCanvasFingerprint(),
		webgl: getWebGLFingerprint().renderer,
		webglVendor: getWebGLFingerprint().vendor,
		adBlock: await checkAdBlock(),
		fonts: await getAvailableFonts(),
		audio: getAudioFingerprint(),
	}

	// Create a stable hash from all metrics
	const fingerprint = hashSync(JSON.stringify(metrics))

	return fingerprint
}

/**
 * Validates if the current fingerprint matches the stored one
 */
export const validateFingerprint = async (storedFingerprint: string): Promise<boolean> => {
	const currentFingerprint = await generateFingerprint()
	return currentFingerprint === storedFingerprint
}

/**
 * Gets IP address (Note: This requires server-side implementation)
 */
export const getIpAddress = async (): Promise<string> => {
	try {
		const response = await fetch('https://api.ipify.org?format=json')
		const data = await response.json()
		return data.ip
	} catch (e) {
		console.error('Failed to get IP address:', e)
		return ''
	}
}
