export * from './sign-in.action'
export * from './sign-out.action'
export * from './sign-up.action'
// // import { UserAuthService } from '../services/auth.service'
// // import { DrizzleStorageService } from '../services/drizzle.service'
// // import { JWTService } from '../services/jwt.service'
// // import { SessionManager } from '../session'

// // export const storageService = new DrizzleStorageService()
// // export const authService = new UserAuthService(storageService)
// // export const tokenService = new JWTService()
// // export const sessionManager = new SessionManager(tokenService)

// // export * from './action.sign-in'
// // export * from './action.sign-up'
// // actions/auth.ts
// 'use server'

// import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { z } from 'zod';
// import { AuthState } from '../types';

// const signUpSchema = z.object({
//   email: z.string().email('Invalid email'),
//   password: z.string()
//     .min(8, 'Password must be at least 8 characters')
//     .regex(/[A-Z]/, 'Must contain uppercase')
//     .regex(/[0-9]/, 'Must contain number')
//     .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
//   confirmPassword: z.string()
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ['confirmPassword']
// });

// const signInSchema = z.object({
//   email: z.string().email('Invalid email'),
//   password: z.string().min(1, 'Required'),
// });

// function setSession(userId: string, email: string) {
//   const token = jwt.sign(
//     { userId, email },
//     process.env.JWT_SECRET || 'secret',
//     { expiresIn: '1d' }
//   );

//   cookies().set('session', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     maxAge: 86400
//   });
// }

// export async function signUp(prevState: AuthState, formData: FormData): Promise<AuthState> {
//   try {
//     const validatedFields = signUpSchema.safeParse({
//       email: formData.get('email'),
//       password: formData.get('password'),
//       confirmPassword: formData.get('confirmPassword')
//     });

//     if (!validatedFields.success) {
//       return {
//         error: validatedFields.error.flatten().fieldErrors
//       };
//     }

//     const { email, password } = validatedFields.data;

//     // Add your user creation logic here
//     // const user = await db.user.create({ ... })

//     setSession('userId', email);
//     redirect('/dashboard');
//   } catch (error) {
//     return {
//       error: {
//         _form: ['Failed to create account']
//       }
//     };
//   }
// }

// export async function signIn(prevState: AuthState, formData: FormData): Promise<AuthState> {
//   try {
//     const validatedFields = signInSchema.safeParse({
//       email: formData.get('email'),
//       password: formData.get('password')
//     });

//     if (!validatedFields.success) {
//       return {
//         error: validatedFields.error.flatten().fieldErrors
//       };
//     }

//     const { email, password } = validatedFields.data;

//     // Add your auth logic here
//     // const user = await db.user.findUnique({ ... })

//     setSession('userId', email);
//     redirect('/dashboard');
//   } catch (error) {
//     return {
//       error: {
//         _form: ['Invalid credentials']
//       }
//     };
//   }
// }

// export async function signOut() {
//   cookies().delete('session');
//   redirect('/login');
// }
