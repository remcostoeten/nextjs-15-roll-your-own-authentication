import React from 'react';

type AuthDividerProps = {
    text?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function AuthDivider({ text = 'or', ...props }: AuthDividerProps) {
    return (
        <div className="relative my-6 flex items-center" {...props}>
            <div className="flex-grow border-t border-gray-200"></div>
            {text && (
                <span className="mx-4 flex-shrink text-xs text-gray-500">{text}</span>
            )}
            <div className="flex-grow border-t border-gray-200"></div>
        </div>
    );
} 