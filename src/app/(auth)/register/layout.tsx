import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Account | Your App Name',
    description: 'Sign up to get started with your account'
}

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 
