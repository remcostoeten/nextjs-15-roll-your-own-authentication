import { AppSidebar } from '@/modules/dashboard/app-sidebar'

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  )
} 