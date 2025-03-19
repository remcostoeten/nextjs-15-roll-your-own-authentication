import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"
import { ForumSidebar } from "@/views/forum/forum-sidebar"

export const metadata: Metadata = {
    title: "Forum | RAIOA",
    description: "Join the discussion and share your thoughts with the community",
}

export default function ForumLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#0D0C0C]">
            <Header />
            <main className="container mx-auto pt-20 px-4">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-64 lg:w-72">
                        <ForumSidebar />
                    </div>
                    <div className="flex-1">{children}</div>
                </div>
            </main>
            <Footer />
        </div>
    )
} 