'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { X, Smile, Frown, Meh, Send, Loader2 } from 'lucide-react'
import { Portal } from './portal'

interface FeedbackModalProps {
	isOpen: boolean
	onClose: () => void
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
	const [step, setStep] = useState(1)
	const [sentiment, setSentiment] = useState<
		'positive' | 'neutral' | 'negative' | null
	>(null)
	const [feedbackText, setFeedbackText] = useState('')
	const [email, setEmail] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isVisible, setIsVisible] = useState(false)
	const [isExiting, setIsExiting] = useState(false)
	const [isStepTransitioning, setIsStepTransitioning] = useState(false)
	const [stepDirection, setStepDirection] = useState<'next' | 'prev'>('next')

	// Handle modal visibility with animation
	useEffect(() => {
		if (isOpen) {
			setIsVisible(true)
		} else {
			setIsExiting(true)
			const timer = setTimeout(() => {
				setIsVisible(false)
				setIsExiting(false)
			}, 200)
			return () => clearTimeout(timer)
		}
	}, [isOpen])

	// Close on escape key
	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') handleClose()
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEsc)
		}

		return () => {
			document.removeEventListener('keydown', handleEsc)
		}
	}, [isOpen])

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	const handleClose = () => {
		setIsExiting(true)
		setTimeout(() => {
			onClose()
			resetForm()
		}, 200)
	}

	const handleStepChange = (newStep: number, direction: 'next' | 'prev') => {
		setStepDirection(direction)
		setIsStepTransitioning(true)

		setTimeout(() => {
			setStep(newStep)
			setTimeout(() => {
				setIsStepTransitioning(false)
			}, 10)
		}, 200)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))

		setIsSubmitting(false)
		setIsSubmitted(true)

		// Reset after showing success message
		setTimeout(() => {
			handleClose()
		}, 2000)
	}

	const resetForm = () => {
		setStep(1)
		setSentiment(null)
		setFeedbackText('')
		setEmail('')
		setIsSubmitted(false)
	}

	if (!isVisible) return null

	return (
		<Portal>
			<div
				className={`fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center transition-opacity duration-200 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}
				onClick={handleClose}
				style={{ backdropFilter: 'blur(2px)' }}
			>
				<div
					className={`bg-[#1E1E1E] border border-[#3E3E3E] rounded-lg shadow-lg w-full max-w-md mx-4 transition-all duration-300 ease-in-out ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center justify-between p-4 border-b border-[#3E3E3E]">
						<h3 className="text-lg font-medium text-white">
							Share your feedback
						</h3>
						<button
							onClick={handleClose}
							className="text-gray-400 hover:text-white transition-colors transform hover:rotate-90 duration-200"
						>
							<X size={18} />
						</button>
					</div>

					<div className="p-6 overflow-hidden">
						{isSubmitted ? (
							<div className="flex flex-col items-center justify-center py-8 animate-in fade-in slide-in-from-bottom duration-500">
								<div className="bg-emerald-500/20 text-emerald-500 p-3 rounded-full mb-4 animate-bounce">
									<Send size={24} />
								</div>
								<h4 className="text-lg font-medium text-white mb-2">
									Thank you for your feedback!
								</h4>
								<p className="text-gray-400 text-center">
									Your input helps us improve our product.
								</p>
							</div>
						) : (
							<form
								onSubmit={handleSubmit}
								className="relative"
							>
								<div
									className="relative overflow-hidden"
									style={{ minHeight: '250px' }}
								>
									<div
										className={`transition-all duration-300 ease-in-out absolute w-full ${
											isStepTransitioning
												? stepDirection === 'next'
													? '-translate-x-full opacity-0'
													: 'translate-x-full opacity-0'
												: 'translate-x-0 opacity-100'
										} ${step !== 1 ? 'pointer-events-none absolute' : ''}`}
									>
										{step === 1 && (
											<div className="space-y-6">
												<div>
													<p className="text-white mb-4">
														How would you rate your
														experience with
														Supabase?
													</p>
													<div className="flex justify-center gap-8">
														<button
															type="button"
															onClick={() => {
																setSentiment(
																	'positive'
																)
																handleStepChange(
																	2,
																	'next'
																)
															}}
															className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
																sentiment ===
																'positive'
																	? 'bg-emerald-500/20 text-emerald-500'
																	: 'bg-[#2E2E2E] text-gray-400 hover:bg-[#3E3E3E] hover:text-white'
															}`}
														>
															<Smile
																size={32}
																className="transition-transform duration-200 hover:animate-bounce"
															/>
															<span className="mt-2 text-sm">
																Good
															</span>
														</button>
														<button
															type="button"
															onClick={() => {
																setSentiment(
																	'neutral'
																)
																handleStepChange(
																	2,
																	'next'
																)
															}}
															className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
																sentiment ===
																'neutral'
																	? 'bg-amber-500/20 text-amber-500'
																	: 'bg-[#2E2E2E] text-gray-400 hover:bg-[#3E3E3E] hover:text-white'
															}`}
														>
															<Meh
																size={32}
																className="transition-transform duration-200 hover:animate-pulse"
															/>
															<span className="mt-2 text-sm">
																Okay
															</span>
														</button>
														<button
															type="button"
															onClick={() => {
																setSentiment(
																	'negative'
																)
																handleStepChange(
																	2,
																	'next'
																)
															}}
															className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
																sentiment ===
																'negative'
																	? 'bg-red-500/20 text-red-500'
																	: 'bg-[#2E2E2E] text-gray-400 hover:bg-[#3E3E3E] hover:text-white'
															}`}
														>
															<Frown
																size={32}
																className="transition-transform duration-200 hover:animate-pulse"
															/>
															<span className="mt-2 text-sm">
																Bad
															</span>
														</button>
													</div>
												</div>
											</div>
										)}
									</div>

									<div
										className={`transition-all duration-300 ease-in-out absolute w-full ${
											isStepTransitioning
												? stepDirection === 'next'
													? 'translate-x-0 opacity-100'
													: '-translate-x-full opacity-0'
												: step === 2
													? 'translate-x-0 opacity-100'
													: 'translate-x-full opacity-0'
										} ${step !== 2 ? 'pointer-events-none absolute' : ''}`}
									>
										{step === 2 && (
											<div className="space-y-6">
												<div className="animate-in fade-in slide-in-from-right duration-300">
													<label
														htmlFor="feedback"
														className="block text-white mb-2"
													>
														Tell us more about your
														experience
													</label>
													<textarea
														id="feedback"
														rows={4}
														value={feedbackText}
														onChange={(e) =>
															setFeedbackText(
																e.target.value
															)
														}
														placeholder={
															sentiment ===
															'positive'
																? 'What did you like most?'
																: sentiment ===
																	  'negative'
																	? 'What could we improve?'
																	: 'Share your thoughts...'
														}
														className="w-full p-3 bg-[#2E2E2E] border border-[#3E3E3E] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
														required
													/>
												</div>

												<div className="animate-in fade-in slide-in-from-right duration-300 delay-100">
													<label
														htmlFor="email"
														className="block text-white mb-2"
													>
														Email (optional)
													</label>
													<input
														type="email"
														id="email"
														value={email}
														onChange={(e) =>
															setEmail(
																e.target.value
															)
														}
														placeholder="your@email.com"
														className="w-full p-3 bg-[#2E2E2E] border border-[#3E3E3E] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
													/>
													<p className="mt-1 text-xs text-gray-400">
														We'll only use this to
														follow up on your
														feedback if needed.
													</p>
												</div>

												<div className="flex justify-between animate-in fade-in slide-in-from-right duration-300 delay-200">
													<button
														type="button"
														onClick={() =>
															handleStepChange(
																1,
																'prev'
															)
														}
														className="px-4 py-2 bg-[#2E2E2E] hover:bg-[#3E3E3E] text-white rounded-md transition-all duration-200 transform hover:scale-105"
													>
														Back
													</button>
													<button
														type="submit"
														disabled={
															isSubmitting ||
															!feedbackText
														}
														className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105"
													>
														{isSubmitting ? (
															<>
																<Loader2
																	size={16}
																	className="animate-spin"
																/>
																Submitting...
															</>
														) : (
															<>Submit feedback</>
														)}
													</button>
												</div>
											</div>
										)}
									</div>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		</Portal>
	)
}
