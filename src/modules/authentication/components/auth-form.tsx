"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useAuth } from "../hooks";
import { loginSchema } from "../api/models/z.login";
import { Spinner } from "@/shared/components/effects/spinner";
import { useFormStatus } from "react-dom";
import { Checkbox, Input } from "@/shared/components/ui";
import { cn } from "@/shared/utils/helpers";
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

function RememberMe() {
    const [rememberMe, setRememberMe] = React.useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("rememberMe") === "true";
        }
        return false;
    });

    const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setRememberMe(newValue);
    };

    return (
        <Checkbox
            name="rememberMe"
            id="rememberMe"
            checked={rememberMe}
            onChange={handleRememberMe}
            label="Remember me"
            labelClassName="text-neutral-300 -translate-y-1 text-sm"
        />
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <CoreButton
            type="submit"
            variant="primary"
            fullWidth
            isLoading={pending}
            loadingText="Signing in..."
            className="mt-5"
        >
            Sign in
        </CoreButton>
    );
}

export function AuthForm() {
    const [email, setEmail] = React.useState<string>(() => {
        if (typeof window !== 'undefined' && localStorage.getItem("rememberMe") === "true") {
            return localStorage.getItem("rememberedEmail") || "";
        }
        return "";
    });
    const [password, setPassword] = React.useState("");
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const { login } = useAuth();

    async function loginAction(formData: FormData) {
        setErrors({});

        try {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const rememberMe = formData.get("rememberMe") === "on";

            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
                localStorage.setItem("rememberMe", "true");
            } else {
                localStorage.removeItem("rememberedEmail");
                localStorage.removeItem("rememberMe");
            }

            const data = loginSchema.parse({
                email,
                password,
            });

            await login(data);
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
            <motion.div variants={item}>
                <motion.h1
                    className="text-2xl font-bold text-white mb-2"
                >
                    Welcome back
                </motion.h1>
                <motion.p
                    className="text-neutral-400 text-sm"
                >
                    Sign in to your account to continue
                </motion.p>
            </motion.div>

            <form action={loginAction} className="flex flex-col w-full mt-8">
                <motion.div variants={item}>
                    <Input
                        label="Email address"
                        name="email"
                        type="email"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        className="mb-5"
                    />
                </motion.div>

                <motion.div variants={item}>
                    <div className="flex justify-between items-center">
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            defaultValue={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            showPasswordToggle
                            className="w-full"
                        />
                    </div>
                </motion.div>

                <motion.div
                    variants={item}
                    className="flex justify-between items-center mt-2 mb-4"
                >
                    <RememberMe />
                </motion.div>

                <motion.div variants={item}>
                    <SubmitButton />
                </motion.div>

                <motion.div
                    variants={item}
                    className="mt-4 text-center"
                >
                    <p className="text-neutral-400 text-sm">
                        No account yet?{' '}
                        <CoreButton
                            variant="link"
                            size="sm"
                            type="button"
                            href="/register"
                            className="text-primary hover:text-primary/90 font-medium p-0 h-auto"
                        >
                            Create one
                        </CoreButton>
                    </p>
                </motion.div>
            </form>
        </motion.div>
    );
}
