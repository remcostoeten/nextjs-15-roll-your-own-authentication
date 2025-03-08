import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Header */}
            <header className="w-full border-b border-gray-200 bg-white py-3">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                            <span className="text-white font-bold">R</span>
                        </div>
                        <span className="ml-2 text-lg font-medium text-gray-900">Raioa</span>
                    </Link>
                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/docs"
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/pricing"
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow flex items-center justify-center">
                {children}
            </main>

            {/* Footer */}
            <footer className="py-6 border-t border-gray-200 bg-white">
                <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                    <div className="mb-4 sm:mb-0">
                        &copy; {new Date().getFullYear()} Raioa, Inc. All rights reserved.
                    </div>
                    <div className="flex space-x-6">
                        <Link href="/privacy" className="hover:text-gray-900">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-gray-900">
                            Terms of Service
                        </Link>
                        <Link href="/contact" className="hover:text-gray-900">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
} 