"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useAuth } from "../hooks";
import { userRegistrationSchema } from "../models";
import { Spinner } from "@/shared/components/effects/spinner";
import { useFormStatus } from "react-dom";
import { Checkbox, Input } from "@/shared/components/ui";
import { cn } from "helpers";
import { CoreButton } from "@/shared/components/core/core-button";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
};

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

export function RegisterForm() {
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const { register } = useAuth();

    async function registerAction(formData: FormData) {
        setErrors({});

        try {
            const data = {
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                confirmPassword: formData.get("confirmPassword") as string,
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
            };

            const validatedData = userRegistrationSchema.parse(data);
            await register(validatedData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        formattedErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(formattedErrors);
            }
        }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
        >
            <form action={registerAction} className="flex flex-col w-full">
                <motion.div variants={item}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="First name"
                                name="firstName"
                                type="text"
                                defaultValue={formData.firstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                error={errors.firstName}
                                className="mb-5"
                            />
                        </div>
                        <div>
                            <Input
                                label="Last name"
                                name="lastName"
                                type="text"
                                defaultValue={formData.lastName}
                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                error={errors.lastName}
                                className="mb-5"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={item}>
                    <Input
                        label="Email address"
                        name="email"
                        type="email"
                        defaultValue={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        error={errors.email}
                        className="mb-5"
                    />
                </motion.div>

                <motion.div variants={item}>
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        defaultValue={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        error={errors.password}
                        showPasswordToggle
                        className="mb-5"
                    />
                </motion.div>

                <motion.div variants={item}>
                    <Input
                        label="Confirm password"
                        name="confirmPassword"
                        type="password"
                        defaultValue={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        error={errors.confirmPassword}
                        showPasswordToggle
                        className="mb-5"
                    />
                </motion.div>

                <motion.div variants={item}>
                    <Checkbox
                        name="terms"
                        id="terms"
                        label="I agree to the Terms of Service and Privacy Policy"
                        labelClassName="text-neutral-300 -translate-y-1 text-sm"
                        required
                    />
                </motion.div>

                <motion.div variants={item}>
                    <SubmitButton />
                </motion.div>
            </form>
        </motion.div>
    );
} 