import { Suspense } from 'react';
import { LoginForm } from './login-form';
import { Button, Input, Label } from 'ui';
// // app/(auth)/login/page.tsx
// "use client"
// import { login } from "@/modules/authenticatie/server/mutations/login"
// import Form from "next/form"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { useState, useTransition } from "react"

// export default function LoginPage() {
//   const router = useRouter()
//   const [isPending, startTransition] = useTransition()
//   const [error, setError] = useState("")

//   const onSubmit = async (formData: FormData) => {
//     startTransition(async () => {
//       const result = await login(formData)
//       if (result?.error) {
//         setError(result.error)
//       } else {
//         router.replace("/dashboard")
//       }
//     })
//   }

//   return (
//     <Form action={onSubmit} className="space-y-6">
//       <div className="space-y-2 text-center">
//         <h1 className="text-2xl font-semibold">Login</h1>
//         <p className="text-muted-foreground">Welcome back!</p>
//       </div>

//       {error && <p className="text-sm text-destructive">{error}</p>}

//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="email">Email</Label>
//           <Input name="email" type="email" required />
//         </div>
//         <div>
//           <Label htmlFor="password">Password</Label>
//           <Input name="password" type="password" required />
//         </div>
//       </div>

//       <Button type="submit" className="w-full" disabled={isPending}>
//         {isPending ? "Logging in..." : "Login"}
//       </Button>

//       <p className="text-sm text-center">
//         Don't have an account?{" "}
//         <Link href="/register" className="underline underline-offset-4">
//           Register
//         </Link>
//       </p>
//     </Form>
//   )
// }

export default function LoginPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginForm />
		</Suspense>
	);
}
