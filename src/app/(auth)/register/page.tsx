'use client'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Github, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { showToast } from '../../../lib/toast'
import { registerMutation } from '../../../mutations/register'

export default function RegisterPage() {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		const result = await registerMutation(email, password)

		if (result.success) {
			showToast.success(result.message || 'Registration successful!')
			router.push('/login?registered=true')
		} else {
			showToast.error(result.error || 'Registration failed')
		}

		setIsLoading(false)
	}

	return (
		<div className="min-h-screen h-screen flex">
			<div className="w-1/2 relative overflow-hidden rounded-r-3xl">
				<Image
					src="/green-gradient.svg"
					alt="Gradient background"
					fill
					className="object-cover"
				/>
				<div className="relative z-10 p-12">
					<div className="flex items-center gap-2 text-white mb-24">
						<div className="w-6 h-6 bg-white rounded-full" />
						<span className="font-semibold">OnlyPipe</span>
					</div>
					<div className="text-white">
						<h1 className="text-4xl font-semibold mb-4">Get Started<br />with Us</h1>
						<p className="text-white/80 mb-8">Complete these easy steps<br />to register your account.</p>

						<div className="flex gap-4">
							<div className="bg-white text-black p-4 rounded-lg w-32">
								<div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center mb-4">1</div>
								<p className="text-sm font-medium">Sign up your account</p>
							</div>
							<div className="bg-white/10 backdrop-blur p-4 rounded-lg w-32">
								<div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mb-4">2</div>
								<p className="text-sm">Set up your workspace</p>
							</div>
							<div className="bg-white/10 backdrop-blur p-4 rounded-lg w-32">
								<div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mb-4">3</div>
								<p className="text-sm">Set up your profile</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="w-1/2 p-12 flex flex-col justify-center max-w-xl mx-auto">
				<h2 className="text-2xl font-semibold mb-2">Sign Up Account</h2>
				<p className="text-gray-600 mb-8">Enter your personal data to create your account.</p>

				<div className="flex gap-4 mb-8">
					<Button variant="outline" className="flex-1 gap-2">
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
							<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
							<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
							<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
						</svg>
						Google
					</Button>
					<Button variant="outline" className="flex-1 gap-2">
						<Github className="w-5 h-5" />
						Github
					</Button>
				</div>

				<div className="relative mb-8">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-200"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray-500">Or</span>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
							<Input
								placeholder="eg. John"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className="bg-gray-50"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
							<Input
								placeholder="eg. Francisco"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="bg-gray-50"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<Input
							type="email"
							placeholder="eg. johnfrans@gmail.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="bg-gray-50"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<Input
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="bg-gray-50"
						/>
						<p className="text-xs text-gray-500 mt-1">Must be at least 8 characters.</p>
					</div>

					<Button
						type="submit"
						className="w-full bg-black text-white hover:bg-black/90"
						disabled={isLoading}
					>
						{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign Up'}
					</Button>

					<p className="text-center text-sm text-gray-600">
						Already have an account?{' '}
						<Link href="/login" className="text-black hover:underline">
							Log in
						</Link>
					</p>
				</form>
				<ToastContainer />
			</div>
		</div>
	)
}
