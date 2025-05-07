export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6">{children}</div>
      </body>
    </html>
  )
} 