'use client'

export interface CodeExampleProps {
	language?: string
	code: string
	title?: string
}

export function CodeExample({ language = 'typescript', code, title }: CodeExampleProps) {
	return (
		<div className="rounded-md border border-[#1E1E1E] bg-[#0D0C0C] overflow-hidden">
			{title && (
				<div className="border-b border-[#1E1E1E] px-4 py-2 bg-[#1E1E1E]/30">
					<h3 className="text-sm font-medium text-[#F2F0ED]">{title}</h3>
				</div>
			)}
			<pre className="p-4 overflow-x-auto">
				<code className={`language-${language}`}>{code}</code>
			</pre>
		</div>
	)
}

export default function CodeExamples() {
	return (
		<div className="space-y-6">
			<CodeExample
				title="JWT Authentication"
				language="typescript"
				code={`// Simple JWT implementation
import { SignJWT, jwtVerify } from 'jose'

export async function createToken(payload) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret)
}`}
			/>
		</div>
	)
}
