"use client"

import * as React from "react"

import { cn } from "helpers"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
    showPasswordToggle?: boolean
    label?: string
    labelClassName?: string
    optional?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, showPasswordToggle, label, labelClassName, optional, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)
        const [showError, setShowError] = React.useState(false)
        const inputId = React.useId()
        const errorId = error ? `${inputId}-error` : undefined

        // Handle error animation
        React.useEffect(() => {
            if (error) {
                setShowError(true)
            } else {
                setShowError(false)
            }
        }, [error])

        const togglePasswordVisibility = () => {
            setShowPassword((prev) => !prev)
        }

        const inputType = type === "password" && showPassword ? "text" : type

        return (
            <div className="w-full">
                {label && (
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor={inputId} className={cn("text-zinc-500", labelClassName)}>
                            {label}
                            {optional && <span className="text-zinc-400 text-sm ml-1">(optional)</span>}
                        </label>
                    </div>
                )}
                <div className="relative w-full">
                    <input
                        id={inputId}
                        type={inputType}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-solid border-neutral-800 bg-transparent px-3 text-white focus:outline-none focus:border-inherit/50 transition-all duration-300 hover:border-inherit/70",
                            showError ? "border-red-700 border-2 animate-pulse" : "",
                            showPasswordToggle && type === "password" && "pr-10",
                            className,
                        )}
                        ref={ref}
                        aria-invalid={!!error}
                        aria-describedby={errorId}
                        {...props}
                    />

                    {showPasswordToggle && type === "password" && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <div className="relative w-5 h-5">
                                <EyeIcon
                                    className={cn(
                                        "h-4 w-4 absolute transition-all duration-300 ease-in-out ",
                                        showPassword ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100",
                                    )}
                                    color="gray"
                                />
                                <EyeOffIcon
                                    className={cn(
                                        "h-4 w-4 absolute transition-all duration-300 ease-in-out",
                                        showPassword ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75",
                                    )}
                                    color="red"
                                />
                            </div>
                        </button>
                    )}

                    {error && (
                        <span
                            id={errorId}
                            className={cn(
                                "text-red-500 text-sm mt-1 block transition-all duration-500 ease-in-out",
                                showError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                            )}
                            style={{ transitionDelay: "150ms" }}
                        >
                            {error}
                        </span>
                    )}
                </div>
            </div>
        )
    },
)

Input.displayName = "Input"

export { Input }

