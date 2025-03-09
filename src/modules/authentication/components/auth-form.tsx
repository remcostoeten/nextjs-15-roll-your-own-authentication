"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useAuth } from "../hooks";
import { loginSchema } from "../api/models/z.login";
import { Spinner } from "@/shared/components/effects/spinner";
import { useFormStatus } from "react-dom";
import { Checkbox, Input } from "@/shared/components/ui";
import { cn } from "helpers";

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
        <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#f8f8f8" }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 17
            }}
            type="submit"
            disabled={pending}
            className="px-10 py-2.5 mt-5 text-center text-black bg-white rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {pending ? (
                <motion.div
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <Spinner size="sm" color="black" className="mr-2" />
                    <span>Signing in...</span>
                </motion.div>
            ) : (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    Sign in
                </motion.span>
            )}
        </motion.button>
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
    const [isVisible, setIsVisible] = React.useState(false);
    const { login } = useAuth();

    React.useEffect(() => {
        setIsVisible(true);
    }, []);

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
        <>
            <div className={cn(
                "mb-8 opacity-0",
                isVisible && "animate-fade-in-1"
            )}>
                <motion.h1
                    className="text-2xl font-bold text-white mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    Welcome back
                </motion.h1>
                <motion.p
                    className="text-neutral-400 text-sm"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Sign in to your account to continue
                </motion.p>
            </div>

            <form action={loginAction} className="flex flex-col w-full">
                <div
                    className={cn(
                        "opacity-0",
                        isVisible && "animate-fade-in-2"
                    )}
                >
                    <Input
                        label="Email address"
                        name="email"
                        type="email"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        className="mb-5"
                    />
                </div>

                <div
                    className={cn(
                        "opacity-0",
                        isVisible && "animate-fade-in-3"
                    )}
                >
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
                </div>

                <div
                    className={cn(
                        "flex justify-between items-center mt-2 mb-4 opacity-0",
                        isVisible && "animate-fade-in-4"
                    )}
                >
                    <RememberMe />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="text-white hover:underline focus:underline text-sm"
                    >
                        Forgot password?
                    </motion.button>
                </div>

                <div
                    className={cn(
                        "opacity-0",
                        isVisible && "animate-fade-in-5"
                    )}
                >
                    <SubmitButton />
                </div>
            </form>
        </>
    );
}
