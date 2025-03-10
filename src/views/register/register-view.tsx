"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SocialAuthButton } from "@/modules/authentication/components/social-auth-button";
import { Divider } from "@/shared/components/ui/divider";
import { RegisterForm } from "@/modules/authentication/components/register-form";
import { GitHubIcon, DiscordIcon } from "@/modules/authentication/components/icons";

export default function RegisterView() {
    const router = useRouter();

    const handleGitHubRegister = () => {
        // Implement GitHub registration
        console.log("GitHub registration");
    };

    const handleDiscordRegister = () => {
        console.log("Discord registration");
    };

    const handleSignIn = () => {
        router.push("/login");
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
                        Create an account
                    </h1>
                    <p className="self-start mt-3 text-zinc-500 max-w-sm">
                        Join our community and experience seamless authentication. Your data is secure, and you're in control.
                    </p>

                    <div className="space-y-3 mt-8">
                        <SocialAuthButton
                            icon={<GitHubIcon className="w-4 h-4" />}
                            onClick={handleGitHubRegister}
                        >
                            Continue with GitHub
                        </SocialAuthButton>

                        <SocialAuthButton
                            icon={<DiscordIcon className="w-6 h-4 text-red-400" />}
                            onClick={handleDiscordRegister}
                        >
                            Continue with Discord
                        </SocialAuthButton>
                    </div>

                    <Divider text="or" />

                    <RegisterForm />

                    <div className="flex gap-1.5 self-center mt-8 max-w-full w-[210px]">
                        <span className="text-stone-500">Already have an account?</span>
                        <motion.button
                            className="text-offwhite underline"
                            onClick={handleSignIn}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign in
                        </motion.button>
                    </div>
                </motion.div>
            </section>
        </main>
    );
} 