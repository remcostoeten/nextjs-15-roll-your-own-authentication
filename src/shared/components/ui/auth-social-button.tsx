import React from 'react';

type Provider = 'github' | 'google' | 'twitter';

type AuthSocialButtonProps = {
    provider: Provider;
    onClick?: () => void;
    isLoading?: boolean;
    fullWidth?: boolean;
    text?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

// Provider icons
const icons: Record<Provider, React.ReactNode> = {
    github: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
        </svg>
    ),
    google: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
        </svg>
    ),
    twitter: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
            />
        </svg>
    ),
};

// Provider colors and hover colors
const providerStyles: Record<Provider, { bg: string; hover: string; text: string }> = {
    github: {
        bg: 'bg-gray-900',
        hover: 'hover:bg-gray-800',
        text: 'text-white',
    },
    google: {
        bg: 'bg-white',
        hover: 'hover:bg-gray-50',
        text: 'text-gray-800',
    },
    twitter: {
        bg: 'bg-[#1DA1F2]',
        hover: 'hover:bg-[#0c8ed9]',
        text: 'text-white',
    },
};

export function AuthSocialButton({
    provider,
    onClick,
    isLoading = false,
    fullWidth = false,
    text,
    className,
    ...props
}: AuthSocialButtonProps) {
    const style = providerStyles[provider];
    const defaultText = {
        github: 'Continue with GitHub',
        google: 'Continue with Google',
        twitter: 'Continue with Twitter',
    }[provider];

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isLoading}
            className={`flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${style.bg
                } ${style.hover} ${style.text} shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${fullWidth ? 'w-full' : ''
                } ${className || ''}`}
            {...props}
        >
            {isLoading ? (
                <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                    />
                </svg>
            ) : (
                <span className="mr-2">{icons[provider]}</span>
            )}
            <span>{text || defaultText}</span>
        </button>
    );
} 