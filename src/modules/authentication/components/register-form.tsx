"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Checkbox, Input } from "@/shared/components/ui";
import { CoreButton } from "@/shared/components/core/core-button";
import { formAnimations } from '@/shared/animations/form';
import { getBrowserInfo } from '@/modules/user-metrics/helpers/get-browser-info';
import {
    registerMutation,
    type RegisterFormState
} from '../api/mutations/register';
import { useActionState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <CoreButton
            type="submit"
            variant="primary"
            fullWidth
            isLoading={pending}
            loadingText="Creating account..."
            className="mt-5"
        >
            Create account
        </CoreButton>
    );
}

const initialState: RegisterFormState = {
    message: null,
    success: false,
};

export function RegisterForm() {
    const router = useRouter();
    const formRef = React.useRef<HTMLFormElement>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Basic validation
        const email = formData.get('email')?.toString() || '';
        const password = formData.get('password')?.toString() || '';
        const firstName = formData.get('firstName')?.toString() || '';
        const lastName = formData.get('lastName')?.toString() || '';

        if (!email.trim()) {
            toast.error('Email is required');
            return;
        }
        if (!password.trim()) {
            toast.error('Password is required');
            return;
        }
        if (!firstName.trim()) {
            toast.error('First name is required');
            return;
        }
        if (!lastName.trim()) {
            toast.error('Last name is required');
            return;
        }

        try {
            const result = await registerMutation(formData);
            if (result.success) {
                toast.success(result.message || 'Registration successful', {
                    description: "Redirecting you to the dashboard...",
                });
                router.push('/dashboard');
            } else {
                toast.error(result.message || 'Registration failed');
                setError(result.message || 'Registration failed');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            toast.error(message);
            setError(message);
        }
    };

    return (
        <motion.div
            variants={formAnimations.container}
            initial="hidden"
            animate="show"
        >
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col w-full">
                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 text-red-500 rounded-lg">
                        {error}
                    </div>
                )}

                <motion.div variants={formAnimations.item}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="First name"
                                name="firstName"
                                type="text"
                                placeholder="First Name"
                                required
                                className="mb-5"
                            />
                        </div>
                        <div>
                            <Input
                                label="Last name"
                                name="lastName"
                                type="text"
                                placeholder="Last Name"
                                required
                                className="mb-5"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={formAnimations.item}>
                    <Input
                        label="Email address"
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        className="mb-5"
                    />
                </motion.div>

                <motion.div variants={formAnimations.item}>
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        showPasswordToggle
                        className="mb-5"
                    />
                </motion.div>

                <motion.div variants={formAnimations.item}>
                    <Checkbox
                        name="terms"
                        id="terms"
                        label="I agree to the Terms of Service and Privacy Policy"
                        labelClassName="text-neutral-300 -translate-y-1 text-sm"
                        required
                    />
                </motion.div>

                <motion.div variants={formAnimations.item}>
                    <SubmitButton />
                </motion.div>
            </form>
        </motion.div>
    );
} 