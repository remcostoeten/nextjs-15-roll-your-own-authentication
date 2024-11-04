'use client'

import SubmitButton from './submit-button'

export default function SignUpForm() {
	return (
		<form action="" className="space-y-4">
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-zinc-200"
				>
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					required
					className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 
            px-3 py-2 text-zinc-100 placeholder-zinc-400 focus:border-white 
            focus:outline-none focus:ring-1 focus:ring-white"
					placeholder="you@example.com"
				/>
			</div>
			<div>
				<label
					htmlFor="password"
					className="block text-sm font-medium text-zinc-200"
				>
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					autoComplete="new-password"
					required
					className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 
            px-3 py-2 text-zinc-100 placeholder-zinc-400 focus:border-white 
            focus:outline-none focus:ring-1 focus:ring-white"
					placeholder="••••••••"
				/>
			</div>
			<div>
				<label
					htmlFor="confirmPassword"
					className="block text-sm font-medium text-zinc-200"
				>
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					autoComplete="new-password"
					required
					className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 
            px-3 py-2 text-zinc-100 placeholder-zinc-400 focus:border-white 
            focus:outline-none focus:ring-1 focus:ring-white"
					placeholder="••••••••"
				/>
			</div>
			<div className="text-sm text-zinc-400">
				<p>Password must contain:</p>
				<ul className="list-disc list-inside mt-1">
					<li>At least 8 characters</li>
					<li>One uppercase letter</li>
					<li>One number</li>
					<li>One special character</li>
				</ul>
			</div>
			<SubmitButton variant="signup" />
		</form>
	)
}
