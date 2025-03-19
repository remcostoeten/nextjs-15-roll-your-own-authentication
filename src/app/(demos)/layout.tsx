import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Demos | RAIOA",
    description: "Demo components and features for the RAIOA application",
}

export default function DemosLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#0D0C0C]">
            <Header />
            <main className="relative pt-14 container mx-auto px-4">
                {children}
            </main>
            <Footer />
        </div>
    )
} 