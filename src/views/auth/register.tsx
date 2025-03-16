'use client'

import dynamic from 'next/dynamic'
import { RegisterForm } from '@/modules/authentication/components/register-form'

function RegisterView() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <h1 className="mb-8 text-center text-3xl font-bold">Create an account</h1>
                <RegisterForm />
            </div>
        </div>
    )
}

export default dynamic(() => Promise.resolve(RegisterView), {
    ssr: false
}) 