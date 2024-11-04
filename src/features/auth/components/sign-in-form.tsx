'use client'

import SubmitButton from './submit-button'

export default function SignInForm() {
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
					autoComplete="current-password"
					required
					className="mt-1 block w-full rounded-md bg-zinc-800 border border-zinc-700 
            px-3 py-2 text-zinc-100 placeholder-zinc-400 focus:border-white 
            focus:outline-none focus:ring-1 focus:ring-white"
					placeholder="••••••••"
				/>
			</div>
			<SubmitButton variant="signin" />
		</form>
	)
}
