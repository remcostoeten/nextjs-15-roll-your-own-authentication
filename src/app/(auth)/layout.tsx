export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {children}
        </main>
    )
} 
