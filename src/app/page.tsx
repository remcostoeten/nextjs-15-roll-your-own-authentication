import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { SecurityShowcase } from "@/components/sections/security-showcase"
import MatrixGrid from "@/components/matrix-grid/matrix-grid"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D0C0C]">
      <Header />
      <main className="relative pt-14">
        <Hero initialCommit={null} />
        <MatrixGrid />
        <Features />
        <SecurityShowcase />
      </main>
      <Footer />
    </div>
  )
}

