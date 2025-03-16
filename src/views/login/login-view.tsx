"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SocialAuthButton } from "@/modules/authentication/components/social-auth-button";
import { Divider } from "@/shared/components/ui/divider";
import { AuthForm } from "@/modules/authentication/components/auth-form";
import { GitHubIcon, DiscordIcon } from "@/modules/authentication/components/icons";

export default function LoginView() {
    const router = useRouter();

    const handleGitHubLogin = () => {
        // Implement GitHub login
        console.log("GitHub login");
    };

    const handleDiscordLogin = () => {
        console.log("Discord login");
    };

    const handleSignUp = () => {
        router.push("/register");
    };

    return (
        <main className="overflow-hidden text-sm bg-white">
            <section className="flex flex-col justify-center items-center px-20 py-40 w-full bg-neutral-950 max-md:px-5 max-md:py-24 max-md:max-w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col mb-0 max-w-full w-[401px] max-md:mb-2.5"
                >
                    <h1 className="self-start text-3xl font-medium text-white">
                        Welcome back
                    </h1>
                    <p className="self-start mt-3 text-zinc-500">
                        Sign in to your account to continue
                    </p>

                    <div className="space-y-3 mt-8">
                        <SocialAuthButton
                            icon={<GitHubIcon className="w-4 h-4" />}
                            onClick={handleGitHubLogin}
                        >
                            Continue with GitHub
                        </SocialAuthButton>

                        <SocialAuthButton
                            icon={<DiscordIcon className="w-6 h-4 text-red-400" />}
                            onClick={handleDiscordLogin}
                        >
                            Continue with Discord
                        </SocialAuthButton>
                    </div>

                    <Divider text="or" />

                    <AuthForm />

                    <div className="flex gap-1.5 self-center mt-8 max-w-full w-[210px]">
                        <span className="text-stone-500">Don't have an account?</span>
                        <motion.button
                            className="text-offwhite underline"
                            onClick={handleSignUp}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign up
                        </motion.button>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
